import { assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";

import { Result } from "./janken.ts";
import { User } from "./user.ts";

Deno.test("user update by draw", () => {
  const user = new User("123456789");

  user.update(Result.Draw);
  assertEquals(user.getResult(Result.Draw), 1);
  assertEquals(user.getResult(Result.Win), 0);
  assertEquals(user.getResult(Result.Lose), 0);
});

Deno.test("user update by win", () => {
  const user = new User("123456789");

  user.update(Result.Win);
  assertEquals(user.getResult(Result.Draw), 0);
  assertEquals(user.getResult(Result.Win), 1);
  assertEquals(user.getResult(Result.Lose), 0);
});

Deno.test("user update by lose", () => {
  const user = new User("123456789");

  user.update(Result.Lose);
  assertEquals(user.getResult(Result.Draw), 0);
  assertEquals(user.getResult(Result.Win), 0);
  assertEquals(user.getResult(Result.Lose), 1);
});

Deno.test("user getResult", () => {
  const user = new User("123456789");

  assertEquals(user.getResult(), [0, 0, 0]);
  assertEquals(user.getResult(Result.Draw), 0);
  assertEquals(user.getResult(Result.Win), 0);
  assertEquals(user.getResult(Result.Lose), 0);
});
