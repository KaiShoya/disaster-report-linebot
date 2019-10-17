// lineからのwebhook受信時に発火する
function doPost(e) {
  var postData = JSON.parse(e.postData.contents);
  Context.logging(postData);
  var userId = postData.events[0].source.userId;
  var replyToken = postData.events[0].replyToken;
  if (typeof replyToken === 'undefined') {
    return ContentService.createTextOutput(JSON.stringify({'content': 'replyToken is undefined.'})).setMimeType(ContentService.MimeType.JSON);
  }
  var type = postData.events[0].type;
  switch (type) {
    case 'follow':
    case 'unfollow':
    case 'join':
    case 'leave':
    case 'postback':
    default:
      break;
    case 'message':
      messageAnalysis(postData);
      break;
  }
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}

// テスト用 urlを手動でコールして各関数を確認する
function doGet(e) {
  var msg = MessageTemplate.locationMsg("災害が発生している住所を教えてください。");
  MessageTemplate.push(ADMINID, msg);
  return ContentService.createTextOutput(JSON.stringify({'content': 'ok'})).setMimeType(ContentService.MimeType.JSON);
}

// ユーザーから送られてきたデータを解析して各処理に振り分ける
function messageAnalysis(postData) {
  var userMsg = postData.events[0].message.text;
  var replyToken = postData.events[0].replyToken;
  switch (userMsg) {
    case '災害現場登録':
      // 位置情報
      var msg = MessageTemplate.locationMsg("災害が発生している住所を教えてください。");
      MessageTemplate.reply(replyToken, msg);
      break;
    case 'サービス登録':
      break;
    default:
      var msg = MessageTemplate.defaultMsg(userMsg);
      MessageTemplate.reply(replyToken, msg);
      break;
  }
}
