import mongoose, { Schema } from "mongoose";

const EmployeeDataSchema = new Schema(
  {
    // Company mana yang punya employee ini,

    id: {
      type: String,
      required: true,
    },
    companyId: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    bankCode: {
      type: Number,
      required: true,
    },
    bankAccount: {
      type: Number,
      required: true,
    },
    bankAccountName: {
      type: String,
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
    amountTransfer: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    localCurrency: {
      type: String,
      required: true,
    },
    groupId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export const EmployeeModel = mongoose.model("EmployeeData", EmployeeDataSchema);

const GroupOfEmployeeSchema = new Schema(
  {
    companyId: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    nameOfGroup: {
      type: String,
      required: true,
    },
    groupId: {
      type: String,
      required: true,
    },
    employees: [
      {
        // id untuk employees ini bakal udah auto ke generate
        // karena sebelum bisa mbuat group, harus buat data karyawannya
        // masing masing terlebih dahulu
        id: {
          type: Schema.Types.ObjectId,
          ref: "EmployeeData",
          required: false,
        },
        name: {
          type: String,
          required: false,
        },
      },
    ],
    totalRecipients: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export const GroupOfEmployeeData = mongoose.model(
  "GroupOfEmployeeData",
  GroupOfEmployeeSchema
);
