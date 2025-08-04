import { Request, Response } from "express";
import { EmployeeModel, GroupOfEmployeeData } from "../models/employeeModel"; // Pastikan path-nya benar
import { CompanyDataModel, CompanyStatsModel } from "../models/companyModel";
import mongoose from "mongoose";

// untuk form ngemasukkin companyName, nyambungin wallet dan networkchainnya setelah berhasil login pake googleoauth20
export async function addOrUpdateCompanyData(req: Request, res: Response) {
  const { companyId, companyName, walletAddress, networkChainId } = req.body;

  try {
    const companyData = await CompanyDataModel.findByIdAndUpdate(
      companyId,
      {
        companyName,
        walletAddress,
        networkChainId,
      },
      { new: true }
    );

    if (!companyData) {
      res.status(404).json({
        message: "Company not found",
      });
      return;
    }

    res.status(201).json({
      message: "Company data successfully edited",
      payroll: companyData,
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: "Error editing company data",
      error: err.message,
    });
    return;
  }
}

export async function addGroupName(req: Request, res: Response) {
  const { companyId, companyName, nameOfGroup, groupId } = req.body;
  console.log(companyId)
  try {
    // minta FE buat ngirimin employeesNamenya juga (ketimbang backend harus ngefind satu satu name dari Id)
    const newGroupOfEmployee = new GroupOfEmployeeData({
      companyId,
      companyName,
      nameOfGroup,
      groupId,
    });

    const saved = await newGroupOfEmployee.save();
    res.status(201).json({
      message: "New Groupsuccessfully created",
      payroll: saved,
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: "Error adding new group",
      error: err.message,
    });
    return;
  }
}

export async function loadGroupName(req: Request, res: Response) {
  const { companyId } = req.body;

  try {
    const loadAllGroupName = await GroupOfEmployeeData.find({
      companyId,
    })
      .sort({ timestamp: -1 }) // descending (terbaru di atas)
      .lean(); // supaya hasilnya plain JS object dan lebih cepat

    res.status(201).json({
      message: "Group name successfully sended",
      data: loadAllGroupName,
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: "Error sending group of employee",
      error: err.message,
    });
    return;
  }
}
export async function addOrUpdateEmployeeData(req: Request, res: Response) {
  const {
    id,
    companyId,
    companyName,
    name,
    bankCode,
    bankAccount,
    bankAccountName,
    walletAddress,
    networkChainId,
    amountTransfer,
    currency,
    localCurrency,
    groupId,
  } = req.body;

  try {
    // Cek apakah employee dengan id tersebut sudah ada
    const existingEmployee = await EmployeeModel.findOne({ id });

    let employeeData;

    if (existingEmployee) {
      // Jika ada, lakukan update
      employeeData = await EmployeeModel.findOneAndUpdate(
        { id },
        {
          companyId,
          companyName,
          name,
          bankCode,
          bankAccount,
          bankAccountName,
          walletAddress,
          networkChainId,
          amountTransfer,
          currency,
          localCurrency,
          groupId,
        },
        { new: true }
      );
    } else {
      // Jika tidak ada, buat data baru
      const newEmployee = new EmployeeModel({
        id, // tetap gunakan id dari FE
        companyId,
        companyName,
        name,
        bankCode,
        bankAccount,
        bankAccountName,
        walletAddress,
        networkChainId,
        amountTransfer,
        currency,
        localCurrency,
        groupId,
      });

      employeeData = await newEmployee.save();
    }

    res.status(201).json({
      message: existingEmployee
        ? "Employee data successfully updated"
        : "Employee data successfully added",
      employee: employeeData,
    });
  } catch (err: any) {
    console.error("Error in addOrUpdateEmployeeData:", err.message);
    res.status(500).json({
      message: "Error saving employee data",
      error: err.message,
    });
  }
}

export async function loadEmployeeDataFromGroup(req: Request, res: Response) {
  const { groupId } = req.body;

  try {
    const latestGroupOfEmployee = await EmployeeModel.find({
      groupId,
    })
      .sort({ timestamp: -1 }) // descending (terbaru di atas)
      .lean(); // supaya hasilnya plain JS object dan lebih cepat
    console.log();
    res.status(201).json({
      message: "Group of employee successfully sended",
      data: latestGroupOfEmployee,
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: "Error sending group of employee",
      error: err.message,
    });
    return;
  }
}

// nek ada yang di delete ntar masuknya juga ke handler editEmployeeData ini
export async function deleteEmployeeDataFromGroup(req: Request, res: Response) {
  const { id } = req.body;
  const _id = new mongoose.Types.ObjectId(id);
  try {
    const employeeData = await EmployeeModel.findByIdAndDelete(_id);

    if (!employeeData) {
      res.status(404).json({
        message: "Employee not found",
      });
      return;
    }

    res.status(201).json({
      message: "Employee data successfully deleted",
      payroll: employeeData,
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: "Error deleting employee data",
      error: err.message,
    });
    return;
  }
}

// export async function loadGroupOfEmployee(req: Request, res: Response) {
//   const { companyId } = req.body;

//   try {
//     const latestGroupOfEmployee = await GroupOfEmployeeData.find({
//       companyId,
//     })
//       .sort({ timestamp: -1 }) // descending (terbaru di atas)
//       .lean(); // supaya hasilnya plain JS object dan lebih cepat

//     res.status(201).json({
//       message: "Group of employee successfully sended",
//       data: latestGroupOfEmployee,
//     });
//   } catch (err: any) {
//     res.status(500).json({
//       message: "Error sending group of employee",
//       error: err.message,
//     });
//   }
// }

// export async function checkWalletAddressStatus(req: Request, res: Response) {
//   const { companyId } = req.body;
//   try {
//     const companyData = await CompanyDataModel.findOne({ companyId });
//     if (!companyData) {
//       res.status(404).json({
//         message: "Company data not found",
//         data: false,
//       });
//     }

//     if (!companyData!.walletAddress) {
//       res.status(200).json({
//         message: "Wallet address not found",
//         data: false,
//       });
//     }

//     res.status(200).json({
//       message: "Wallet address found",
//       data: true,
//     });
//   } catch (err: any) {
//     res.status(500).json({
//       message: "Error checking wallet address status",
//       error: err.message,
//     });
//   }
// }

export async function addOrUpdateCompanyStats(req: Request, res: Response) {
  const {
    companyId,
    totalPayrollExecuted,
    totalBurnExecuted,
    totalRedeemed,
    totalEmployeeRegistered,
    totalGroups,
    totalIDRXBurned,
    totalIDRXRedeemed,
    averageEmployeesPerGroup,
  } = req.body;

  try {
    // Cek apakah stats sudah ada untuk companyId tersebut
    let stats = await CompanyStatsModel.findOne({ companyId });

    if (!stats) {
      // Buat baru jika belum ada
      stats = new CompanyStatsModel({
        companyId,
        totalPayrollExecuted: totalPayrollExecuted || 0,
        totalBurnExecuted: totalBurnExecuted || 0,
        totalRedeemed: totalRedeemed || 0,
        totalEmployeeRegistered: totalEmployeeRegistered || 0,
        totalGroups: totalGroups || 0,
        totalIDRXBurned: totalIDRXBurned || 0,
        totalIDRXRedeemed: totalIDRXRedeemed || 0,
        averageEmployeesPerGroup: averageEmployeesPerGroup || 0,
      });
    } else {
      // Update data yang dikirim (jika ada)
      if (typeof totalPayrollExecuted === "number") {
        stats.totalPayrollExecuted =
          (stats.totalPayrollExecuted || 0) + totalPayrollExecuted;
      }

      if (typeof totalBurnExecuted === "number") {
        stats.totalBurnExecuted =
          (stats.totalBurnExecuted || 0) + totalBurnExecuted;
      }

      if (typeof totalRedeemed === "number") {
        stats.totalRedeemed = (stats.totalRedeemed || 0) + totalRedeemed;
      }

      if (typeof totalEmployeeRegistered === "number") {
        stats.totalEmployeeRegistered =
          (stats.totalEmployeeRegistered || 0) + totalEmployeeRegistered;
      }

      if (typeof totalGroups === "number") {
        stats.totalGroups = (stats.totalGroups || 0) + totalGroups;
      }

      if (typeof totalIDRXBurned === "number") {
        stats.totalIDRXBurned = (stats.totalIDRXBurned || 0) + totalIDRXBurned;
      }

      if (typeof totalIDRXRedeemed === "number") {
        stats.totalIDRXRedeemed =
          (stats.totalIDRXRedeemed || 0) + totalIDRXRedeemed;
      }

      if (typeof averageEmployeesPerGroup === "number") {
        stats.averageEmployeesPerGroup = averageEmployeesPerGroup;
      }
    }

    await stats.save();

    res.status(200).json({
      message: "Company stats successfully updated",
      stats,
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: "Error updating company stats",
      error: err.message,
    });
    return;
  }
}
