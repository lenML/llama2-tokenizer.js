# 🦙Llama2 Tokenizer for JavaScript

Llama2 Tokenizer is a TypeScript library for tokenizing and encoding text using the Llama2 vocabulary. It is designed to be simple, efficient, and flexible for natural language processing tasks.

# Features

## support models
- llama2
- mistral
- zephyr

# Why llama2 ?
llama2's vocab is different from llama1, so a new tokenizer needs to be defined to adapt to llama2's vocab

# Benchmark
We conducted a benchmark test to measure the performance of the Llama2 Tokenizer in tokenizing a given text for a specified number of iterations. The results for 1000 iterations are as follows:

Input Text:
<details>
<summary>Click to expand</summary>
<pre>

🌸🍻🍅🍓🍒🏁🚩🎌🏴🏳️🏳️‍🌈

Lorem ipsum dolor sit amet, duo te voluptua detraxit liberavisse, vim ad vidisse gubergren consequuntur, duo noster labitur ei. Eum minim postulant ad, timeam docendi te per, quem putent persius pri ei. Te pro quodsi argumentum. Sea ne detracto recusabo, ius error doming honestatis ut, no saepe indoctum cum.

Ex natum singulis necessitatibus usu. Id vix brute docendi imperdiet, te libris corrumpit gubergren sea. Libris deleniti placerat an qui, velit atomorum constituto te sit, est viris iriure convenire ad. Feugait periculis at mel, libris dissentias liberavisse pri et. Quo mutat iudico audiam id.
</pre>
</details>

Results:
```bash
Benchmark Results (1000 iterations):
Total Time: 0.88822 seconds
Average Time per Iteration: 0.00089 seconds
```

This benchmark demonstrates the tokenizer's efficiency in processing text, making it a reliable choice for various natural language processing applications.

## Installation

```bash
npm install @lenml/llama2-tokenizer
```

## Usage

### Importing the Tokenizer

```typescript
import { Llama2Tokenizer } from "@lenml/llama2-tokenizer";
```

### Creating an Instance

```typescript
const tokenizer = new Llama2Tokenizer();
tokenizer.load_llama2_vocab();
```

### Tokenizing Text

```typescript
const text = "你好，世界！";
const tokens = tokenizer.tokenize(text);
console.log(tokens);
// Output: ["你", "好", "，", "世", "界", "！"]
```

### Encoding Text

```typescript
const text = "你好，世界！";
const ids = tokenizer.encode(text);
console.log(ids);
// Output: [2448, 1960, 8021, 1999, 1039, 8013]
```

### Decoding IDs

```typescript
const ids = [2448, 1960, 8021, 1999, 1039, 8013];
const decodedText = tokenizer.decode(ids);
console.log(decodedText);
// Output: "你好，世界！"
```

### Adding Special Tokens

```typescript
tokenizer.add_special_token("<ok>");
tokenizer.add_special_tokens(["<|im_start|>", "<|im_end|>"]);
```

> It is not recommended to use `[XX]` (like `[CLS]` or `[PAD]`) as a special token for this pattern, as it can easily lead to conflicts. Because `"_["` is also a usable token, it is difficult to be compatible with this bad case without adjusting the word list order.

### Getting Vocabulary

```typescript
const vocabulary = tokenizer.get_vocab();
console.log(vocabulary);
// Output: { "你": 2448, "好": 1960, "，": 8021, "世": 1999, "界": 1039, "！": 8013, ... }
```

### Additional Features

- `vocab_size`: Get the total vocabulary size.
- `max_id`: Get the maximum token ID.
- `convert_tokens_to_string`: Convert a sequence of tokens to a single string.
- `convert_tokens_to_ids`: Convert a sequence of tokens to a sequence of IDs.
- `convert_ids_to_tokens`: Convert a sequence of IDs to a sequence of tokens.

## Example

```typescript
const main = async () => {
  const tokenizer = new Llama2Tokenizer();
  tokenizer.load_llama2_vocab();
  console.log(tokenizer.tokenize("你好，世界！"));
  console.log(tokenizer.encode("你好，世界！"));
  console.log(tokenizer.decode([2448, 1960, 8021, 1999, 1039, 8013]));
};

main();
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.