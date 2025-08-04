import mongoose, { Schema } from "mongoose";

const PayrollSchema = new Schema(
  {
    // Company mana yang ngelakuin payroll ini
    companyId: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyWalletAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String, // "Approved", "Rejected", "On-chain Burned", "Redeemed"
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    totalRecipients: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export const PayrollModel = mongoose.model("Payroll", PayrollSchema);

const PayrollDetailSchema = new Schema(
  {
    companyId: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    payrollId: {
      type: String, // ID referensi ke Payroll
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
    },
    networkChainId: {
      type: Number,
      required: true,
    },
    txHash: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    bankAccountName: {
      type: String,
      required: true,
    },
    bankAccountNumberHash: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    bankCode: {
      type: String,
      required: true,
    },
    status: {
      type: String, // "pending", "burned", "redeemed"
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PayrollDetailModel = mongoose.model(
  "PayrollDetail",
  PayrollDetailSchema
);
