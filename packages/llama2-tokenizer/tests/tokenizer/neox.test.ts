// test source code
import { Llama2Tokenizer } from "../../src/main";
// test build code
// import { Llama2Tokenizer } from "../../dist/main";

import { load_vocab } from "@lenml/llama2-tokenizer-vocab-neox";

describe("NeoXTokenizer", () => {
  test("tokenize simple", () => {
    // TODO
    // NOTE: neox tokenizer 对于unicode的分词逻辑和llama不同，需要适配
  });
});
