// GANTI DENGAN LINK RAW index.html KAMU DARI GITHUB
const GITHUB_URL = "https://raw.githubusercontent.com/razzaqvip/checktrx/main/index.html";

function doGet() {
  try {
    // Robot ini akan mengambil file index.html terbaru dari GitHub kamu
    const response = UrlFetchApp.fetch(GITHUB_URL);
    const htmlContent = response.getContentText();
    
    return HtmlService.createTemplate(htmlContent)
      .evaluate()
      .setTitle('Rembang Setrika Express')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (e) {
    return HtmlService.createHtmlOutput("Gagal mengambil kode dari GitHub. Pastikan Link Raw benar.");
  }
}

// --- FUNGSI BACKEND (Tetap di sini) ---

function processData(noTransaksi, base64Data) {
  try {
    const folderId = "1eh0Ok0wLhIeoraZzz5HJ5XzLErySxaSG"; // Wajib diisi!
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    let fileUrl = "No Image";
    
    if (base64Data) {
      const folder = DriveApp.getFolderById(folderId);
      const bytes = Utilities.base64Decode(base64Data.split(',')[1]);
      const blob = Utilities.newBlob(bytes, "image/jpeg", "IMG_" + noTransaksi + ".jpg");
      const file = folder.createFile(blob);
      fileUrl = file.getUrl();
    }
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
