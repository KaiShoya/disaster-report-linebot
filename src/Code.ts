// lineからのwebhook受信時に発火する
function doPost(e: any) {
  const postData = JSON.parse(e.postData.contents)
  Context.logging(postData)
  const replyToken: string = postData.events[0].replyToken
  const userId: string = postData.events[0].source.userId
  if (typeof replyToken === 'undefined') {
    return ContentService.createTextOutput(
      JSON.stringify({content: 'replyToken is undefined.'})
    ).setMimeType(ContentService.MimeType.JSON)
  }
  const type = postData.events[0].type
  switch (type) {
    case 'follow':
    case 'unfollow':
    case 'join':
    case 'leave':
    default:
      break
    case 'postback':
      const postback = postData.events[0].postback
      postbackAnalysis(replyToken, userId, postback)
      break
    case 'message':
      const message = postData.events[0].message
      messageAnalysis(replyToken, userId, message)
      break
  }
  return ContentService.createTextOutput(
    JSON.stringify({content: 'post ok'})
  ).setMimeType(ContentService.MimeType.JSON)
}

// GoogleMapにSpreadsheetの座標データを表示する
function doGet(e: any) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_LOCATION)
  const row = sheet.getDataRange()
  const values = row.getValues()
  let locations = []

  for (let i in values) {
    locations.push({
      lat: values[i][3],
      lng: values[i][4]
    })
  }

  let tff = HtmlService.createTemplateFromFile('html/index')
  tff.locations = JSON.stringify(locations)
  return tff.evaluate()
}

// ユーザーから送られてきたデータを解析して各処理に振り分ける
function messageAnalysis(replyToken: string, userId: string, message: any) {
  const draft: Coordinate = new Coordinate(userId)
  switch (message.text) {
    case '災害現場登録': {
      // 初期値セット
      draft.id = userId
      draft.type = '0'
      // データを保存する
      draft.replace()
      // 位置情報用メッセージ
      const msg = Line.locationMsg()
      Line.reply(replyToken, [msg])
      break
    }
    case 'サービス登録': {
      // 初期値セット
      draft.id = userId
      draft.type = '1'
      // データを保存する
      draft.replace()

      const msg = Line.imageMsg()
      Line.reply(replyToken, [msg])
      break
    }
    case undefined: {
      if (message.type == 'location') {
        // 値セット
        draft.address = message.address // 住所
        draft.latitude = message.latitude // 緯度
        draft.longitude = message.longitude // 経度
        // 更新
        draft.update()

        // 日時確認用メッセージ
        const msg = Line.datetimePickerQuickMsg()
        Line.reply(replyToken, [msg])
      } else if (message.type == 'image') {
        if (message.contentProvider.type == 'line') {
          const response = Line.getImage(message.id)
          const fileBlob = response.getBlob().setName(message.id)
          const fileId = Context.saveDrive(fileBlob)

          draft.imagePath = fileId
          // 更新
          draft.update()

          let text = []
          text.push(Line.flexMsg('種類: 災害現場登録'))
          text.push(Line.flexMsg('住所: ' + draft.address))
          text.push(Line.flexMsg('確認日時: ' + draft.datetime))
          text.push(Line.flexMsg('状況: ' + draft.situation))
          const msg = Line.finalCheckMsg(text, draft.imagePath)
          Line.reply(replyToken, [msg])
        }
      }
      break
    }
    default: {
      const msg = Line.simpleMsg(message.text)
      Line.reply(replyToken, [msg])
      break
    }
  }
}

// ユーザーからpostbackで送られてきたデータを解析して各処理に振り分ける
function postbackAnalysis(replyToken: string, userId: string, postback: any) {
  const draft: Coordinate = new Coordinate(userId)
  const data = Context.postback2hash(postback.data)
  switch (data['type']) {
    case 'datetime': {
      draft.datetime = postback.params.datetime
      // 更新
      draft.update()

      const datetimeMsg = Line.simpleMsg(
        Context.datetime2japanese(postback.params.datetime)
      )
      const questionMsg = Line.checkConditionMsg()
      Line.reply(replyToken, [datetimeMsg, questionMsg])
      break
    }
    case 'checkCondition': {
      draft.situation = data['action']
      // 更新
      draft.update()

      const msg = Line.imageMsg()
      Line.reply(replyToken, [msg])
      break
    }
    case 'image': {
      var text = ''
      text += '種類: 災害現場登録\n'
      text += '住所: ' + draft.address + '\n'
      text += '確認日時: ' + draft.datetime + '\n'
      text += '状況: ' + draft.situation
      const msg = Line.simpleMsg(text)
      Line.reply(replyToken, [msg])
    }
    case 'finalCheck': {
      switch (data['action']) {
        case 'register': {
          draft.save()
          const msg = Line.simpleMsg('登録しました！')
          Line.reply(replyToken, [msg])
          break
        }
        case 'edit': {
          const msg = Line.simpleMsg('どの項目を編集しますか？')
          Line.reply(replyToken, [msg])
          break
        }
        case 'discard': {
          // 下書きデータ削除
          draft.delete()
          const msg = Line.simpleMsg('破棄しました。')
          Line.reply(replyToken, [msg])
          break
        }
      }
      break
    }
    default: {
      break
    }
  }
}
