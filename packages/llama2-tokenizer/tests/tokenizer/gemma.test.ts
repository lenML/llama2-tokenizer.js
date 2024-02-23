// test source code
import { Llama2Tokenizer } from "../../src/main";
// test build code
// import { Llama2Tokenizer } from "../../dist/main";

import { load_vocab } from "@lenml/llama2-tokenizer-vocab-gemma";

describe("GemmaTokenizer", () => {
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
      25102, 719, 620, 562, 1682,
    ]);
  });
  test("encode with utf8", () => {
    expect(tokenizer.encode("你好，世界！")).toEqual([25902, 101, 2349, 103]);
  });
  test("encode with special tokens", () => {
    tokenizer.add_special_token("<|im_test_start|>");
    tokenizer.add_special_token("<|im_test_end|>");
    expect(
      tokenizer.encode("<|im_test_start|>Hello this is a test<|im_test_end|>")
    ).toEqual([64002, 25102, 719, 620, 562, 1682, 64003]);
  });
  test("encode with unknown unicode", () => {
    // TODO: this not unknown unicode
    const text = "this is beer: 🍺";
    expect(tokenizer.encode(text)).toEqual([
      1933, 620, 8330, 59601, 59568, 545, 464, 446, 491,
    ]);
  });

  test("decode simple", () => {
    expect(tokenizer.decode([25102, 719, 620, 562, 1682])).toEqual(
      "Hello this is a test"
    );
  });
  test("decode with utf8", () => {
    expect(tokenizer.decode([25902, 101, 2349, 103])).toEqual("你好，世界！");
  });
  test("decode with special tokens", () => {
    tokenizer.add_special_token("<|im_test_start|>", 64002);
    tokenizer.add_special_token("<|im_test_end|>", 64003);
    expect(
      tokenizer.decode([64002, 25102, 719, 620, 562, 1682, 64003])
    ).toEqual("<|im_test_start|>Hello this is a test<|im_test_end|>");
  });
  test("decode with unknown unicode", () => {
    const text = "this is beer: 🍺";
    expect(
      tokenizer.decode([1933, 620, 8330, 59601, 59568, 545, 464, 446, 491])
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
    ).toEqual([25102, 719, 620, 562, 1682]);
  });
});
