class Coordinate extends Spreadsheet {
  public id: string = null // ユーザーID
  public type: string = null // タイプ
  public address: string = null // 住所
  public latitude: string = null // 緯度
  public longitude: string = null // 経度
  public datetime: string = null // 確認日時
  public situation: string = null // 状況
  public imagePath: string = null // 写真
  protected row: GoogleAppsScript.Spreadsheet.Range

  constructor(userId: string, location?: boolean) {
    // 引数がtrueの時だけSHEET_LOCATIONを読み込む
    // それ以外はdraft
    super(location ? SHEET_LOCATION : SHEET_DRAFT, 0)
    this.row = this.findRow(userId)
    if (this.row != null)
      this.setValues(this.row.getValues()[0])
  }

  /**
   * 値をセットする
   * @param values getValues()で取得した値
   */
  public setValues(values: any[]) {
    this.id = values[0]
    this.type = values[1]
    this.address = values[2]
    this.latitude = values[3]
    this.longitude = values[4]
    this.datetime = values[5]
    this.situation = values[6]
    this.imagePath = values[7]
  }

  /**
   * 配列形式で値を取得する
   */
  public getArray(): Array<string> {
    return [
      this.id,
      this.type,
      this.address,
      this.latitude,
      this.longitude,
      this.datetime,
      this.situation,
      this.imagePath,
      this.timestamp
    ]
  }

  public resetData(): any {
    this.id = null
    this.type = null
    this.address = null
    this.latitude = null
    this.longitude = null
    this.datetime = null
    this.situation = null
    this.imagePath = null
    this.timestamp = null
  }

  /**
   * シートにデータを追加する
   */
  public insert() {
    this.appendRow(this.getArray())
  }

  /**
   * データを上書きする
   */
  public update() {
    this.row.setValues([this.getArray()])
  }

  /**
   * データを上書きする
   * データがなければ追加する
   */
  public replace() {
    if (this.row == null) {
      this.insert()
    } else {
      this.update()
    }
  }

  /**
   * 本番用のシートに保存し下書きデータを削除する
   */
  public save() {
    const coordinate: Coordinate = new Coordinate(this.id, true)
    coordinate.row = coordinate.findRow(coordinate.id)
    coordinate.setValues(this.row.getValues()[0])
    coordinate.insert()
    // 下書きデータ削除
    this.delete()
  }

  /**
   * シートからデータを削除する
   */
  public delete() {
    this.resetData()
    this.update()
  }
}
