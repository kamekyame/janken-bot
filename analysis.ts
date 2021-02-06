import { Hand, hands, Type } from "./janken.ts";

function* getHands(text: string) {
  const fHands = hands.flat();
  const find = text.matchAll(new RegExp(fHands.join("|"), "g"));

  for (const f of find) {
    for (const [tIdx, t] of hands.entries()) {
      for (const [hIdx, h] of t.entries()) {
        if (f[0] === h) {
          yield { hand: hIdx as Hand, type: tIdx as Type };
        }
      }
    }
  }
}

export { getHands };
