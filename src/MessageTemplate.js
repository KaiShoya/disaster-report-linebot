MessageTemplate = function(){};

// ユーザーのつぶやきにリプライを返す
MessageTemplate.reply = function(replyToken, msg) {
  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [msg],
    }),
  });
}

// 第1引数で指定したユーザーにプッシュ通知をする
MessageTemplate.push = function(to, msg) {
  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'to': to,
      'messages': [msg],
    }),
  });
}

MessageTemplate.defaultMsg = function(msg) {
  return {
    'type': 'text',
    'text': msg,
  };
}
