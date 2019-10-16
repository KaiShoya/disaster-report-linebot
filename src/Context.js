Context = function(){};

// 0埋め
Context.zeroPadding = function(num, digit) {
  // 桁数のデフォルトは2
  if (typeof digit === 'undefined') {digit = 2;}
  var zero = '';
  for(var i in digit) {
    zero = zero + '0';
  }
  return (zero + num).slice(-digit);
}

// シートにログを出力する
// 連想配列はLineのログとして扱う
Context.logging = function(msg) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_LOG),
      ts    = new Date().toLocaleString('japanese', {timeZone: 'Asia/Osaka'});
  if (msg instanceof Object) {
    if (msg instanceof Array) {
      msg.unshift(ts);
      sheet.appendRow(msg);
    } else {
      var userid = msg.events[0].source.userId;
      var type = msg.events[0].type;
      sheet.appendRow([ts, userid, type, msg]);
    }
  } else {
    sheet.appendRow([ts,"","", msg]);
  }
}

// date型をyyyy/mm/ddの文字列に変換する
Context.formatYMD = function(date) {
  if (typeof date.getFullYear() !== 'function') return date;
  return date.getFullYear()+"/"+tnis.zeroPadding(date.getMonth()+1)+"/"+tnis.zeroPadding(date.getDate());
}

// // 登録されたユーザーのログを保存する
// Context.userLog = function(id,txt,action) {
//   var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_BOOKING),
//       ts    = new Date().toLocaleString('japanese', {timeZone: 'Asia/Osaka'});

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
Context.postback2hash = function(data) {
  var d = data.split('&');
  var hash = {};
  for(var i in d) {
    var keySearch = d[i].search(/=/);
    var key = '';
    if(keySearch != -1) key = d[i].slice(0, keySearch);
    var val = d[i].slice(d[i].indexOf('=', 0) + 1);
    if(key != '') hash[key] = decodeURI(val);
  }
  return hash;
}

// hashをhttpパラメータに変換する
Context.hash2param = function(data) {
  var arr = [];
  for (var i in data) {
    if (data.hasOwnProperty(i)) {
      arr.push(i+"="+data[i]);
    }
  }
  return arr.join("&");
}