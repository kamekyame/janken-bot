import { User } from "./user.ts";

const writeJsonFileSync = (path: string | URL, json: any) => {
  Deno.writeTextFileSync(path, JSON.stringify(json));
};
const readJsonFileSync = (path: string | URL) => {
  return JSON.parse(Deno.readTextFileSync(path));
};

export class UserFileOp {
  private static dir = "./data";
  private static path = UserFileOp.dir + "/janken-users.json";

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
      //console.log(e);
    }
    return new Array<User>();
  }
}

export class TweetLogFileOp {
  private static dir = "./log";
  private static path = TweetLogFileOp.dir + "/janken-tweet.log";

  static staticConstructor = (() => {
    Deno.mkdirSync(TweetLogFileOp.dir, { recursive: true });
  })();

  static add(tweetRes: any) {
    const text = `[${new Date().toISOString()}] ${JSON.stringify(tweetRes)}\n`;
    Deno.writeTextFileSync(this.path, text, {
      append: true,
    });
  }
}
