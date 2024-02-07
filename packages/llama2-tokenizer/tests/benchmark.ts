import { Llama2Tokenizer } from "../dist/main";
import { load_vocab } from "@lenml/llama2-tokenizer-vocab-llama2";

// Function to run benchmark test
const runBenchmark = (iterations: number, text: string) => {
  const tokenizer = new Llama2Tokenizer();
  tokenizer.install_vocab(load_vocab());

  const start = process.hrtime();

  for (let i = 0; i < iterations; i++) {
    tokenizer.tokenize(text);
  }

  const end = process.hrtime(start);
  const elapsedSeconds = end[0] + end[1] / 1e9;

  console.log(`====================`);
  console.log(`Benchmark Results (${iterations} iterations):`);
  console.log(`Total Time: ${elapsedSeconds.toFixed(5)} seconds`);
  console.log(
    `Average Time per Iteration: ${(elapsedSeconds / iterations).toFixed(
      5
    )} seconds`
  );
  console.log(`====================`);
};

// Specify the number of iterations and test text
const iterations = 1000;
const testText = `
🌸🍻🍅🍓🍒🏁🚩🎌🏴🏳️🏳️‍🌈

Lorem ipsum dolor sit amet, duo te voluptua detraxit liberavisse, vim ad vidisse gubergren consequuntur, duo noster labitur ei. Eum minim postulant ad, timeam docendi te per, quem putent persius pri ei. Te pro quodsi argumentum. Sea ne detracto recusabo, ius error doming honestatis ut, no saepe indoctum cum.

Ex natum singulis necessitatibus usu. Id vix brute docendi imperdiet, te libris corrumpit gubergren sea. Libris deleniti placerat an qui, velit atomorum constituto te sit, est viris iriure convenire ad. Feugait periculis at mel, libris dissentias liberavisse pri et. Quo mutat iudico audiam id.
`.trim();

// Run the benchmark test
runBenchmark(iterations, testText);
