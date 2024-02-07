// test source code
import { Llama2Tokenizer } from "../../src/main";
// test build code
// import { Llama2Tokenizer } from "../../dist/main";

import { load_vocab } from "@lenml/llama2-tokenizer-vocab-internlm2";

describe("Internlm2Tokenizer", () => {
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
      "_start",
      "|",
      ">H",
      "ello",
      " this",
      " is",
      " a",
      " test",
      "<",
      "|",
      "im",
      "_end",
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
      9843, 550, 505, 395, 1420,
    ]);
  });
  test("encode with utf8", () => {
    expect(tokenizer.encode("你好，世界！")).toEqual([
      77230, 60353, 68339, 60477,
    ]);
  });
  test("encode with special tokens", () => {
    tokenizer.add_special_token("<|im_start|>", 92546);
    tokenizer.add_special_token("<|im_end|>", 92547);
    expect(
      tokenizer.encode("<|im_start|>Hello this is a test<|im_end|>")
    ).toEqual([92546, 9843, 550, 505, 395, 1420, 92547]);
  });
  test("encode with unknown unicode", () => {
    const text = "this is beer: 🍺";
    expect(tokenizer.encode(text)).toEqual([
      705, 505, 13033, 334, 262, 243, 162, 144, 189,
    ]);
  });

  test("decode simple", () => {
    expect(tokenizer.decode([9843, 550, 505, 395, 1420])).toEqual(
      "Hello this is a test"
    );
  });
  test("decode with utf8", () => {
    expect(tokenizer.decode([77230, 60353, 68339, 60477])).toEqual(
      "你好，世界！"
    );
  });
  test("decode with special tokens", () => {
    tokenizer.add_special_token("<|im_start|>", 92546);
    tokenizer.add_special_token("<|im_end|>", 92547);
    expect(tokenizer.decode([92546, 9843, 550, 505, 395, 1420, 92547])).toEqual(
      "<|im_start|>Hello this is a test<|im_end|>"
    );
  });
  test("decode with unknown unicode", () => {
    const text = "this is beer: 🍺";
    expect(
      tokenizer.decode([705, 505, 13033, 334, 262, 243, 162, 144, 189])
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
    ).toEqual([9843, 550, 505, 395, 1420]);
  });
});
