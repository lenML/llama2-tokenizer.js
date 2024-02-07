// test source code
import { Llama2Tokenizer } from "../../src/main";
// test build code
// import { Llama2Tokenizer } from "../../dist/main";

import { load_vocab } from "@lenml/llama2-tokenizer-vocab-chatglm3";

describe("ChatGLM3Tokenizer", () => {
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
    const text = "this is beer: 🍺";
    expect(tokenizer.tokenize(text)).toEqual([
      "this",
      " is",
      " beer",
      ":",
      " ",
      "<0xF0>",
      "<0x9F>",
      "<0x8D>",
      "<0xBA>",
    ]);
  });

  test("encode simple", () => {
    expect(tokenizer.encode("Hello this is a test")).toEqual([
      24218, 434, 323, 260, 1429,
    ]);
  });
  test("encode with utf8", () => {
    expect(tokenizer.encode("你好，世界！")).toEqual([
      39701, 31123, 31661, 31404,
    ]);
  });
  test("encode with special tokens", () => {
    tokenizer.add_special_token("<|im_start|>", 64791);
    tokenizer.add_special_token("<|im_end|>", 64792);
    expect(
      tokenizer.encode("<|im_start|>Hello this is a test<|im_end|>")
    ).toEqual([64791, 24218, 434, 323, 260, 1429, 64792]);
  });
  test("encode with unknown unicode", () => {
    const text = "this is beer: 🍺";
    expect(tokenizer.encode(text)).toEqual([
      2626, 323, 8363, 30954, 30910, 243, 162, 144, 189,
    ]);
  });

  test("decode simple", () => {
    expect(tokenizer.decode([24218, 434, 323, 260, 1429])).toEqual(
      "Hello this is a test"
    );
  });
  test("decode with utf8", () => {
    expect(tokenizer.decode([39701, 31123, 31661, 31404])).toEqual(
      "你好，世界！"
    );
  });
  test("decode with special tokens", () => {
    tokenizer.add_special_token("<|im_start|>", 64791);
    tokenizer.add_special_token("<|im_end|>", 64792);
    expect(
      tokenizer.decode([64791, 24218, 434, 323, 260, 1429, 64792])
    ).toEqual("<|im_start|>Hello this is a test<|im_end|>");
  });
  test("decode with unknown unicode", () => {
    const text = "this is beer: 🍺";
    expect(
      tokenizer.decode([2626, 323, 8363, 30954, 30910, 243, 162, 144, 189])
    ).toEqual(text);
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
    ).toEqual([24218, 434, 323, 260, 1429]);
  });
});
