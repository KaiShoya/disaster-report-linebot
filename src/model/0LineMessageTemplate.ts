class MessageTemplate {
  // シンプルなテキストのテンプレート
  public static simpleMsg(msg: string) {
    return {
      type: 'text',
      text: msg
    }
  }

  /**
   * クイックリプライ用のメッセージテンプレート
   * @param msg テキスト
   * @param items クイックリプライ用のメッセージオブジェクト
   */
  public static quickReplyMsg(msg: string, items: Array<Object>) {
    return {
      type: 'text',
      text: msg,
      quickReply: {
        items: items
      }
    }
  }

  /**
   * カメラアクション
   * クイックリプライ専用
   * @param label ラベル
   */
  public static cameraAction(label: string) {
    return {
      type: 'action',
      action: {
        type: 'camera',
        label: label
      }
    }
  }

  /**
   * カメラロールアクション
   * クイックリプライ専用
   * @param label ラベル
   */
  public static cameraRollAction(label: string) {
    return {
      type: 'action',
      action: {
        type: 'cameraRoll',
        label: label
      }
    }
  }

  /**
   * 位置情報アクション
   * クイックリプライ専用
   * @param label ラベル
   */
  public static locationAction(label: string) {
    return {
      type: 'action',
      action: {
        type: 'location',
        label: label
      }
    }
  }

  /**
   * 日時選択アクション
   * @param label ラベル
   * @param type dataに表示するタイプ
   */
  public static datetimePickerAction(label: string, data: string) {
    return {
      type: 'action',
      action: {
        type: 'datetimepicker',
        label: label,
        mode: 'datetime',
        data: data
      }
    }
  }

  /**
   * 日付選択アクション
   * @param label ラベル
   * @param type dataに表示するタイプ
   */
  public static datePickerAction(label: string, data: string) {
    return {
      type: 'action',
      action: {
        type: 'datetimepicker',
        label: label,
        mode: 'date',
        data: data
      }
    }
  }

  /**
   * 時間選択アクション
   * @param label ラベル
   * @param type dataに表示するタイプ
   */
  public static timePickerAction(label: string, data: string) {
    return {
      type: 'action',
      action: {
        type: 'datetimepicker',
        label: label,
        mode: 'time',
        data: data
      }
    }
  }

  /**
   * ポストバックアクション
   * @param label ラベル
   * @param type データタイプ
   * @param action アクション
   */
  public static postbackAction(label: string, data: string) {
    return {
      type: 'action',
      action: MessageTemplate.postbackBtn(label, data)
    }
  }

  /**
   * ボタンテンプレートメッセージ
   * @param msg メッセージ
   * @param actions ボタンアクション
   */
  public static buttonTemplate(msg: string, actions: Array<Object>) {
    return {
      type: 'template',
      altText: msg,
      template: {
        type: 'buttons',
        text: msg,
        actions: actions
      }
    }
  }

  /**
   *
   * @param label ラベル
   * @param type データタイプ
   * @param action アクション
   */
  public static postbackBtn(label: string, data: string) {
    return {
      type: 'postback',
      label: label,
      data: data
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
}
