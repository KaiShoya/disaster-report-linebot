/**
 * スプレッドシートを読み書きするためのメソッドを詰め込んだクラス
 * ファイルの先頭の0はクラス継承時に先にロードされる必要があるため
 */
class Spreadsheet {
  protected sheet: GoogleAppsScript.Spreadsheet.Sheet
  protected searchColumn: number
  protected timestamp: string

  constructor(sheetName: string, searchColumn: number, sheetId?: string) {
    this.sheet = SpreadsheetApp.openById(
      sheetId ? sheetId : SHEET_ID
    ).getSheetByName(sheetName)
    this.searchColumn = searchColumn
    this.timestamp = new Date().toLocaleString('japanese', {
      timeZone: 'Asia/Tokyo'
    })
  }

  /**
   * 列番号を指定して検索する
   * 見つからなかった場合-1を返す
   * @param text 検索する文字列
   * @param columnNo 検索する列番号 defalut: constructorの第二引数
   * @returns 列番号: number
   */
  public findRowNum(text: string, columnNo?: number): number {
    const column = columnNo == undefined ? this.searchColumn : columnNo
    const range = this.sheet.getDataRange()
    const values = range.getValues()

    for (let i in values) {
      const item = values[i][columnNo]
      if (text === item.toString()) {
        return Number(i)
      }
    }

    return -1
  }

  /**
   * 列番号を指定して検索し、検索結果を配列で返す
   * 見つからなかった場合nullを返す
   * @param text 検索する文字列
   * @param columnNo 検索する列番号 defalut: constructorの第二引数
   * @returns 列データ: GoogleAppsScript.Spreadsheet.Range
   */
  public findRow(
    text: string,
    columnNo?: number
  ): GoogleAppsScript.Spreadsheet.Range {
    const column = columnNo == undefined ? this.searchColumn : columnNo
    const rowNo = this.findRowNum(text, column)

    if (rowNo == -1) return null

    const row = this.sheet.getRange(
      Number(rowNo) + 1,
      1,
      1,
      this.sheet.getLastColumn()
    )
    return row
  }

  /**
   * シートにデータを追加する
   * @param data 追加するデータの配列
   */
  public appendRow(data: any[]): any {
    this.sheet.appendRow(data)
  }
}
