import { pathResolver } from "https://kamekyame.github.io/deno_tools/path/mod.ts";
const resolve = pathResolver(import.meta);

import { User } from "./user.ts";

const writeJsonFileSync = (path: string | URL, json: any) => {
  Deno.writeTextFileSync(path, JSON.stringify(json));
};
const readJsonFileSync = (path: string | URL) => {
  return JSON.parse(Deno.readTextFileSync(path));
};

export class UserFileOp {
  private static dir = resolve("./data");
  private static path = UserFileOp.dir + "/users.json";

  static staticConstructor = (() => {
    Deno.mkdirSync(UserFileOp.dir, { recursive: true });
  })();

  public static save(users: User[]) {
    writeJsonFileSync(this.path, users);
  }

  public static sqlDataSave(users: User[]) {
    try {
      Deno.statSync(this.path);
    } catch {
      this.save(users);
      return true;
    }
    return false;
  }
  public static read() {
    try {
      const jsonUsers = readJsonFileSync(this.path);
      if (Array.isArray(jsonUsers)) return jsonUsers.map((e) => new User(e));
    } catch (e) {
      console.log(e);
    }
    return new Array<User>();
  }
}
