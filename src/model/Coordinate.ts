class Coordinate {
  public id: string = null // ユーザーID
  public type: string = null // タイプ
  public address: string = null // 住所
  public latitude: string = null // 緯度
  public longitude: string = null // 経度
  public datetime: string = null // 確認日時
  public situation: string = null // 状況
  public imagePath: string = null // 写真
  private timestamp: string = null // 更新日時

  constructor() {
    this.timestamp = new Date().toLocaleString('japanese', {
      timeZone: 'Asia/Tokyo'
    })
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
}
