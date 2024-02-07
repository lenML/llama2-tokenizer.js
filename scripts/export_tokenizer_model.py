from transformers import LlamaTokenizer
import json


def export_vocab_to_json(tokenizer, filename):
    vocab = tokenizer.get_vocab()
    # 将 ▁ 替换为 空格
    vocab = {k.replace("▁", " "): v for k, v in vocab.items()}
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(vocab, f, indent=4, ensure_ascii=False)


# 遍历 ./llama_models 文件夹下的所有 .model 文件 转为 .json 文件
# 例如 chatgpt3-vocab.model -> chatgpt3-vocab.json
import os

llam2_models = os.path.join(os.path.dirname(__file__), "llama_models")
for filename in os.listdir(llam2_models):
    if filename.endswith(".model"):
        filepath = os.path.join(llam2_models, filename)
        # 如果存在对应的 .json 文件则跳过
        if os.path.exists(filepath.replace(".model", ".json")):
            print(f"{filename} already exists, skipping...")
            continue
        print(f"Converting {filename} to json...")
        tokenizer = LlamaTokenizer.from_pretrained(
            filepath, local_files_only=True, legacy=False
        )
        export_vocab_to_json(tokenizer, filepath.replace(".model", ".json"))
        print(f"Done converting {filename} to json.")
