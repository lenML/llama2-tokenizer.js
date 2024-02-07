import emojis from "unicode-emoji-json/data-ordered-emoji.json";

export const load_vocab = () => {
  const vocab_arr = [
    "<unk>",
    "<s>",
    "</s>",
    ..."0123456789",
    ..."abcdefghijklmnopqrstuvwxyz",
    ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    ..."!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
    ...emojis,
  ];
  return vocab_arr.reduce((acc, cur, idx) => {
    acc[cur] = idx;
    return acc;
  }, {} as Record<string, number>);
};
