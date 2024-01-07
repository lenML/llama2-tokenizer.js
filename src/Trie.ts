/**
 * Trie in TypeScript. Creates a Trie out of a list of words. The trie is used to split on `added_tokens` in one pass
 * Loose reference https://en.wikipedia.org/wiki/Trie
 */
export class Trie {
  private data: Record<string, any>;
  private _tokens: Set<string>;

  constructor() {
    this.data = {};
    this._tokens = new Set();
  }

  /**
   * Passes over every char (utf-8 char) on word and recursively adds it to the internal `data` trie representation.
   * The special key `""` is used to represent termination.
   *
   * This function is idempotent, adding twice the same word will leave the trie unchanged
   *
   * Example:
   *
   * ```typescript
   * const trie = new Trie();
   * trie.add("Hello 友達");
   * console.log(trie.data);
   * // {"H": {"e": {"l": {"l": {"o": {" ": {"友": {"達": {"": 1}}}}}}}}}
   *
   * trie.add("Hello");
   * console.log(trie.data);
   * // {"H": {"e": {"l": {"l": {"o": {"": 1, " ": {"友": {"達": {"": 1}}}}}}}}}
   * ```
   */
  add(word: string): void {
    if (!word) {
      // Prevent empty string
      return;
    }

    this._tokens.add(word);
    let ref = this.data;
    for (const char of word) {
      ref[char] = char in ref ? ref[char] : {};
      ref = ref[char];
    }
    ref[""] = 1;
  }

  /**
   * Will look for the words added to the trie within `text`. Output is the original string splitted along the
   * boundaries of the words found.
   *
   * This trie will match the longest possible word first !
   *
   * Example:
   *
   * ```typescript
   * const trie = new Trie();
   * console.log(trie.split("[CLS] This is a extra_id_100"));
   * // ["[CLS] This is a extra_id_100"]
   *
   * trie.add("[CLS]");
   * trie.add("extra_id_1");
   * trie.add("extra_id_100");
   * console.log(trie.split("[CLS] This is a extra_id_100"));
   * // ["[CLS]", " This is a ", "extra_id_100"]
   * ```
   */
  split(text: string): string[] {
    let states: Record<number, any> = {};

    // indexes are counted left of the chars index.
    // "hello", index 0, is left of h, index 1 is between h and e.
    // index 5 is right of the "o".

    // States are going to capture every possible start (indexes as above)
    // as keys, and have as values, a pointer to the position in the trie
    // where we're at. This is a partial match for now.
    // This enables to keep track of multiple matches while we're iterating
    // the string
    // If the trie contains, "blowing", and "lower" and we encounter the
    // string "blower", we need to split into ["b", "lower"].
    // This is where we need to keep track of multiple possible starts.
    const offsets: number[] = [0];

    // This is used by the lookahead which needs to skip over
    // some text where the full match exceeded the place in the initial
    // for loop
    let skip = 0;

    // Main loop, Giving this algorithm O(n) complexity
    for (let current = 0; current < text.length; current++) {
      if (skip && current < skip) {
        // Prevents the lookahead for matching twice
        // like extra_id_100 and id_100
        continue;
      }

      // This will track every state
      // that stop matching, we need to stop tracking them.
      // If we look at "lowball", we're going to match "l" (add it to states), "o", "w", then
      // fail on "b", we need to remove 0 from the valid states.
      let toRemove: Set<number> = new Set();
      // Whenever we found a match, we need to drop everything
      // this is a greedy algorithm, it will match on the first found token
      let reset = false;

      // In this case, we already have partial matches (But unfinished)
      for (let start in states) {
        let triePointer = states[start];
        if ("" in triePointer) {
          // This is a final match, we need to reset and
          // store the results in `offsets`.

          // Lookahead to match longest first
          // Important in case of extra_id_1 vs extra_id_100
          // Here we are also actively looking for other earlier partial
          // matches
          // "[CLS]", "L", we need to match CLS even if L is special
          let lookaheadIndex: number;
          let end: number;
          let nextChar: string | null;

          for (const lookStart in states) {
            let lookTriePointer = states[lookStart];
            if (parseInt(lookStart) > parseInt(start)) {
              // This partial match is later, we can stop looking
              break;
            } else if (parseInt(lookStart) < parseInt(start)) {
              // This partial match is earlier, the trie pointer
              // was already updated, so index is + 1
              lookaheadIndex = current + 1;
              end = current + 1;
            } else {
              // Here lookstart == start and
              //      looktrie_pointer == trie_pointer
              // It wasn't updated yet so indices are current ones
              lookaheadIndex = current;
              end = current;
            }
            nextChar =
              lookaheadIndex < text.length ? text[lookaheadIndex] : null;
            if ("" in lookTriePointer) {
              start = lookStart;
              end = lookaheadIndex;
              skip = lookaheadIndex;
            }
            while (nextChar && nextChar in lookTriePointer) {
              lookTriePointer = lookTriePointer[nextChar];
              lookaheadIndex += 1;
              if ("" in lookTriePointer) {
                start = lookStart;
                end = lookaheadIndex;
                skip = lookaheadIndex;
              }

              if (lookaheadIndex === text.length) {
                // End of string
                break;
              }
              nextChar = text[lookaheadIndex];
            }
            // End lookahead
          }

          // Storing and resetting
          offsets.push(parseInt(start));
          offsets.push(end!);
          reset = true;
          break;
        } else if (text[current] in triePointer) {
          // The current character being looked at has a match within the trie
          // update the pointer (it will be stored back into states later).
          triePointer = triePointer[text[current]];

          // Storing back the new pointer into the states.
          // Partial matches got longer by one.
          states[start] = triePointer;
        } else {
          // The new character has not match in the trie, we need
          // to stop keeping track of this partial match.
          // We can't do it directly within the loop because of how
          // TypeScript iteration works
          toRemove.add(parseInt(start));
        }
      }

      // Either clearing the full start (we found a real match)
      // Or clearing only the partial matches that didn't work.
      if (reset) {
        states = {};
      } else {
        for (const start of toRemove) {
          delete states[start];
        }
      }

      // If this character is a starting character within the trie
      // start keeping track of this partial match.
      if (current >= skip && text[current] in this.data) {
        states[current] = this.data[text[current]];
      }
    }

    // We have a cut at the end with states.
    for (const start in states) {
      const triePointer = states[start];
      if ("" in triePointer) {
        // This is a final match, we need to reset and
        // store the results in `offsets`.
        const end = text.length;
        offsets.push(parseInt(start));
        offsets.push(end);
        // Longest cut is always the one with lower start so the first
        // item so we need to break.
        break;
      }
    }

    return this.cutText(text, offsets);
  }

  protected cutText(text: string, offsets: number[]): string[] {
    // We have all the offsets now, we just need to do the actual splitting.
    // We need to eventually add the first part of the string and the eventual
    // last part.
    offsets.push(text.length);
    const tokens: string[] = [];
    let start = 0;
    for (const end of offsets) {
      if (start > end) {
        console.error(
          "There was a bug in Trie algorithm in tokenization. Attempting to recover. Please report it anyway."
        );
        continue;
      } else if (start === end) {
        // This might happen if there's a match at index 0
        // we're also preventing zero-width cuts in case of two
        // consecutive matches
        continue;
      }
      tokens.push(text.slice(start, end));
      start = end;
    }

    return tokens;
  }
}

// test case
// const main = () => {
//   const trie = new Trie();
//   console.log(trie.split("[CLS] This is a extra_id_100"));
//   // ["[CLS] This is a extra_id_100"]

//   trie.add("[CLS]");
//   trie.add("extra_id_1");
//   trie.add("extra_id_100");
//   console.log(trie.split("[CLS] This is a extra_id_100"));
//   // ["[CLS]", " This is a ", "extra_id_100"]
// };

// main();
