function sendSms(to, body) {
  var messages_url = "https://api.twilio.com/2010-04-01/Accounts/YOURACCOUNTSID/Messages.json";
  
  var payload = {
    "To": to,
    "Body" : body,
    "From" : "YOURTWILIONUMBER" 
  };

  var options = {
    "method" : "post",
    "payload" : payload
  };

  options.headers = { 
    "Authorization" : "Basic " + Utilities.base64Encode("YOURACCOUNTSID:YOURAUTHTOKEN")
  };

  UrlFetchApp.fetch(messages_url, options);
}

function sendAll() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Campaign");
  var startRow = 2; 
  var numRows = sheet.getLastRow() - 1; 
  var dataRange = sheet.getRange(startRow, 1, numRows, 2) 
  var data = dataRange.getValues();

  for (i in data) {
    var row = data[i];
    if (row[0] != "" && sheet.getRange(startRow + Number(i), 3).getValue() != "sent") {
      try {
        response_data = sendSms(row[0], row[1]);
        status = "sent";
      } catch(err) {
          Logger.log(err);
          status = "error";
      }
      sheet.getRange(startRow + Number(i), 3).setValue(status);
    } else {
        status = "skipped";
        sheet.getRange(startRow + Number(i), 3).setValue(status);
    }
  }
}

function main() {
  sendAll();
  //sendSms("(407) 791-2208", "Testing 123");
}
