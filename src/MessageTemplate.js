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
      'messages': msg,
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
      'messages': msg,
    }),
  });
}

// シンプルなテキストを送信するテンプレート
MessageTemplate.defaultMsg = function(msg) {
  return {
    'type': 'text',
    'text': msg,
  };
}

// シンプルなテキスト + locationのクイックリプライ機能
MessageTemplate.locationMsg = function(msg) {
  return {
    'type': 'text',
    'text': msg,
    'quickReply': {
      'items': [{
        'type': 'action',
        'action': {
          'type': 'location',
          'label': '地図を使って送信する'
        }
      }]
    }
  }
}

MessageTemplate.datetimePickerQuickMsg = function(msg, data) {
  return {
    'type': 'text',
    'text': msg,
    'quickReply': {
      'items': [{
        'type': 'action',
        'action': {
          'type': 'datetimepicker',
          'label': '日時を入力する',
          'mode': 'datetime',
          'data': 'type=' + data
        }
      }]
    }
  }
}

MessageTemplate.checkConditionMsg = function(msg, data) {
  return         {
    'type': 'template',
    'altText': msg,
    'template': {
      'type': 'buttons',
      'text': msg,
      'actions': [
        {
          'type': 'postback',
          'label': '全く通れない',
          'data': 'type=' + data + '&action=1'
        },
        {
          'type': 'postback',
          'label': '徒歩でなら通れる',
          'data': 'type=' + data + '&action=2'
        },
        {
          'type': 'postback',
          'label': '通れる',
          'data': 'type=' + data + '&action=3'
        },
        {
          'type': 'postback',
          'label': 'どれにも当てはまらない',
          'data': 'type=' + data + '&action=0'
        }
      ]
    }
  }
}

