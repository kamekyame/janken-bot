import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Client } from "https://deno.land/x/mysql/mod.ts";

import { pathResolver } from "https://kamekyame.github.io/deno_tools/path/mod.ts";
import { UserFileOp } from "../file.ts";
const resolve = pathResolver(import.meta);

import { User } from "../user.ts";

const env = config({
  path: "./.env",
  safe: true,
  example: resolve("./.sqlenv.example"),
});

const client = await new Client().connect({
  hostname: env["SQL_HOSTNAME"],
  username: env["SQL_USERNAME"],
  db: "jankenbot",
  poolSize: 3, // connection limit
  password: env["SQL_PASSWORD"],
});

const dbData = await client.transaction(async (conn) => {
  return await conn.query(`select * from result`);
});
//console.log(users);
if (dbData instanceof Array) {
  const users = dbData.map((e) => {
    const user = {
      id: e.userid.toString(),
      result: {
        draw: e.draw,
        lose: e.lose,
        win: e.win,
      },
    };
    return new User(user);
  });

  if (!UserFileOp.sqlDataSave(users)) {
    console.log("既にuser.jsonが存在しています。削除してから再度実行してください。");
  }
}

client.close();
