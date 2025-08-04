import mongoose, { Schema, Document } from "mongoose";

const TransactionRecordSchema = new Schema(
  {
    txId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    companyId: {
      type: String,
      required: true,
    },
    templateName: {
      type: String,
      required: true,
    },
    txHash: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    API_KEY: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "PENDING",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const TransactionRecordModel = mongoose.model(
  "TransactionRecord",
  TransactionRecordSchema
);
