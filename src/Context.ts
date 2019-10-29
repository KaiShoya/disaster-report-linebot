class Context {
  // 0埋め
  public static zeroPadding(num: number, digit: number) {
    // 桁数のデフォルトは2
    if (typeof digit === 'undefined') digit = 2
    let zero = ''
    for (let i = 0; i < digit; i++) zero = zero + '0'
    return (zero + num).slice(-digit)
  }

  // シートにログを出力する
  // 連想配列はLineのログとして扱う
  public static logging(msg: any) {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_LOG),
      ts = new Date().toLocaleString('japanese', {timeZone: 'Asia/Tokyo'})
    if (msg instanceof Object) {
      if (msg instanceof Array) {
        msg.unshift(ts)
        sheet.appendRow(msg)
      } else {
        var userid = msg.events[0].source.userId
        var type = msg.events[0].type
        sheet.appendRow([ts, userid, type, msg.events[0]])
      }
    } else {
      sheet.appendRow([ts, null, null, msg])
    }
  }

  // 列番号を指定して検索する
  // 見つからなかった場合-1を返す
  public static findRow(
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    columnNo: number,
    text: string
  ) {
    const range = sheet.getDataRange()
    const values = range.getValues()

    for (let i in values) {
      const item = values[i][columnNo]
      if (text === item.toString()) {
        return i
      }
    }

    return -1
  }

  // date型をyyyy/mm/ddの文字列に変換する
  public static formatYMD(date: Date) {
    if (typeof date.getFullYear() !== 'function') return date
    return (
      date.getFullYear() +
      '/' +
      this.zeroPadding(date.getMonth() + 1, 2) +
      '/' +
      this.zeroPadding(date.getDate(), 2)
    )
  }

  // // 登録されたユーザーのログを保存する
  // public static userLog(id,txt,action) {
  //   var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_BOOKING),
  //       ts    = new Date().toLocaleString('japanese', {timeZone: 'Asia/Tokyo'});

  //   var range = sheet.getDataRange();
  //   var column = this.findUser(id);
  //   // 新規ユーザー
  //   if (column == null) {
  //     data = this.getProfile(id);
  //     sheet.appendRow([ts,id,data.displayName,data.pictureUrl]);
  //   } else {
  //   }
  // }

  // postbackのdataをhashに変換する
  public static postback2hash(data: string) {
    const d: string[] = data.split('&')
    let hash = {}
    for (let i in d) {
      let keySearch = d[i].search(/=/)
      let key = ''
      if (keySearch != -1) key = d[i].slice(0, keySearch)
      let val = d[i].slice(d[i].indexOf('=', 0) + 1)
      if (key != '') hash[key] = decodeURI(val)
    }
    return hash
  }

  // hashをhttpパラメータに変換する
  public static hash2param(data: Array<any>) {
    var arr = []
    for (var i in data) {
      if (data.hasOwnProperty(i)) {
        arr.push(i + '=' + data[i])
      }
    }
    return arr.join('&')
  }

  // datetimepickerで取得した値を日本人向けにフォーマットする
  public static datetime2japanese(value: string) {
    var array = value.split('T')
    var date = array[0].split('-')
    var time = array[1].split(':')
    return (
      date[0] +
      '年' +
      date[1] +
      '月' +
      date[2] +
      '日' +
      time[0] +
      '時' +
      time[1] +
      '分'
    )
  }

  // 画像をGoogleDriveに保存する
  public static saveDrive(fileBlob: GoogleAppsScript.Base.BlobSource) {
    // ルートディレクトリに画像を保存
    var file = DriveApp.createFile(fileBlob)

    // ディレクトリの階層を移動
    var folders = DriveApp.getFoldersByName('upload')
    while (folders.hasNext()) {
      var folder = folders.next()
      if (folder.getName() == 'upload') {
        // 画像をコピー
        var savedFile = file.makeCopy(file.getName(), folder)
        // ルートディレクトリの画像を削除
        file.setTrashed(true)
        return savedFile.getId()
      }
    }
  }
}
