/*import { config } from "https://deno.land/x/dotenv/mod.ts";

import { Client } from "https://deno.land/x/mysql/mod.ts";

import { pathResolver } from "../util.ts";
const resolve = pathResolver(import.meta);

console.log(resolve("./.env"));
const a = config({ path: resolve("./.env") });
console.log(a);
*/
import * as path from "https://deno.land/std@0.86.0/path/mod.ts";
const a = path.join(import.meta.url, "../");
console.log(a);
/*const client = await new Client().connect({
  hostname: "127.0.0.1",
  username: "root",
  db: "dbname",
  poolSize: 3, // connection limit
  password: "password",
});*/
