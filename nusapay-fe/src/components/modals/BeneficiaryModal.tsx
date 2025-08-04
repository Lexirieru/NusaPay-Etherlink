"use client";

import { useState, useEffect } from "react";
import type { Employee } from "@/types/recipient";
import { Button } from "../ui/button";
import FormField from "./FormField";
import ModalOverlay from "./ModalOverlay";
// import { addOrUpdateEmployeeData } from "@/api/employeeService";
import { useTemplate } from "@/lib/TemplateContext";
import { useUser } from "@/lib/UserContext";
import PriceFeed from "../transfer/PriceFeed";
import CurrencySelector from "../transfer/CurrencySelector";
/**
 * Add Beneficiary Modal Component
 * Fungsi:
 * - Modal buat nambah penerima
 * - utawa pas dipencet +
 */

interface BeneficiaryModalProps {
  employee?: Employee | null;
  onClose: () => void;
  onSave: (employee: Employee) => void;
}

// interface BankInfo {
//   code: string;
//   name: string;
// }

export default function BeneficiaryModal({
  employee = null,
  onClose,
  onSave,
}: BeneficiaryModalProps) {
  const isEditMode = employee !== null;
  const submitButtonText = isEditMode ? "Edit" : "Save";
  //state default buat form
  const [formData, setFormData] = useState({
    name: "",
    currency: "",
    localCurrency: "",
    bankAccountName: "",
    bankAccount: "",
    amountTransfer: "",
  });
  const { user } = useUser();
  const { currentTemplateId } = useTemplate();
  const modalTitle = isEditMode ? `${formData.name}` : "Add Beneficiary";

  // const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  // const [supportedBanks, setSupportedBanks] = useState<BankInfo[]>([]);
  // const [bankValidation, setBankValidation] = useState<{
  //   isValid: boolean;
  //   accountName?: String;
  //   isValidating: boolean;
  // }>({
  //   isValid: false,
  //   isValidating: false,
  // });
  useEffect(() => {
    if (isEditMode && employee) {
      setFormData({
        name: employee.name,
        currency: employee.currency,
        localCurrency: employee.localCurrency,
        bankAccountName: employee.bankAccountName,
        bankAccount: employee.bankAccount,
        amountTransfer: employee.amountTransfer.toString(),
      });
    } else {
      setFormData({
        name: "",
        currency: "USDC",
        localCurrency: "IDR",
        bankAccountName: "",
        bankAccount: "",
        amountTransfer: "",
      });
    }
  }, [isEditMode, employee]);

  //Handler buat update formfield
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handletExchangeRateUpdate = (rate: number) => {
    setExchangeRate(rate);
    console.log(exchangeRate)
  };

  //Hander buat submit + validasi input + save
  const handleSubmit = async () => {
    //validasi
    if (
      !formData.name ||
      !formData.bankAccountName ||
      !formData.bankAccount ||
      !formData.amountTransfer
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (!user || !user._id) {
      alert("User data is not available. Please try again later.");
      return;
    }
    if (!currentTemplateId) {
      alert("No active template selected. Please select a template first.");
      return;
    }

    console.log(currentTemplateId);

    const commonPayload = {
      id: crypto.randomUUID(),
      companyId: user.companyId, // TODO: Ambil dari cookie/session nanti
      companyName: user.companyName!, // TODO: Ambil dari auth
      name: formData.name,
      bankCode: "014", // TODO: Bisa pakai enum/mapping dari nama bank
      bankAccountName: formData.bankAccountName,
      bankAccount: formData.bankAccount,
      walletAddress: "0xe8720c942F114Eac371746C6eCfAcf5F717164CB", // TODO
      networkChainId: 4202,
      amountTransfer: Number.parseFloat(formData.amountTransfer),
      currency: formData.currency,
      localCurrency: formData.localCurrency,
      groupId: currentTemplateId, // harusnya diganti dengan bisa menyesuaikan skrg lagi ada di template apa
    };

    if (isEditMode && employee) {
      const updatedEmployee = {
        ...commonPayload,
        id: employee.id,
      };
      onSave(updatedEmployee);
    } else {
      onSave(commonPayload);
      // await addOrUpdateEmployeeData(commonPayload);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="relative bg-slate-800/50 border
            border-white/20 rounded-2xl p-8 w-full max-w-md backdrop-blur-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-2xl font-bold text-white">{modalTitle}</h2>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {employee === null && (
            <FormField
              label="Full Name"
              value={formData.name}
              onChange={(value) => handleInputChange("name", value)}
              placeholder="Type here"
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <CurrencySelector
              label="Currency"
              value={formData.currency}
              onChange={(value) => handleInputChange("currency", value)}
              currencyType="crypto"
              placeholder="Select currency"
            />
            <CurrencySelector
              label="Local Currency"
              value={formData.localCurrency}
              onChange={(value) => handleInputChange("localCurrency", value)}
              currencyType="fiat"
              placeholder="Select currency"
            />
          </div>

          {/* <FormField
            label="Currency"
            value={formData.currency}
            onChange={(value) => handleInputChange("currency", value)}
            placeholder="Type here"
          />
          <FormField
            label="Local Currency"
            value={formData.localCurrency}
            onChange={(value) => handleInputChange("localCurrency", value)}
            placeholder="Type here"
          /> */}
          <FormField
            label="Bank"
            value={formData.bankAccountName}
            onChange={(value) => handleInputChange("bankAccountName", value)}
            placeholder="Type here"
          />
          <FormField
            label="Bank Account"
            value={formData.bankAccount}
            onChange={(value) => handleInputChange("bankAccount", value)}
            placeholder="Type here"
          />
          <FormField
            label="Amount"
            value={formData.amountTransfer}
            onChange={(value) => handleInputChange("amountTransfer", value)}
            placeholder="Type here"
          />

          {/* Price feed */}
          <PriceFeed
            fromCurrency={formData.currency}
            toCurrency={formData.localCurrency}
            amount={parseFloat(formData.amountTransfer) || 0}
            onRateUpdate={handletExchangeRateUpdate}
          ></PriceFeed>

          <div className=" rounded-lg justify-end flex ">
            <p className="text-gray-300 text-sm text-center">
              Display Price Feed Here
            </p>
          </div>

          <div className="flex space-x-3">
            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className={`${
                isEditMode ? "flex-1" : "w-full"
              } bg-cyan-500 hover:bg-cyan-400 py-3 rounded-lg`}
            >
              {submitButtonText}
            </Button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}
