const fs = require("fs");
const path = require("path");
const data = require("./vocab.json");
const encode = (x) =>
  Buffer.from(encodeURIComponent(JSON.stringify(x))).toString("base64");
fs.writeFileSync(
  path.join(__dirname, "../src/vocab.ts"),
  // 需要支持浏览器环境，不能用Buffer
  `
const decode = (x: string) => JSON.parse(decodeURIComponent(atob(x)));
const load = () => decode(\n"${encode(data)}"\n);
let _vocab = null as any;
export const load_llama2_vocab: () => Record<string, number> = () => _vocab ?? (_vocab = load());
`.trim()
);
