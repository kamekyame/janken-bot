import { OAuth1Info } from "https://kamekyame.github.io/deno_tools/http/mod.ts";

import {
  StreamParam,
  StreamTweet,
} from "https://kamekyame.github.io/twitter_api_client/api_v2/tweets/filtered_stream.ts";
import {
  statusUpdate,
} from "https://kamekyame.github.io/twitter_api_client/api_v1/tweets/update.ts";

import { TweetLogFileOp } from "./file.ts";
import { getHands } from "./analysis.ts";
import { judge, Result } from "./janken.ts";
import { hands, rndHand } from "./janken.ts";
import { Users } from "./user.ts";

export class Janken {
  private readonly auth: OAuth1Info;
  //private readonly bearerToken: string;

  private receiveUsername = "SuzuTomo2001";

  private readonly tag = "replyBOT";
  private readonly value = () =>
    `@${this.receiveUsername} -from:${this.receiveUsername}`;

  public readonly option: StreamParam = {
    expansions: {
      author_id: true,
    },
    "user.fields": {
      username: true,
    },
  };

  private users: Users;

  constructor(auth: OAuth1Info) {
    this.auth = auth;
    this.users = new Users();
  }

  public setReceiveUsername(username: string) {
    this.receiveUsername = username;
  }

  public getRule() {
    return { tag: this.tag, value: this.value() };
  }

  public async callback(res: StreamTweet) {
    if (!res.matching_rules.some((e) => e.tag === this.tag)) return;
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
          const r = this.users.update(user.id, result);

          // ツイート返信
          const resultText = () => {
            if (result === Result.Draw) return "とあいこ！";
            else if (result === Result.Lose) return "の負け！";
            else if (result === Result.Win) return "の勝ち！";
          };
          status += `
あなた(${hands[hand.type][hand.hand]}) vs (${hands[hand.type][botHand]})すずとも
  
あなた${resultText()}
  
成績：${r[2]}勝${r[1]}敗${r[0]}分
  
またじゃんけんしようね(o^―^o)`;

          // ログ記録
          logText += `${hands[hand.type][botHand]} vs ${
            hands[hand.type][hand.hand]
          }(@${user.username})`;
        }

        status += `\n#すずともBot`;
        const tweetRes = await statusUpdate(this.auth, {
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
}
