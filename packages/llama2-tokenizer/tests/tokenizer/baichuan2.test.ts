// test source code
import { Llama2Tokenizer } from "../../src/main";
// test build code
// import { Llama2Tokenizer } from "../../dist/main";

import { load_vocab } from "@lenml/llama2-tokenizer-vocab-baichuan2";

describe("Baichuan2Tokenizer", () => {
  let tokenizer: Llama2Tokenizer;

  beforeAll(async () => {
    tokenizer = new Llama2Tokenizer();
    tokenizer.install_vocab(load_vocab());
  });

  test("tokenize simple", () => {
    expect(tokenizer.tokenize("Hello this is a test")).toEqual([
      "Hello",
      " this",
      " is",
      " a",
      " test",
    ]);
  });

  test("tokenize with utf8", () => {
    expect(tokenizer.tokenize("你好，世界！")).toEqual([
      "你好",
      "，",
      "世界",
      "！",
    ]);
  });

  test("tokenize with special tokens", () => {
    const input_text = "<|im_start|>Hello this is a test<|im_end|>";
    // no special tokens case
    expect(tokenizer.tokenize(input_text)).toEqual([
      "<",
      "|",
      "im",
      "_",
      "start",
      "|",
      ">",
      "Hello",
      " this",
      " is",
      " a",
      " test",
      "<",
      "|",
      "im",
      "_",
      "end",
      "|",
      ">",
    ]);

    tokenizer.add_special_tokens(["<|im_start|>", "<|im_end|>"]);
    expect(tokenizer.tokenize(input_text)).toEqual([
      "<|im_start|>",
      "Hello",
      " this",
      " is",
      " a",
      " test",
      "<|im_end|>",
    ]);
  });

  test("tokenize with unknown unicode", () => {
    // FIXME: 🍺 不是 unknown unicode
    const text = "this is beer: 🍺";
    expect(tokenizer.tokenize(text)).toEqual([
      "this",
      " is",
      " beer",
      ":",
      " ",
      "🍺",
    ]);
  });

  test("encode simple", () => {
    expect(tokenizer.encode("Hello this is a test")).toEqual([
      23160, 1528, 1414, 1346, 2804,
    ]);
  });
  test("encode with utf8", () => {
    expect(tokenizer.encode("你好，世界！")).toEqual([16829, 65, 2089, 67]);
  });
  test("encode with special tokens", () => {
    tokenizer.add_special_token("<|im_start|>", 125698);
    tokenizer.add_special_token("<|im_end|>", 125699);
    expect(
      tokenizer.encode("<|im_start|>Hello this is a test<|im_end|>")
    ).toEqual([125698, 23160, 1528, 1414, 1346, 2804, 125699]);
  });
  test("encode with unknown unicode", () => {
    // TODO: 这个词表很大...其实是包含了几乎所有emoji的...这个case要改
    const text = "this is beer: 🍺";
    expect(tokenizer.encode(text)).toEqual([
      4943, 1414, 15488, 92345, 92311, 110027,
    ]);
  });

  test("decode simple", () => {
    expect(tokenizer.decode([23160, 1528, 1414, 1346, 2804])).toEqual(
      "Hello this is a test"
    );
  });
  test("decode with utf8", () => {
    expect(tokenizer.decode([16829, 65, 2089, 67])).toEqual("你好，世界！");
  });
  test("decode with special tokens", () => {
    tokenizer.add_special_token("<|im_start|>", 125698);
    tokenizer.add_special_token("<|im_end|>", 125699);
    expect(
      tokenizer.decode([125698, 23160, 1528, 1414, 1346, 2804, 125699])
    ).toEqual("<|im_start|>Hello this is a test<|im_end|>");
  });
  test("decode with unknown unicode", () => {
    const text = "this is beer: 🍺";
    expect(tokenizer.decode([4943, 1414, 15488, 92345, 92311, 110027])).toEqual(
      text
    );
  });

  test("convert_tokens_to_string", () => {
    expect(
      tokenizer.convert_tokens_to_string([
        "Hello",
        " this",
        " is",
        " a",
        " test",
      ])
    ).toEqual("Hello this is a test");
  });

  test("convert_tokens_to_ids", () => {
    expect(
      tokenizer.convert_tokens_to_ids(["Hello", " this", " is", " a", " test"])
    ).toEqual([23160, 1528, 1414, 1346, 2804]);
  });
});
