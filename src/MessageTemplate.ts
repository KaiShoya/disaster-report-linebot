class MessageTemplate {
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

  // シンプルなテキストを送信するテンプレート
  public static defaultMsg(msg: string) {
    return {
      type: 'text',
      text: msg
    }
  }

  // シンプルなテキスト + locationのクイックリプライ機能
  public static locationMsg(msg: string) {
    return {
      type: 'text',
      text: msg,
      quickReply: {
        items: [
          {
            type: 'action',
            action: {
              type: 'location',
              label: '地図を使って送信する'
            }
          }
        ]
      }
    }
  }

  public static datetimePickerQuickMsg(msg: string, data: string) {
    return {
      type: 'text',
      text: msg,
      quickReply: {
        items: [
          {
            type: 'action',
            action: {
              type: 'datetimepicker',
              label: '日時を入力する',
              mode: 'datetime',
              data: 'type=' + data
            }
          }
        ]
      }
    }
  }

  public static checkConditionMsg(msg: string, data: string) {
    return {
      type: 'template',
      altText: msg,
      template: {
        type: 'buttons',
        text: msg,
        actions: [
          {
            type: 'postback',
            label: '全く通れない',
            data: 'type=' + data + '&action=1'
          },
          {
            type: 'postback',
            label: '徒歩でなら通れる',
            data: 'type=' + data + '&action=2'
          },
          {
            type: 'postback',
            label: '通れる',
            data: 'type=' + data + '&action=3'
          },
          {
            type: 'postback',
            label: 'どれにも当てはまらない',
            data: 'type=' + data + '&action=0'
          }
        ]
      }
    }
  }

  public static imageMsg(msg: string, data: string) {
    return {
      type: 'text',
      text: msg,
      quickReply: {
        items: [
          {
            type: 'action',
            action: {
              type: 'camera',
              label: '撮影する'
            }
          },
          {
            type: 'action',
            action: {
              type: 'cameraRoll',
              label: 'カメラロールから選択する'
            }
          },
          {
            type: 'action',
            action: {
              type: 'postback',
              label: '選択しない',
              data: 'type=image&action=noimage'
            }
          }
        ]
      }
    }
  }

  // Flex Messageで使用するプレーンなメッセージ
  public static flexMsg(msg: string) {
    return {
      type: 'text',
      text: msg,
      wrap: true
    }
  }

  // 最終確認用のメッセージ
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
              action: {
                type: 'postback',
                label: '登録する',
                data: 'type=finalCheck&action=register'
              }
            },
            {
              type: 'button',
              action: {
                type: 'postback',
                label: '修正する',
                data: 'type=finalCheck&action=edit'
              }
            },
            {
              type: 'button',
              action: {
                type: 'postback',
                label: '破棄する',
                data: 'type=finalCheck&action=discard'
              }
            }
          ]
        }
      }
    }
  }
}
