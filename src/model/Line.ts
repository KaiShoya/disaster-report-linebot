class Line extends MessageTemplate {
  // ユーザーのつぶやきにリプライを返す
  public static reply(replyToken: string, msg: Array<Object>) {
    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
      },
      method: 'post',
      payload: JSON.stringify({
        replyToken: replyToken,
        messages: msg
      })
    })
  }

  // 第1引数で指定したユーザーにプッシュ通知をする
  public static push(to: string, msg: Array<Object>) {
    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
      },
      method: 'post',
      payload: JSON.stringify({
        to: to,
        messages: msg
      })
    })
  }

  // 画像を取得する
  public static getImage(messageId: string) {
    var url = 'https://api.line.me/v2/bot/message/' + messageId + '/content'
    return UrlFetchApp.fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
      },
      method: 'get'
    })
  }

  public static locationMsg() {
    return Line.quickReplyMsg('災害が発生している住所を教えてください。', [
      Line.locationAction('地図を使って送信する')
    ])
  }

  public static datetimePickerQuickMsg() {
    return Line.quickReplyMsg('確認した日時を教えてください。', [
      Line.datetimePickerAction('日時を入力する', 'type=datetime')
    ])
  }

  public static checkConditionMsg() {
    return Line.buttonTemplate('どんな状況ですか？', [
      Line.postbackBtn('全く通れない', 'type=checkCondition&action=1'),
      Line.postbackBtn('徒歩でなら通れる', 'type=checkCondition&action=2'),
      Line.postbackBtn('通れる', 'type=checkCondition&action=3'),
      Line.postbackBtn('どれにも当てはまらない', 'type=checkCondition&action=0')
    ])
  }

  /**
   *
   * @param msg
   */
  public static imageMsg() {
    return Line.quickReplyMsg(
      '被害状況のわかる写真をアップロードしてください。',
      [
        Line.cameraAction('撮影する'),
        Line.cameraRollAction('カメラロールから選択する'),
        Line.postbackAction('洗濯しない', 'type=image&action=noimage')
      ]
    )
  }

  /**
   * 最終確認用のメッセージ
   * @param msg flexMsgの配列
   * @param imgId GoogleDriveの画像のID
   */
  public static finalCheckMsg(msg: Array<Object>, imgId: string) {
    return {
      type: 'flex',
      altText: 'this is a flex message',
      contents: {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '登録情報'
            }
          ]
        },
        hero: {
          type: 'image',
          align: 'center',
          aspectMode: 'cover',
          size: 'full',
          url: 'https://drive.google.com/uc?export=view&id=' + imgId
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: msg
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'button',
              action: Line.postbackBtn(
                '登録する',
                'type=finalCheck&action=register'
              )
            },
            {
              type: 'button',
              action: Line.postbackBtn(
                '修正する',
                'type=finalCheck&action=edit'
              )
            },
            {
              type: 'button',
              action: Line.postbackBtn(
                '破棄する',
                'type=finalCheck&action=discard'
              )
            }
          ]
        }
      }
    }
  }
}
