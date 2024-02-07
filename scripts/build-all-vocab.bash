set -e

SHELL_FOLDER=$(cd "$(dirname "$0")";pwd)

BUILD_TOOL_PATH=$SHELL_FOLDER/build-vocab-ts.js
MODEL_FILE_DIR=$SHELL_FOLDER/llama_models

PACKAGES_DIR=$(cd $SHELL_FOLDER/../packages;pwd)

# *.model.json file read
# build neox
node $BUILD_TOOL_PATH $MODEL_FILE_DIR/neox-tokenizer.model.json $PACKAGES_DIR/vocab-neox/src/vocab.ts --overwrite
echo "build neox done"
# build falcon
node $BUILD_TOOL_PATH $MODEL_FILE_DIR/falcon-tokenizer.model.json $PACKAGES_DIR/vocab-falcon/src/vocab.ts --overwrite
echo "build falcon done"

# *.json file read
# build yi
node $BUILD_TOOL_PATH $MODEL_FILE_DIR/yi-tokenizer.json $PACKAGES_DIR/vocab-yi/src/vocab.ts --overwrite
echo "build yi done"
# build baichuan2
node $BUILD_TOOL_PATH $MODEL_FILE_DIR/baichuan2-tokenizer.json $PACKAGES_DIR/vocab-baichuan2/src/vocab.ts --overwrite
echo "build baichuan2 done"
# build chatglm3
node $BUILD_TOOL_PATH $MODEL_FILE_DIR/chatglm3-tokenizer.json $PACKAGES_DIR/vocab-chatglm3/src/vocab.ts --overwrite
echo "build chatglm3 done"
# build internlm2
node $BUILD_TOOL_PATH $MODEL_FILE_DIR/internlm2-tokenizer.json $PACKAGES_DIR/vocab-internlm2/src/vocab.ts --overwrite
echo "build internlm2 done"
# build mistral (llama2)
node $BUILD_TOOL_PATH $MODEL_FILE_DIR/mistral-tokenizer.json $PACKAGES_DIR/vocab-llama2/src/vocab.ts --overwrite
echo "build llama2 done"

echo "build all done"
