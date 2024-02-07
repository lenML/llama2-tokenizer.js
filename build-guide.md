
# build guide

# 1. download tokenizer model from hf
```
python ./scripts/download.py
```

# 2. export tokenizer model to json format
```
python ./scripts/export_tokenizer_model.py
```

# 3. build all vocab code
```
bash ./scripts/build-all-vocab.bash
```

# 4. build all packages
```
pnpm build
```

