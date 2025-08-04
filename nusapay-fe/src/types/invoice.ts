// invoice.ts


/**
 * Mendefinisikan kemungkinan status dari sebuah invoice.
 * - pending: Invoice dibuat, menunggu pembayaran/aksi.
 * - processing: Pembayaran sedang diproses oleh sistem.
 * - completed: Semua transfer dalam invoice berhasil.
 * - partially_failed: Sebagian transfer berhasil, sebagian gagal.
 * - failed: Seluruh proses pembayaran invoice gagal.
 */
export type InvoiceStatus =
  | "pending"
  | "processing"
  | "completed"
  | "partially_failed"
  | "failed";

/**
 * Tipe Data Utama untuk Invoice (Data Lengkap)
 *
 * Interface ini mendefinisikan struktur data lengkap dari sebuah invoice
 * yang disimpan di database.
 */
export interface Invoice {
  _id: string; // ID unik dari database (MongoDB)
  txId: string;
  invoiceNumber: string; // Nomor invoice yang mudah dibaca (e.g., INV-2025-001)
  companyId: string; // ID perusahaan yang membuat invoice
  templateName: string; // Nama template/grup pembayaran
  //   recipients: Recipient[]; // Daftar penerima yang termasuk dalam invoice ini
  recipient: string; // Daftar penerima yang termasuk dalam invoice ini

  // Rincian Biaya
  currency: string; // Mata uang yang digunakan (e.g., "USD", "IDR")
  localCurrency: string; // Mata uang lokal (jika berbeda dari currency utama)
  bankAccountName: string; // Mata uang lokal (jika berbeda dari currency utama)
  bankAccount: string; // Mata uang lokal (jika berbeda dari currency utama)
  amount: number; // Total jumlah yang ditransfer ke semua penerima
  networkFee: number; // Biaya jaringan blockchain (jika ada)
  adminFee: number; // Biaya administrasi platform
  totalCost: number; // totalAmount + networkFee + adminFee

  // Status dan Waktu
  status: InvoiceStatus;
  createdAt: Date; // Waktu invoice dibuat
  updatedAt: Date; // Waktu invoice terakhir diupdate
  completedAt?: Date; // Waktu proses invoice selesai (opsional)

  // ID Transaksi (opsional, diisi setelah proses)
  batchTransactionId?: string; // ID transaksi utama untuk seluruh batch (jika ada)
}

/**
 * Tipe Data untuk Ringkasan Invoice (Untuk Daftar/Dashboard)
 *
 * Digunakan saat menampilkan daftar invoice agar tidak perlu memuat semua data
 * 'recipients' yang bisa jadi sangat besar.
 */
export interface InvoiceSummary {
  _id: string;
  invoiceNumber: string;
  templateName: string;
  recipientCount: number; // Hanya jumlah penerima
  totalCost: number;
  status: InvoiceStatus;
  createdAt: Date;
}

/**
 * Tipe Data untuk Membuat Invoice Baru (Payload dari Frontend)
 *
 * Interface ini mendefinisikan data yang dibutuhkan dari frontend
 * untuk membuat sebuah invoice baru.
 */
export interface InvoiceCreationPayload {
  txId: string;
  companyId: string;
  templateName: string;
  // Daripada mengirim semua detail, frontend cukup mengirim ID karyawan
  // dan jumlahnya. Backend akan mengambil detail lain dari database.
  // Ini lebih aman dan efisien.
  recipients: {
    employeeId: string; // ID dari data Employee
    amount: number; // Jumlah yang akan ditransfer
  }[];
}

/**
 * Tipe Data untuk Hasil Proses Transfer (Response dari Backend)
 *
 * Memberikan feedback detail mengenai hasil proses pembayaran sebuah invoice.
 */
export interface InvoiceProcessResult {
  invoiceId: string; // ID invoice yang diproses
  newStatus: InvoiceStatus; // Status terbaru dari invoice
  message: string; // Pesan umum (e.g., "Proses transfer selesai")
  details: {
    recipientId: string; // ID penerima (_id dari Recipient)
    success: boolean; // Status sukses/gagal untuk penerima ini
    transactionHash?: string; // Hash transaksi individual (jika ada)
    error?: string; // Pesan error jika gagal
  }[];
}
