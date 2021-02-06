import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

import { Hand, judge, Result, rndHand } from "./janken.ts";

// |m\o    |Rock   |Scissor|Paper  |
// |Rock   |draw   |win    |lose   |
// |Scissor|lose   |draw   |win    |
// |Paper  |win    |lose   |draw   |

const resultList = [
  [Result.Draw, Result.Win, Result.Lose],
  [Result.Lose, Result.Draw, Result.Win],
  [Result.Win, Result.Lose, Result.Draw],
];

for (const i in Hand) {
  const m = parseInt(i);
  if (isNaN(m)) continue;
  for (const j in Hand) {
    const o = parseInt(j);
    if (isNaN(o)) continue;
    Deno.test(`judge m:${Result[m]} vs o:${Result[o]}`, () => {
      assertEquals(judge(m, o), resultList[m][o]);
    });
  }
}

Deno.test("rndHand", () => {
  const hand = rndHand();
  assert(Hand[hand]);
});
