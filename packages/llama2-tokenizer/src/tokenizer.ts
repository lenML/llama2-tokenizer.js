import { Trie } from "./Trie";

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder("utf-8");

const byteToHex = (byte: number) =>
  byte.toString(16).padStart(2, "0").toUpperCase();

export class Llama2Tokenizer {
  protected tokens_trie = new Trie();
  protected special_tokens: Record<string, number> = {};

  protected vocab: Record<string, number> = {};
  protected vocab_ids: Record<number, string> = {};

  constructor() {}

  /**
   * Install the provided vocabulary into the class instance.
   *
   * @param {Record<string, number>} vocab - The vocabulary to be installed
   */
  install_vocab(vocab: Record<string, number>) {
    this.vocab = vocab;
    this.vocab_ids = Object.fromEntries(
      Object.entries(vocab).map(([token, id]) => [id, token])
    );
    this.tokens_trie = new Trie();
    for (const [token, id] of Object.entries(vocab)) {
      this.tokens_trie.add(token);
    }
  }

  /**
   * Get the size of the vocabulary, including special tokens.
   *
   * @return {number} the size of the vocabulary
   */
  get vocab_size(): number {
    return (
      Object.keys(this.vocab).length + Object.keys(this.special_tokens).length
    );
  }

  /**
   * Get the maximum id from the vocab_ids and special_tokens.
   *
   * @return {number} the maximum id
   */
  get max_id(): number {
    // NOTE: vocab 最大可能超过 js 函数参数个数最大范围，所以不能 `Math.max(...Object.keys(this.vocab_ids))`
    let max_id = 0;
    for (const id of Object.keys(this.vocab_ids)) {
      max_id = Math.max(max_id, parseInt(id));
    }
    for (const id of Object.values(this.special_tokens)) {
      max_id = Math.max(max_id, id);
    }
    return max_id;
  }

  /**
   * Adds a special token with an optional token ID.
   *
   * @param {string} token - the special token to be added
   * @param {number} [token_id] - the optional token ID
   * @return {void}
   */
  add_special_token(token: string, token_id?: number) {
    if (token_id === undefined) {
      token_id = this.max_id + 1;
    }
    this.special_tokens[token] = token_id;
    this.tokens_trie.add(token);
  }

  /**
   * Adds special tokens to the list of tokens.
   *
   * @param {Array} tokens - An array of tokens to add. Each token can be a string or an object with `token` and `token_id` properties.
   */
  add_special_tokens(
    tokens: (
      | string
      | {
          token: string;
          token_id: number;
        }
    )[]
  ) {
    for (const token of tokens) {
      if (typeof token === "string") {
        this.add_special_token(token);
      } else {
        this.add_special_token(token.token, token.token_id);
      }
    }
  }

  /**
   * Convert an id to a token.
   *
   * @param {number} id - The id to be converted to a token.
   * @return {string} The corresponding token for the given id.
   */
  ids_to_token(id: number): string {
    const token = this.vocab_ids[id];
    const special_token = Object.entries(this.special_tokens).find(
      ([_, token_id]) => token_id === id
    );
    if (token) {
      return token;
    } else if (special_token) {
      return special_token[0];
    } else {
      throw new Error(`Unknown id: ${id}`);
    }
  }
  /**
   * token_to_id function takes a token as input and returns its corresponding id if found in the vocabulary, otherwise throws an error.
   *
   * @param {string} token - the input token
   * @return {number} the corresponding id of the input token
   */
  token_to_id(token: string): number {
    const id = this.vocab[token];
    const special_token = this.special_tokens[token];
    if (id !== undefined) {
      return id;
    } else if (special_token !== undefined) {
      return special_token;
    } else {
      throw new Error(`Unknown token: ${token}`);
    }
  }

  /**
   * Retrieve the vocabulary.
   *
   * @return {Object} a shallow copy of the vocabulary
   */
  get_vocab() {
    return { ...this.vocab, ...this.special_tokens };
  }

  /**
   * Checks if the token is a valid token.
   *
   * @param {string} token - the token to be checked
   * @return {boolean} true if the token is valid, false otherwise
   */
  valid_token(token: string): boolean {
    return token in this.vocab || token in this.special_tokens;
  }

  /**
   * Converts a string in a sequence of tokens, using the tokenizer.
   */
  tokenize(text: string): string[] {
    const tokens = this.tokens_trie.split(text);

    const result = [] as string[];
    for (const token of tokens) {
      if (this.valid_token(token)) {
        result.push(token);
      } else {
        // convert unknown unicode to <0xXX>
        // TODO: use a better way to handle unknown unicode (某些vocab不支持unknown unicode可能需要<unk>代替)
        const bytes = utf8Encoder.encode(token);
        console.log({ token, bytes });
        for (const byte of bytes) {
          result.push(`<0x${byteToHex(byte)}>`);
        }
      }
    }

    return result;
  }

  /**
   * Converts a string to a sequence of ids (integer), using the tokenizer and vocabulary.
   */
  encode(text: string): number[] {
    return this.convert_tokens_to_ids(this.tokenize(text));
  }

  /**
   * Converts a single index or a sequence of indices in a token or a sequence of tokens, using the vocabulary and added tokens.
   */
  decode(ids: number[]): string {
    return this.convert_tokens_to_string(this.convert_ids_to_tokens(ids));
  }

  /**
   * Converts a sequence of tokens (string) in a single string.
   */
  convert_tokens_to_string(tokens: string[]): string {
    for (const token of tokens) {
      if (!this.valid_token(token)) {
        throw new Error(`Unknown token: ${token}`);
      }
    }
    const chars = [] as string[];

    let index = 0;
    while (index < tokens.length) {
      let token = tokens[index];
      index += 1;
      if (!token.startsWith("<0x")) {
        chars.push(token);
        continue;
      }
      const bytes = [] as number[];
      while (token && token.startsWith("<0x")) {
        bytes.push(parseInt(token.slice(3, 5), 16));
        token = tokens[index];
        index += 1;
      }
      chars.push(utf8Decoder.decode(new Uint8Array(bytes)));
    }

    return chars.join("");
  }

  /**
   * Converts a token string (or a sequence of tokens) in a single integer id (or a sequence of ids), using the vocabulary.
   */
  convert_tokens_to_ids(tokens: string[]): number[] {
    let result: number[] = [];
    for (const token of tokens) {
      const id = this.token_to_id(token);
      result.push(id);
    }
    return result;
  }

  /**
   * Converts a single index or a sequence of indices in a token or a sequence of tokens, using the vocabulary and added tokens.
   */
  convert_ids_to_tokens(ids: number[]): string[] {
    return ids.map((id) => {
      const token = this.ids_to_token(id);
      return token;
    });
  }
}

// test
// const main = async () => {
//   const tokenizer = new Llama2Tokenizer();
//   tokenizer.load_llama2_vocab();
//   console.log(tokenizer.tokenize("你好，世界！"));
//   // ["你", "好", "，", "世", "界", "！"]
// };
// main();
