// lineからのwebhook受信時に発火する
function doPost(e) {
  var postData = JSON.parse(e.postData.contents);
  Context.logging(postData);
  var replyToken = postData.events[0].replyToken;
  var userId = postData.events[0].source.userId;
  if (typeof replyToken === 'undefined') {
    return ContentService.createTextOutput(JSON.stringify({'content': 'replyToken is undefined.'})).setMimeType(ContentService.MimeType.JSON);
  }
  var type = postData.events[0].type;
  switch (type) {
    case 'follow':
    case 'unfollow':
    case 'join':
    case 'leave':
    default:
      break;
    case 'postback':
      var postback = postData.events[0].postback;
      postbackAnalysis(replyToken, userId, postback);
      break;
    case 'message':
      var message = postData.events[0].message;
      messageAnalysis(replyToken, userId, message);
      break;
  }
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}

// テスト用 urlを手動でコールして各関数を確認する
function doGet(e) {
  var msg = MessageTemplate.locationMsg('災害が発生している住所を教えてください。');
  MessageTemplate.push(ADMINID, msg);
  return ContentService.createTextOutput(JSON.stringify({'content': 'ok'})).setMimeType(ContentService.MimeType.JSON);
}

// ユーザーから送られてきたデータを解析して各処理に振り分ける
function messageAnalysis(replyToken, userId, message) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_DRAFT);
  var timestamp = new Date().toLocaleString('japanese', {timeZone: 'Asia/Tokyo'});

  var rowNo = Context.findRow(sheet, 0, userId);
  switch (message.text) {
    case '災害現場登録':
      if (rowNo == -1) {
        sheet.appendRow([userId, 0, null, null, null, null, null, null, timestamp]);
      } else {
        var row = sheet.getRange(Number(rowNo)+1, 1, 1, sheet.getLastColumn());
        var values = row.getValues();
        // 列を初期化
        for (i in values[0]) {
          values[0][i] = null;
        }
        // 初期値セット
        values[0][0] = userId; // ユーザーID
        values[0][1] = 0; // タイプ
        values[0][8] = timestamp; // 更新日時
        // 更新
        row.setValues(values);
      }
      // 位置情報用メッセージ
      var msg = MessageTemplate.locationMsg('災害が発生している住所を教えてください。');
      MessageTemplate.reply(replyToken, [msg]);
      break;
    case 'サービス登録':
      break;
    case undefined:
      if (message.type == 'location') {
        if (rowNo == -1) break;

        var row = sheet.getRange(Number(rowNo)+1, 1, 1, sheet.getLastColumn());
        var values = row.getValues();

        // 値セット
        values[0][2] = message.address; // 住所
        values[0][3] = message.latitude; // 緯度
        values[0][4] = message.longitude; // 経度
        values[0][8] = timestamp; // 更新日時

        // 更新
        row.setValues(values);

        // 日時確認用メッセージ
        var msg = MessageTemplate.datetimePickerQuickMsg('確認した日時を教えてください。', 'datetime');
        MessageTemplate.reply(replyToken, [msg]);
      }
      break;
    default:
      var msg = MessageTemplate.defaultMsg(message.text);
      MessageTemplate.reply(replyToken, [msg]);
      break;
  }
}

// ユーザーからpostbackで送られてきたデータを解析して各処理に振り分ける
function postbackAnalysis(replyToken, userId, postback) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_DRAFT);
  var timestamp = new Date().toLocaleString('japanese', {timeZone: 'Asia/Tokyo'});

  var rowNo = Context.findRow(sheet, 0, userId);
  var data = Context.postback2hash(postback.data);
  switch (data.type) {
    case 'datetime':
      if (rowNo == -1) break;

      var row = sheet.getRange(Number(rowNo)+1, 1, 1, sheet.getLastColumn());
      var values = row.getValues();

      values[0][5] = postback.params.datetime; // 確認日時
      values[0][8] = timestamp; // 更新日時

      // 更新
      row.setValues(values);

      var datetimeMsg = MessageTemplate.defaultMsg(Context.datetime2japanese(postback.params.datetime));
      var questionMsg = MessageTemplate.checkConditionMsg("どんな状況ですか？", 'checkCondition');
      MessageTemplate.reply(replyToken, [datetimeMsg, questionMsg]);
      break;
    case 'checkCondition':
      if (rowNo == -1) break;

      var row = sheet.getRange(Number(rowNo)+1, 1, 1, sheet.getLastColumn());
      var values = row.getValues();

      values[0][6] = data.action; // 状況
      values[0][8] = timestamp; // 更新日時

      // 更新
      row.setValues(values);

      var msg = MessageTemplate.imageMsg('被害状況のわかる写真をアップロードしてください。', 'image');
      MessageTemplate.reply(replyToken, [msg]);
      break;
    case 'image':
      if (rowNo == -1) break;

      var row = sheet.getRange(Number(rowNo)+1, 1, 1, sheet.getLastColumn());
      var values = row.getValues();

      var text = "";
      text += "種類: 災害現場登録\n";
      text += "住所: " + values[0][2] + '\n';
      text += "確認日時: " + values[0][5] + '\n';
      text += "状況: " + values[0][6];
      var msg = MessageTemplate.defaultMsg(text);
      MessageTemplate.reply(replyToken, [msg]);
    default:
      break;
  }
}
