enum Hand {
  Rock,
  Scissors,
  Paper,
}

enum Type {
  Katakana,
  Hiragana,
  Emoji,
}

enum Result {
  Draw,
  Lose,
  Win,
}

const hands = [
  ["グー", "チョキ", "パー"],
  ["ぐー", "ちょき", "ぱー"],
  ["✊", "✌", "✋"],
];

function judge(myself: Hand, opponent: Hand) {
  const result = (myself - opponent + 3) % 3;
  return result as Result;
}

function rndHand() {
  const hand = Math.floor(Math.random() * 3);
  return hand as Hand;
}

export { Hand, hands, judge, Result, rndHand, Type };
