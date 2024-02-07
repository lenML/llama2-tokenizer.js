// test source code
import { Llama2Tokenizer } from "../../src/main";
// test build code
// import { Llama2Tokenizer } from "../../dist/main";

import { load_vocab } from "@lenml/llama2-tokenizer-vocab-falcon";

describe("FalconTokenizer", () => {
  test("tokenize simple", () => {
    // TODO
    // NOTE: falcon tokenizer对于unicode的分词逻辑和llama不同，需要适配
  });
});
