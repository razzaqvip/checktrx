function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Rembang Setrika Express - System')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function processData(noTransaksi, base64Data) {
  try {
    const folderId = "1eh0Ok0wLhIeoraZzz5HJ5XzLErySxaSG"; // Ganti dengan ID Folder Drive Anda
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    let fileUrl = "No Image";
    
    if (base64Data) {
      const folder = DriveApp.getFolderById(folderId);
      // Membersihkan format base64
      const contentType = base64Data.substring(5, base64Data.indexOf(';'));
      const bytes = Utilities.base64Decode(base64Data.split(',')[1]);
      const blob = Utilities.newBlob(bytes, contentType, "IMG_" + noTransaksi + ".jpg");
      
      const file = folder.createFile(blob);
      fileUrl = file.getUrl();
    }

    // Isi ke Sheet: A: Timestamp, B: No. Transaksi, C: Foto
    sheet.appendRow([new Date(), noTransaksi, fileUrl]);

    return { status: "success" };
  } catch (error) {
    return { status: "error", message: error.toString() };
  }
}

function getDataByNoTransaksi(noTransaksi) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1].toString() === noTransaksi.toString()) {
      return { status: "found", fotoUrl: data[i][2] };
    }
  }
  return { status: "not_found" };
}
