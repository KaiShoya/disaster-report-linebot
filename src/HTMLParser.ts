class HTMLParser {
  // // urlからhtml取得
  // public getHtml(url) {
  //   var page = UrlFetchApp.fetch(url)
  //   // FIXME: Xml使えない？
  //   var doc = Xml.parse(page, true)
  //   var bodyHtml = doc.html.body.toXmlString()
  //   doc = XmlService.parse(bodyHtml)
  //   var root = doc.getRootElement()
  //   return root
  // }

  // idを指定して取得
  public getElementById(element, idName) {
    var descendants = element.getDescendants()
    for (var i in descendants) {
      var elem = descendants[i].asElement()
      if (elem != null) {
        var id = elem.getAttribute('id')
        if (id != null && id.getValue() == idName) return elem
      }
    }
  }

  // classを指定して取得
  public getElementsByClass(element, className) {
    var data = [],
      descendants = element.getDescendants()
    descendants.push(element)
    for (var i in descendants) {
      var elem = descendants[i].asElement()
      if (elem != null) {
        var classes = elem.getAttribute('class')
        if (classes != null) {
          classes = classes.getValue()
          if (classes == className) {
            data.push(elem)
          } else {
            classes = classes.split(' ')
            for (var j in classes) {
              if (classes[j] == className) {
                data.push(elem)
                break
              }
            }
          }
        }
      }
    }
    return data
  }

  // tagを指定して取得
  public getElementsByTag(element, tagName) {
    var data = [],
      descendants = element.getDescendants()
    for (var i in descendants) {
      var elem = descendants[i].asElement()
      if (elem != null && elem.getName() == tagName) data.push(elem)
    }
    return data
  }
}
