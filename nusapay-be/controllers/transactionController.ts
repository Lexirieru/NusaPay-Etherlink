import { Request, Response, response } from "express";
import { PayrollModel, PayrollDetailModel } from "../models/payrollModel"; // Pastikan path-nya benar
import { TransactionRecordModel } from "../models/transactionRecordModel";
import mongoose from "mongoose";
import axios from "axios";
import { EmployeeModel } from "../models/employeeModel";

// dari sc pas nge emitnya harus ada data data ini sehingga
// ntar mbuat invoicenya ga dari fe tapi dari listening eventnya SC
export async function addInvoiceData({
  txId,
  userId,
  companyId,
  templateName,
  txHash,
  amount,
  recipient,
  API_KEY,
}: {
  txId: string;
  userId: string;
  companyId: string;
  templateName: string;
  recipient: string;
  txHash: string;
  amount: number;
  API_KEY: string;
}) {
  const newTx = new TransactionRecordModel({
    txId,
    userId,
    companyId,
    templateName,
    recipient,
    txHash,
    amount,
    status: "PENDING",
    API_KEY,
  });

  await newTx.save();
  console.log(`✅ Transaction recorded to DB: ${txHash}`);
}

async function waitUntilCompleted(
  txHash: string,
  API_KEY: string,
  maxRetries = 10,
  delayMs = 40000
): Promise<string> {
  let attempt = 0;
  while (attempt < maxRetries) {
    const status = await loadTransactionStatusData(txHash, API_KEY);
    if (status === "SUCCESS") return status;

    attempt++;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return "PENDING"; // or return last known status if needed
}

export async function loadInvoiceData(req: Request, res: Response) {
  const { txId } = req.body;

  try {
    const invoice = await TransactionRecordModel.findOne({ txId });

    if (!invoice) {
      res.status(404).json({ message: "Invoice not found" });
      return;
    } 
    else {
      const finalStatus = await waitUntilCompleted(
        invoice.txHash,
        invoice.API_KEY
      );
      invoice.status = finalStatus;
      await invoice.save();
      console.log(invoice.userId)
      const userId = new mongoose.Types.ObjectId(invoice.userId)
      const employeeData = await EmployeeModel.findById(userId);

      if (!employeeData) {
        res.status(404).json({ message: "Can't find data for this person" });
        return;
      } else {
        // Convert Mongoose document ke plain object dan spread ke response
        const plainInvoice = invoice.toObject();
        const dataToSend = {
          ...plainInvoice,
          currency: employeeData.currency,
          localCurrency: employeeData.localCurrency,
          bankAccountName: employeeData.bankAccountName,
          bankAccount: employeeData.bankAccount,
        };

        res.status(200).json({
          message: "Successfully fetched invoice with updated status",
          data: dataToSend,
        });
        return;
      }
    }
  } catch (err: any) {
    res.status(500).json({
      message: "Error fetching data",
      error: err.message,
    });
    return;
  }
}
// buat controller untuk ngasih akses ke FE biar bisa akses status berdasarkan txIdnya
export async function loadTransactionStatusData(
  txHash: string,
  API_KEY: string
) {
  try {
    const response = await axios.get(
      `https://idrx.co/api/transaction/user-transaction-history?transactionType=DEPOSIT_REDEEM&txHash=${txHash}&page=1&take=1`,
      {
        headers: {
          "Content-Type": "application/json",
          "idrx-api-key": API_KEY,
        },
      }
    );
    if (!response.data) {
      console.log(response.data);
      return response.data;
    } else {
      console.log(response);
      console.log("[API Response]", response.data);
      console.log(response.data.records[0].status);
      return response.data.records[0].status;
    }
  } catch (err: any) {
    console.error("[Failed to call redeem-request]", err);
    // return err.message;
  }
}

export async function addPayrollData(req: Request, res: Response) {
  const {
    companyId,
    companyName,
    companyWalletAddress,
    status,
    totalAmount,
    totalRecipients,
  } = req.body;

  try {
    const newPayroll = new PayrollModel({
      companyId,
      companyName,
      companyWalletAddress,
      status,
      totalAmount,
      totalRecipients,
    });

    const saved = await newPayroll.save();
    res.status(201).json({
      message: "Payroll data successfully added",
      payroll: saved,
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: "Error adding payroll data",
      error: err.message,
    });
    return;
  }
}

export async function loadPayrollData(req: Request, res: Response) {
  const { companyId } = req.body;
  try {
    // Ambil 5 data terbaru berdasarkan timestamp (atau bisa juga pakai _id)
    const latestPayrolls = await PayrollModel.find({ companyId })
      .sort({ timestamp: -1 }) // descending (terbaru di atas)
      .limit(5)
      .lean(); // supaya hasilnya plain JS object dan lebih cepat

    res.status(200).json({
      message: "Successfully fetched latest payrolls",
      data: latestPayrolls,
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: "Error fetching data",
      error: err.message,
    });
    return;
  }
}

export async function addPayrollDetailsData(req: Request, res: Response) {
  const {
    companyId,
    companyName,
    // payrollId ambil dari _id nya PayrollData
    payrollId,
    walletAddress,
    networkChainId,
    txHash,
    amount,
    bankAccountName,
    bankAccountNumberHash,
    bankName,
    bankCode,
    status,
  } = req.body;

  try {
    const newPayrollDetail = new PayrollDetailModel({
      companyId,
      companyName,
      payrollId,
      walletAddress,
      networkChainId,
      txHash,
      amount,
      bankAccountName,
      bankAccountNumberHash,
      bankName,
      bankCode,
      status,
    });

    const saved = await newPayrollDetail.save();
    res.status(201).json({
      message: `Payroll details data for ${bankAccountName} has successfully added`,
      payroll: saved,
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: `Error adding payroll details data for ${bankAccountName}`,
      error: err.message,
    });
    return;
  }
}

export async function loadPayrollDetailsData(req: Request, res: Response) {
  // Loadnya berdasarkan id unique yang di generate sama mongodb
  const { _id } = req.body;

  try {
    const ObjectId = new mongoose.Types.ObjectId(_id); // konversi ke ObjectId
    // Ambil 5 data terbaru berdasarkan timestamp (atau bisa juga pakai _id)
    const latestPayrolls = await PayrollDetailModel.find({
      payrollId: ObjectId,
    })
      .sort({ timestamp: -1 }) // descending (terbaru di atas)
      .lean(); // supaya hasilnya plain JS object dan lebih cepat

    res.status(200).json({
      message: "Successfully fetched payrolls details data",
      data: latestPayrolls,
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: "Error fetching data",
      error: err.message,
    });
    return;
  }
}
