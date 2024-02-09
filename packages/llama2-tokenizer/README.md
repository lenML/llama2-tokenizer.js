# 🦙Llama2 Tokenizer for JavaScript

Llama2 Tokenizer is a TypeScript library for tokenizing and encoding text using the Llama2 vocabulary.

Suitable for browser and nodejs environment.

> online playground: https://lenml.github.io/llama-tokenizer-playground/
> 
> (vocab: llama2) 

# Features

- fast
- API like Llama2Tokenizer (python)
- typescript
- 95% test coverage

## support models
- llama2
- mistral
- zephyr
- vicuna
- baichuan2
- chatglm3
- internlm2
- yi
- ...

# Why llama2 ?
llama2's vocab is different from llama1, so a new tokenizer needs to be defined to adapt to llama2's vocab

# Packages

| Library Name                           | Description                               | Compatibility                                        |
|---------------------------------------|-------------------------------------------|-------------------------------------------------------|
| @lenml/llama2-tokenizer               | Tokenizer library for text segmentation  |                                                       |
| @lenml/llama2-tokenizer-vocab-llama2 | Vocabulary for llama2                    | mistral, zephyr, vicuna, llama2                       |
| @lenml/llama2-tokenizer-vocab-baichuan2 | Vocabulary for baichuan2               | baichuan2                                            |
| @lenml/llama2-tokenizer-vocab-chatglm3 | Vocabulary for chatglm3                 | chatglm3                                             |
| @lenml/llama2-tokenizer-vocab-internlm2 | Vocabulary for internlm2               | internlm2                                            |
| @lenml/llama2-tokenizer-vocab-yi       | Vocabulary for yi                       | yi                                                    |
| @lenml/llama2-tokenizer-vocab-falcon   | Vocabulary for falcon (🚧WIP)            | falcon (🚧WIP)                                         |
| @lenml/llama2-tokenizer-vocab-neox     | Vocabulary for neox (🚧WIP)              | neox, RWKV (🚧WIP)                                     |
| @lenml/llama2-tokenizer-vocab-emoji     | a vocab demo (🚧WIP)              | 🚧WIP                                     |

This table lists the name of each library, its description, and its compatibility.

## Installation

```bash
npm install @lenml/llama2-tokenizer
```

### install vocab
```bash
npm install @lenml/llama2-tokenizer-vocab-llama2
# npm install @lenml/llama2-tokenizer-vocab-baichuan2
# npm install @lenml/llama2-tokenizer-vocab-chatglm3
# npm install @lenml/llama2-tokenizer-vocab-falcon
# npm install @lenml/llama2-tokenizer-vocab-internlm2
# npm install @lenml/llama2-tokenizer-vocab-yi
```

## Usage

### Importing the Tokenizer

```typescript
import { Llama2Tokenizer } from "@lenml/llama2-tokenizer";
import { load_vocab } from "@lenml/llama2-tokenizer-vocab-llama2"
```

### Creating an Instance

```typescript
const tokenizer = new Llama2Tokenizer();
const vocab_model = load_vocab();
tokenizer.install_vocab(vocab_model);
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

> It is not recommended to use ```[XX]``` (like ```[CLS]``` or ```[PAD]```) as a special token for this pattern, as it can easily lead to conflicts. Because ```"_["``` is also a usable token, it is difficult to be compatible with this bad case without adjusting the word list order.

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
import { Llama2Tokenizer } from "@lenml/llama2-tokenizer";
import { load_vocab } from "@lenml/llama2-tokenizer-vocab-llama2"

const main = async () => {
  const tokenizer = new Llama2Tokenizer();
  const vocab_model = load_vocab();
  tokenizer.install_vocab(vocab_model);
  console.log(tokenizer.tokenize("你好，世界！"));
  console.log(tokenizer.encode("你好，世界！"));
  console.log(tokenizer.decode([29383, 29530, 28924, 30050, 29822, 29267]));
};

main();
```

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

# TODOs
- [x] support llama2 vocab
- [x] support chatglm vocab
- [x] support baichuan vocab
- [x] support yi vocab
- [x] support internlm2 vocab
- [ ] support RWKV(neox) vocab
- [ ] support falcon
- [ ] Chat Template

# How to build
read [this](./build-guide.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.