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

// テスト用 urlを手動でコールして各関数を確認する
function doGet(e: any) {
  const msg: Object = MessageTemplate.locationMsg(
    '災害が発生している住所を教えてください。'
  )
  MessageTemplate.push(ADMINID, [msg])
  return ContentService.createTextOutput(
    JSON.stringify({content: 'ok'})
  ).setMimeType(ContentService.MimeType.JSON)
}

// ユーザーから送られてきたデータを解析して各処理に振り分ける
function messageAnalysis(replyToken: string, userId: string, message: any) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_DRAFT)
  const timestamp = new Date().toLocaleString('japanese', {
    timeZone: 'Asia/Tokyo'
  })

  const rowNo = Context.findRow(sheet, 0, userId)
  switch (message.text) {
    case '災害現場登録': {
      if (rowNo == -1) {
        sheet.appendRow([
          userId,
          0,
          null,
          null,
          null,
          null,
          null,
          null,
          timestamp
        ])
      } else {
        const row = sheet.getRange(
          Number(rowNo) + 1,
          1,
          1,
          sheet.getLastColumn()
        )
        const values = row.getValues()
        // 列を初期化
        for (let i in values[0]) {
          values[0][i] = null
        }
        // 初期値セット
        values[0][0] = userId // ユーザーID
        values[0][1] = 0 // タイプ
        values[0][8] = timestamp // 更新日時
        // 更新
        row.setValues(values)
      }
      // 位置情報用メッセージ
      const msg = MessageTemplate.locationMsg(
        '災害が発生している住所を教えてください。'
      )
      MessageTemplate.reply(replyToken, [msg])
      break
    }
    case 'サービス登録': {
      if (rowNo == -1) {
        sheet.appendRow([
          userId,
          0,
          null,
          null,
          null,
          null,
          null,
          null,
          timestamp
        ])
      } else {
        const row = sheet.getRange(
          Number(rowNo) + 1,
          1,
          1,
          sheet.getLastColumn()
        )
        const values = row.getValues()
        // 列を初期化
        for (let i in values[0]) {
          values[0][i] = null
        }
        // 初期値セット
        values[0][0] = userId // ユーザーID
        values[0][1] = 0 // タイプ
        values[0][8] = timestamp // 更新日時
        // 更新
        row.setValues(values)
      }

      const msg = MessageTemplate.imageMsg(
        '被害状況のわかる写真をアップロードしてください。',
        'image'
      )
      MessageTemplate.reply(replyToken, [msg])
      break
    }
    case undefined: {
      if (message.type == 'location') {
        if (rowNo == -1) break

        const row = sheet.getRange(
          Number(rowNo) + 1,
          1,
          1,
          sheet.getLastColumn()
        )
        const values = row.getValues()

        // 値セット
        values[0][2] = message.address // 住所
        values[0][3] = message.latitude // 緯度
        values[0][4] = message.longitude // 経度
        values[0][8] = timestamp // 更新日時

        // 更新
        row.setValues(values)

        // 日時確認用メッセージ
        const msg = MessageTemplate.datetimePickerQuickMsg(
          '確認した日時を教えてください。',
          'datetime'
        )
        MessageTemplate.reply(replyToken, [msg])
      } else if (message.type == 'image') {
        if (rowNo == -1) break

        if (message.contentProvider.type == 'line') {
          const response = MessageTemplate.getImage(message.id)
          const fileBlob = response.getBlob().setName(message.id)
          const fileId = Context.saveDrive(fileBlob)

          const row = sheet.getRange(
            Number(rowNo) + 1,
            1,
            1,
            sheet.getLastColumn()
          )
          let values = row.getValues()

          // 値セット
          values[0][7] = fileId // GoogleDriveの画像ID
          values[0][8] = timestamp // 更新日時

          // 更新
          row.setValues(values)

          let text = []
          text.push(MessageTemplate.flexMsg('種類: 災害現場登録'))
          text.push(MessageTemplate.flexMsg('住所: ' + values[0][2]))
          text.push(MessageTemplate.flexMsg('確認日時: ' + values[0][5]))
          text.push(MessageTemplate.flexMsg('状況: ' + values[0][6]))
          const msg = MessageTemplate.finalCheckMsg(text, values[0][7])
          MessageTemplate.reply(replyToken, [msg])
        }
      }
      break
    }
    default: {
      const msg = MessageTemplate.defaultMsg(message.text)
      MessageTemplate.reply(replyToken, [msg])
      break
    }
  }
}

// ユーザーからpostbackで送られてきたデータを解析して各処理に振り分ける
function postbackAnalysis(replyToken: string, userId: string, postback: any) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_DRAFT)
  const timestamp = new Date().toLocaleString('japanese', {
    timeZone: 'Asia/Tokyo'
  })

  const rowNo = Context.findRow(sheet, 0, userId)
  const data = Context.postback2hash(postback.data)
  switch (data['type']) {
    case 'datetime': {
      if (rowNo == -1) break

      const row = sheet.getRange(Number(rowNo) + 1, 1, 1, sheet.getLastColumn())
      const values = row.getValues()

      values[0][5] = postback.params.datetime // 確認日時
      values[0][8] = timestamp // 更新日時

      // 更新
      row.setValues(values)

      const datetimeMsg = MessageTemplate.defaultMsg(
        Context.datetime2japanese(postback.params.datetime)
      )
      const questionMsg = MessageTemplate.checkConditionMsg(
        'どんな状況ですか？',
        'checkCondition'
      )
      MessageTemplate.reply(replyToken, [datetimeMsg, questionMsg])
      break
    }
    case 'checkCondition': {
      if (rowNo == -1) break

      const row = sheet.getRange(Number(rowNo) + 1, 1, 1, sheet.getLastColumn())
      const values = row.getValues()

      values[0][6] = data['action'] // 状況
      values[0][8] = timestamp // 更新日時

      // 更新
      row.setValues(values)

      const msg = MessageTemplate.imageMsg(
        '被害状況のわかる写真をアップロードしてください。',
        'image'
      )
      MessageTemplate.reply(replyToken, [msg])
      break
    }
    case 'image': {
      if (rowNo == -1) break

      const row = sheet.getRange(Number(rowNo) + 1, 1, 1, sheet.getLastColumn())
      const values = row.getValues()

      var text = ''
      text += '種類: 災害現場登録\n'
      text += '住所: ' + values[0][2] + '\n'
      text += '確認日時: ' + values[0][5] + '\n'
      text += '状況: ' + values[0][6]
      const msg = MessageTemplate.defaultMsg(text)
      MessageTemplate.reply(replyToken, [msg])
    }
    case 'finalCheck': {
      if (rowNo == -1) break

      const row = sheet.getRange(Number(rowNo) + 1, 1, 1, sheet.getLastColumn())
      const values = row.getValues()

      switch (data['action']) {
        case 'register': {
          const locationSheet = SpreadsheetApp.openById(
            SHEET_ID
          ).getSheetByName(SHEET_LOCATION)
          locationSheet.appendRow(values[0])
          const msg = MessageTemplate.defaultMsg('登録しました！')
          MessageTemplate.reply(replyToken, [msg])

          // 下書きデータ削除
          for (let i in values[0]) {
            values[0][i] = null
          }
          row.setValues(values)
          break
        }
        case 'edit': {
          const msg = MessageTemplate.defaultMsg('どの項目を編集しますか？')
          MessageTemplate.reply(replyToken, [msg])
          break
        }
        case 'discard': {
          // 下書きデータ削除
          for (let i in values[0]) {
            values[0][i] = null
          }
          row.setValues(values)

          const msg = MessageTemplate.defaultMsg('破棄しました。')
          MessageTemplate.reply(replyToken, [msg])
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