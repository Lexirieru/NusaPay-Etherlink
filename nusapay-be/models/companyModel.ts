import mongoose, { Schema } from "mongoose";

// model untuk bentuk data informasi terkait company
const CompanyDataSchema = new Schema(
  {
    companyId: {
      type: String,
      required: true,
      unique: true, // pastikan companyId unik
    },
    email: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: false,
    },
    profilePicture: {
      type: String,
      required: false,
    },
    walletAddress: {
      type: String,
      required: false,
    },
    networkChainId: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export const CompanyDataModel = mongoose.model(
  "Companydata",
  CompanyDataSchema
);

const CompanyStatsSchema = new Schema({
  companyId: {
    type: String,
    required: true,
  },

  // totalPayrollExecuted: jumlah semua payroll yang pernah dieksekusi
  totalPayrollExecuted: {
    type: Number,
    required: false,
  },

  // totalBurnExecuted: jumlah total transaksi burning IDRX
  totalBurnExecuted: {
    type: Number,
    required: false,
  },

  // totalRedeemed: jumlah total transaksi redeem IDRX ke bank
  totalRedeemed: {
    type: Number,
    required: false,
  },

  // totalEmployeesRegistered: total karyawan yang pernah terdaftar
  totalEmployeeRegistered: {
    type: Number,
    required: false,
  },

  // totalGroups: jumlah group of employee yang dibuat
  totalGroups: {
    type: Number,
    required: false,
  },

  // totalIDRXBurned: akumulasi jumlah IDRX yang sudah dibakar
  totalIDRXBurned: {
    type: Number,
    required: false,
  },

  // totalIDRXRedeemed: jumlah IDRX yang berhasil diredeem ke bank
  totalIDRXRedeemed: {
    type: Number,
    required: false,
  },

  // averageEmployeesPerGroup: rata-rata jumlah karyawan per grup
  averageEmployeesPerGroup: {
    type: Number,
    required: false,
  },
});

export const CompanyStatsModel = mongoose.model(
  "CompanyStats",
  CompanyStatsSchema
);

const LoginSessionTokenSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

export const LoginSessionTokenModel = mongoose.model(
  "LoginSession",
  LoginSessionTokenSchema
);
