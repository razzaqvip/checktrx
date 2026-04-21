// 1. LINK RAW GITHUB (Pastikan ini sesuai dengan file di GitHub kamu)
const GITHUB_URL = "https://raw.githubusercontent.com/razzaqvip/checktrx/main/index.html";

// 2. NAMA TAB DI GOOGLE SHEETS (Sesuai gambar kamu: transaksi)
const NAMA_TAB = "transaksi"; 

function doGet() {
  try {
    const response = UrlFetchApp.fetch(GITHUB_URL);
    const htmlContent = response.getContentText();
    
    return HtmlService.createTemplate(htmlContent)
      .evaluate()
      .setTitle('Rembang Setrika Express')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (e) {
    return HtmlService.createHtmlOutput("Gagal mengambil kode dari GitHub: " + e.toString());
  }
}

// FUNGSI SIMPAN DATA
function processData(noTransaksi, base64Data) {
  try {
    // MASUKKAN ID FOLDER GOOGLE DRIVE KAMU DI SINI
    const folderId = "1eh0Ok0wLhIeoraZzz5HJ5XzLErySxaSG"; 
    
    // Kita panggil spesifik tab "transaksi"
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(NAMA_TAB);
    
    if (!sheet) return { status: "error", message: "Tab 'transaksi' tidak ditemukan!" };

    let fileUrl = "No Image";
    if (base64Data) {
      const folder = DriveApp.getFolderById(folderId);
      const bytes = Utilities.base64Decode(base64Data.split(',')[1]);
      const blob = Utilities.newBlob(bytes, "image/jpeg", "IMG_" + noTransaksi + ".jpg");
      const file = folder.createFile(blob);
      fileUrl = file.getUrl();
    }

    // Isi Baris: A (Timestamp), B (No. Transaksi), C (Foto)
    sheet.appendRow([new Date(), noTransaksi, fileUrl]);
    return { status: "success" };
    
  } catch (error) {
    return { status: "error", message: error.toString() };
  }
}

// FUNGSI CEK DATA
function getDataByNoTransaksi(noTransaksi) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(NAMA_TAB);
    if (!sheet) return { status: "not_found" };
    
    const data = sheet.getDataRange().getValues();
    
    // Mencari di kolom B (No. Transaksi)
    for (let i = 1; i < data.length; i++) {
      if (data[i][1].toString() === noTransaksi.toString()) {
        return { status: "found", fotoUrl: data[i][2] };
      }
    }
    return { status: "not_found" };
  } catch (e) {
    return { status: "error", message: e.toString() };
  }
}
