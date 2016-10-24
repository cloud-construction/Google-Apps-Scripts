function lookup(phoneNumber) {
    var lookupUrl = "https://lookups.twilio.com/v1/PhoneNumbers/" + phoneNumber + "?Type=carrier";
    var options = {
        "method": "get"
    };
    options.headers = {
        "Authorization": "Basic " + Utilities.base64Encode("ACcf8380b71eef3cc29ac6b53a52bae9ef:86170fe2521fe0231e4285abacb8968a")
    };
    tw
    var response = UrlFetchApp.fetch(lookupUrl, options);
    var data = JSON.parse(response);
    Logger.log(data);
    return data;
}
function lookupAll() {
    var sheet = SpreadsheetApp.getActiveSheet();
    var resumeCell = sheet.getRange(2, 8).getValue()
    var startRow = 2;
    var numRows = sheet.getLastRow() - 1;
    //var dataRange = sheet.getRange(startRow, 1, numRows); 
    var dataRange = sheet.getRange(resumeCell, 1, numRows);
    // TODO: Exlude Rows if "Twilio Lookup = 'Yes'" from array
    var phoneNumbers = dataRange.getValues();
    for (var i in phoneNumbers) {
        var phoneNumber = phoneNumbers[i];
        var spreadsheetRow = startRow + Number(i);
        if (phoneNumber != "" && sheet.getRange(spreadsheetRow, 7).getValue() != 'Yes') {
            try {
                sheet.getRange(spreadsheetRow, 2, spreadsheetRow, 6).setValue(""); // Clears before writing
                data = lookup(phoneNumber);
                if (data['status'] == 404) {
                    sheet.getRange(spreadsheetRow, 2).setValue("not found"); // Number not found
                    resumeCell++;
                    sheet.getRange(2, 8).setValue(resumeCell + 1)
                } else {
                    sheet.getRange(spreadsheetRow, 2).setValue("found");
                    sheet.getRange(spreadsheetRow, 3).setValue(data['carrier']['type']);
                    sheet.getRange(spreadsheetRow, 4).setValue(data['carrier']['name']);
                    sheet.getRange(spreadsheetRow, 5).setValue(data['country_code']);
                    sheet.getRange(spreadsheetRow, 6).setValue(data['national_format']);
                    sheet.getRange(spreadsheetRow, 7).setValue('Yes');
                    resumeCell++;
                    sheet.getRange(2, 8).setValue(resumeCell + 1)
                }
            } catch (err) {
                Logger.log(err);
                sheet.getRange(spreadsheetRow, 2).setValue('lookup error'); // API callback error
                sheet.getRange(spreadsheetRow, 7).setValue('No');
            }
        } else {
            sheet.getRange(spreadsheetRow, 7).setValue('Yes');
            resumeCell++;
            sheet.getRange(2, 8).setValue(resumeCell);
        }
    }
}
function main() {
    lookupAll();
}
