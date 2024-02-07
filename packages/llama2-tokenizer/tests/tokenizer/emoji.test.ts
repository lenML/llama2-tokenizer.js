// test source code
import { Llama2Tokenizer } from "../../src/main";
// test build code
// import { Llama2Tokenizer } from "../../dist/main";

import { load_vocab } from "@lenml/llama2-tokenizer-vocab-emoji";

describe("EmojiTokenizer", () => {
  let tokenizer: Llama2Tokenizer;

  beforeAll(async () => {
    tokenizer = new Llama2Tokenizer();
    tokenizer.install_vocab(load_vocab());
  });

  test("emoji tokenizer", () => {
    // TODO: add tests
    // const text = `🙇‍♀️💁‍♀️🙋‍♀️`;
    // expect(tokenizer.tokenize(text)).toEqual(["👩‍👩‍👧‍👦", "🤹‍♂️", "🙇‍♀️", "👨‍💻"]);
  });
});
