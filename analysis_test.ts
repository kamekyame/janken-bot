import { assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";
import { getHands } from "./analysis.ts";
import { Hand, Type } from "./janken.ts";

Deno.test("getHands", () => {
  const hands = getHands("ぐー");
  for (const h of hands) {
    assertEquals(h, { hand: Hand.Rock, type: Type.Hiragana });
  }
});
