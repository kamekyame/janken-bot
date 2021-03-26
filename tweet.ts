import { config } from "https://deno.land/x/dotenv/mod.ts";

import { getBearerToken } from "https://kamekyame.github.io/twitter_api_client/auth/oauth2.ts";
import {
  changeRules,
  connectStream,
  getRules,
  StreamTweet,
} from "https://kamekyame.github.io/twitter_api_client/api_v2/tweets/filtered_stream.ts";
import {
  statusUpdate,
} from "https://kamekyame.github.io/twitter_api_client/api_v1/tweets/update.ts";

import { getHands } from "./analysis.ts";
import { judge, Result } from "./janken.ts";
import { hands, rndHand } from "./janken.ts";
import { Users } from "./user.ts";
import { TweetLogFileOp } from "./file.ts";

const users = new Users();

const receiveUsername = "SuzuTomo2001";

const env = config({ safe: true });

const auth = {
  consumerKey: env["API_KEY"],
  consumerSecret: env["API_SECRETKEY"],
  token: env["TOKEN"],
  tokenSecret: env["TOKEN_SECRET"],
};

const bearerToken = await getBearerToken(auth.consumerKey, auth.consumerSecret);

const tag = "jankenBOT";
const value = `to:${receiveUsername} -from:${receiveUsername}`;

// streamのルールをチェック。じゃんけんBOT用のルールが無かったら追加
async function checkRule() {
  const rules = await getRules(bearerToken);
  if (!rules.data?.some((d) => d.tag === tag)) {
    const aRules = await changeRules(bearerToken, { add: [{ value, tag }] });
  }
}

async function tweetCB(res: StreamTweet) {
  if (!res.matching_rules.some((e) => e.tag === tag)) return;
  const getUser = () => {
    if (res.includes?.users && res.includes.users.length > 0) {
      return res.includes.users[0];
    }
  };
  const user = getUser();

  //console.log(res, user);
  if (user) {
    let count = 0;
    for (const hand of getHands(res.data.text)) {
      count++;

      let status = `@${user.username}`;
      let logText = `[${new Date().toISOString()}] `;
      if (count > 10) {
        status += `
手が足りないんだけど…
https://qiita.com/SuzuTomo2001/items/c3f986ba80d58d66beee`;
        logText += "手が足りないよぉ…";
      } else {
        // じゃんけん
        const botHand = rndHand();
        const result = judge(hand.hand, botHand);

        // ユーザ情報更新
        users.update(user.id, result);

        // ツイート返信
        const resultText = () => {
          if (result === Result.Draw) return "とあいこ！";
          else if (result === Result.Lose) return "の負け！";
          else if (result === Result.Win) return "の勝ち！";
        };
        status += `
あなた(${hands[hand.type][hand.hand]}) vs (${hands[hand.type][botHand]})すずとも

あなた${resultText()}

またじゃんけんしようね(o^―^o)`;

        // ログ記録
        logText += `${hands[hand.type][botHand]} vs ${
          hands[hand.type][hand.hand]
        }(@${user.username})`;
      }

      status += `\n#すずともBot`;
      const tweetRes = await statusUpdate(auth, {
        status,
        in_reply_to_status_id: res.data.id,
      });
      logText += `\ttweetId:${tweetRes.id}`;

      console.log(logText);

      TweetLogFileOp.add(tweetRes);

      if (count > 10) break;
    }
  }
}

function start() {
  connectStream(bearerToken, tweetCB, {
    expansions: {
      author_id: true,
    },
    "user.fields": {
      username: true,
    },
  });
}

await checkRule();
export { start };
