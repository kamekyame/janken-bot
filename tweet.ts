import "https://deno.land/x/dotenv/load.ts";

import { getBearerToken } from "../twitter_api_client/auth/oauth2.ts";
import {
  changeRules,
  connectStream,
  getRules,
  StreamTweet,
} from "https://kamekyame.github.io/twitter_api_client/api_v2/tweets/filtered_stream.ts";
import {
  statusUpdate,
  UpdateParam,
} from "https://kamekyame.github.io/twitter_api_client/api_v1/tweets/update.ts";

import { getHands } from "./analysis.ts";
import { Hand, judge, Result } from "./janken.ts";
import { hands, rndHand } from "./janken.ts";

const receiveUsername = "SuzuTomo2001";

const consumerKey = Deno.env.get("API_KEY");
const consumerSecret = Deno.env.get("API_SECRETKEY");
const token = Deno.env.get("TOKEN");
const tokenSecret = Deno.env.get("TOKEN_SECRET");
if (!consumerKey || !consumerSecret || !token || !tokenSecret) {
  console.error("undefinded env key");
  Deno.exit(-1);
}
const auth = {
  consumerKey: consumerKey,
  consumerSecret: consumerSecret,
  token: token,
  tokenSecret: tokenSecret,
};

const bearerToken = await getBearerToken(consumerKey, consumerSecret);

const tag = "jankenBOT";
const value = `to:${receiveUsername} -from:${receiveUsername}`;

// streamのルールをチェック。じゃんけんBOT用のルールが無かったら追加
async function checkRule() {
  const rules = await getRules(bearerToken);
  if (!rules.data?.some((d) => d.tag === tag)) {
    const aRules = await changeRules(bearerToken, { add: [{ value, tag }] });
  }
}

function tweetCB(res: StreamTweet) {
  if (!res.matching_rules.some((e) => e.tag === tag)) return;

  //console.log(res);
  for (const hand of getHands(res.data.text)) {
    const botHand = rndHand();

    const result = judge(hand.hand, botHand);
    const resultText = () => {
      if (result === Result.Draw) return "とあいこ！";
      else if (result === Result.Lose) return "の負け！";
      else if (result === Result.Win) return "の勝ち！";
    };

    const username = () => {
      if (res.includes?.users && res.includes.users.length > 0) {
        return "@" + res.includes.users[0].username;
      }
    };

    if (!username()) {
    } else {
      const status = `${username()}
    あなた(${hands[hand.type][hand.hand]}) vs (${hands[hand.type][botHand]})すずとも
    
    あなた${resultText()}`;

      //statusUpdate(auth, { status, in_reply_to_status_id: res.data.id });
      console.log(result);
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
