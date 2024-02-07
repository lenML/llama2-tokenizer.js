const fs = require("fs");
const path = require("path");

const vocab_ts_template = (data) => {
  const encode = (x) =>
    Buffer.from(encodeURIComponent(JSON.stringify(x))).toString("base64");
  // 需要支持浏览器环境，所以不能用Buffer
  return `
const decode = (x: string) => JSON.parse(decodeURIComponent(atob(x)));
const load = () => decode(\n"${encode(data)}"\n);
let _vocab = null as any;
export const load_llama2_vocab: () => Record<string, number> = () => _vocab ?? (_vocab = load());
`.trim();
};

const read_json_file = (filepath) => {
  if (!fs.existsSync(filepath)) {
    throw new Error(`cant read file: ${filepath}`);
  }
  let file_content = fs.readFileSync(filepath, "utf-8");

  if (filepath.endsWith(".model.json")) {
    // replace "Ġ" with " " in file_content
    file_content = file_content.replace(/Ġ/g, " ");
  }

  const data = JSON.parse(file_content);

  if (filepath.endsWith(".model.json")) {
    const vocab = data.model.vocab;
    if (!vocab) {
      throw new Error(`cant find vocab in file: ${filepath}`);
    }
    return vocab;
  }

  return data;
};
const filepath_to_abs = (filepath) =>
  path.isAbsolute(filepath) ? filepath : path.join(process.cwd(), filepath);

const main = async () => {
  const overwrite = process.argv.includes("--overwrite");

  let [input_filepath, output_filepath] = process.argv.slice(2);
  input_filepath = filepath_to_abs(input_filepath);
  output_filepath = filepath_to_abs(output_filepath);

  if (!overwrite && fs.existsSync(output_filepath)) {
    throw new Error(`file exists: ${output_filepath}`);
  }

  const data = read_json_file(input_filepath);

  fs.writeFileSync(output_filepath, vocab_ts_template(data));
  console.log(`success, write file: ${output_filepath}`);
};

// eg: node ./build-vocab-ts.js ./data/vocab-llama2.json ./src/vocab.ts
main().catch((err) => {
  if (err instanceof Error && err.message.includes("exists")) {
    console.log(err.message);
    return;
  }
  console.error(err);
  process.exit(1);
});
