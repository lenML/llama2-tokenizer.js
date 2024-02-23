import requests
import os

# download *.model files to ./ folder

files = [
    # chatgml3
    {
        "filename": "chatglm3-tokenizer.model",
        "url": "https://huggingface.co/THUDM/chatglm3-6b/resolve/main/tokenizer.model?download=true",
    },
    # baichuan
    {
        "filename": "baichuan2-tokenizer.model",
        "url": "https://huggingface.co/baichuan-inc/Baichuan2-13B-Chat/resolve/main/tokenizer.model?download=true",
    },
    # mistral (llama2/zephyr)
    {
        "filename": "mistral-tokenizer.model",
        "url": "https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2/resolve/main/tokenizer.model?download=true",
    },
    # internlm2
    {
        "filename": "internlm2-tokenizer.model",
        "url": "https://huggingface.co/internlm/internlm2-chat-20b/resolve/main/tokenizer.model?download=true",
    },
    # 零一 34b
    {
        "filename": "yi-tokenizer.model",
        "url": "https://huggingface.co/01-ai/Yi-34B-Chat/resolve/main/tokenizer.model?download=true",
    },
    # neox mpt rwkv
    {
        "filename": "neox-tokenizer.model.json",
        "url": "https://huggingface.co/mosaicml/mpt-7b/raw/main/tokenizer.json",
    },
    # falcon
    {
        "filename": "falcon-tokenizer.model.json",
        "url": "https://huggingface.co/tiiuae/falcon-7b/raw/main/tokenizer.json",
    },
    # gemma-7b
    {
        "filename": "gemma-tokenizer.model.json",
        "url": "https://huggingface.co/google/gemma-7b/resolve/main/tokenizer.json?download=true",
    },
]

for file in files:
    filepath = os.path.join(os.path.dirname(__file__), "llama_models", file["filename"])
    # 如果文件已经存在，就不再下载
    if os.path.exists(filepath):
        print(f"File {file['filename']} already exists.")
        continue
    print(f"Downloading {file['filename']} from {file['url']}...")
    r = requests.get(file["url"])

    if file["filename"].endswith(".json"):
        # NOTE: 好像因为key不合法所以，在python中无法读取vocab
        # import json
        # resp = json.loads(r.content)
        # vocab = resp["model"]["vocab"]
        # with open(filepath, "w", encoding="utf-8") as f:
        #     f.write(json.dumps(vocab, ensure_ascii=False, indent=2, sort_keys=True))

        with open(filepath, "wb") as f:
            f.write(r.content)
        continue

    with open(filepath, "wb") as f:
        f.write(r.content)
