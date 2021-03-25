import { UserFileOp } from "./file.ts";
import { Result } from "./janken.ts";

export class User {
  readonly id: string;
  private result: number[];

  constructor(id: string | any) {
    if (typeof id === "object") {
      this.id = id.id;
      this.result = [id.result.draw, id.result.lose, id.result.win];
    } else {
      this.id = id;
      this.result = [0, 0, 0];
    }
  }

  update(result: Result) {
    this.result[result]++;
  }

  getResult(resultType: Result = -1) {
    if (resultType >= 0) {
      return this.result[resultType];
    } else return this.result;
  }

  toString() {
    return `userid: ${this.id}\twin: ${this.result[1]}\tlose: ${
      this.result[2]
    }\tdraw: ${this.result[0]}`;
  }

  toJSON() {
    return {
      id: this.id,
      result: {
        draw: this.result[0],
        lose: this.result[1],
        win: this.result[2],
      },
    };
  }
}

export class Users {
  private users: User[] = [];

  constructor() {
    this.users = this.read();
    console.log(this.users);
  }

  read = () => UserFileOp.read();
  save = () => UserFileOp.save(this.users);

  update(userId: string, result: Result) {
    let user = this.users.find((e) => e.id === userId);
    if (!user) {
      user = new User(userId);
      this.users.push(user);
    }
    user.update(result);
    this.save();
  }
}
