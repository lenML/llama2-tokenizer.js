// test source code
import { Llama2Tokenizer } from "../../src/main";
// test build code
// import { Llama2Tokenizer } from "../../dist/main";

import { load_vocab } from "@lenml/llama2-tokenizer-vocab-llama2";

describe("Llama2Tokenizer", () => {
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
      "你",
      "好",
      "，",
      "世",
      "界",
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
      16230, 456, 349, 264, 1369,
    ]);
  });
  test("encode with utf8", () => {
    expect(tokenizer.encode("你好，世界！")).toEqual([
      29383, 29530, 28924, 30050, 29822, 29267,
    ]);
  });
  test("encode with special tokens", () => {
    tokenizer.add_special_token("<|im_start|>", 32000);
    tokenizer.add_special_token("<|im_end|>", 32001);
    expect(
      tokenizer.encode("<|im_start|>Hello this is a test<|im_end|>")
    ).toEqual([32000, 16230, 456, 349, 264, 1369, 32001]);
  });
  test("encode with unknown unicode", () => {
    const text = "this is beer: 🍺";
    expect(tokenizer.encode(text)).toEqual([
      894, 349, 11102, 28747, 28705, 243, 162, 144, 189,
    ]);
  });

  test("decode simple", () => {
    expect(tokenizer.decode([16230, 456, 349, 264, 1369])).toEqual(
      "Hello this is a test"
    );
  });
  test("decode with utf8", () => {
    expect(
      tokenizer.decode([29383, 29530, 28924, 30050, 29822, 29267])
    ).toEqual("你好，世界！");
  });
  test("decode with special tokens", () => {
    tokenizer.add_special_token("<|im_start|>", 32000);
    tokenizer.add_special_token("<|im_end|>", 32001);
    expect(
      tokenizer.decode([32000, 16230, 456, 349, 264, 1369, 32001])
    ).toEqual("<|im_start|>Hello this is a test<|im_end|>");
  });
  test("decode with unknown unicode", () => {
    const text = "this is beer: 🍺";
    expect(
      tokenizer.decode([894, 349, 11102, 28747, 28705, 243, 162, 144, 189])
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
    ).toEqual([16230, 456, 349, 264, 1369]);
  });
});
