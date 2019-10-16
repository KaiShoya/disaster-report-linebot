// lineからのwebhook送信時に発火する
function doPost(e) {
  Context.logging(e.postData.contents);
  Context.logging(JSON.parse(e.postData.contents));
  var userid = JSON.parse(e.postData.contents).events[0].source.userId;
  var reply_token = JSON.parse(e.postData.contents).events[0].replyToken;
  if (typeof reply_token === 'undefined') {
    return ContentService.createTextOutput(JSON.stringify({'content': 'replyToken is undefined.'})).setMimeType(ContentService.MimeType.JSON);
  }
  var type = JSON.parse(e.postData.contents).events[0].type;
  switch (type) {
    case 'follow':
    case 'unfollow':
    case 'join':
    case 'leave':
    case 'postback':
    default:
      break;
    case 'message':
      var user_msg = JSON.parse(e.postData.contents).events[0].message.text;
      var msg = MessageTemplate.defaultMsg(user_msg);
      MessageTemplate.reply(reply_token, msg);
      break;
  }
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}

// テスト用 urlを手動でコールして各関数を確認する
function doGet(e) {
  var msg = MessageTemplate.defaultMsg("テストだよー");
  MessageTemplate.push(ADMINID, msg);
  Context.logging("テストだよー");
  return ContentService.createTextOutput(JSON.stringify({'content': 'ok'})).setMimeType(ContentService.MimeType.JSON);
}
