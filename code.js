function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Rembang Setrika Express - System')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function processForm(formObject) {
  try {
    const folderId = "1eh0Ok0wLhIeoraZzz5HJ5XzLErySxaSG"; // ID Folder Drive untuk simpan foto
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    let fileUrl = "";
    if (formObject.foto && formObject.foto.length > 0) {
      const folder = DriveApp.getFolderById(folderId);
      const blob = formObject.foto;
      const file = folder.createFile(blob);
      file.setName("IMG_" + formObject.noTransaksi);
      fileUrl = file.getUrl();
    }

    // A: Timestamp (Otomatis), B: No. Transaksi, C: Foto
    sheet.appendRow([
      new Date(), 
      formObject.noTransaksi, 
      fileUrl
    ]);

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
      return { 
        status: "found", 
        timestamp: data[i][0], 
        fotoUrl: data[i][2] 
      };
    }
  }
  return { status: "not_found" };
}
