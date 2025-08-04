"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { ArrowLeft } from "lucide-react";
import type { Invoice } from "@/types/invoice";
import { useState, useEffect } from "react";
import { loadInvoiceData } from "@/api/transactionService";
export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.invoiceId as string;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [currentRecipientIndex, setCurrentRecipientIndex] = useState(0);
  
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        setError(null);
        const invoiceData = await loadInvoiceData({ txId: invoiceId });
        // const invoiceData = await invoiceApi.getById(invoiceId)
        console.log(invoiceData.data);
        setInvoice(invoiceData.data??null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load invoice");
        console.error("Error fetching invoice: ", err);
        setInvoice(null)
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  const handleBackToDashboard = () => {
    router.push("/");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // const handlePrevRecipient = () => {
  //   if(invoice && currentRecipientIndex > 0){
  //     setCurrentRecipientIndex(currentRecipientIndex - 1)
  //   }
  // }

  // const handleNextRecipient = () => {
  //   if(invoice && currentRecipientIndex < invoice.recipients.length-1){
  //     setCurrentRecipientIndex(currentRecipientIndex + 1)
  //   }
  // }

  if (loading) {
    return (
      <div className="min-h-[75vh] bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-300">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-[75vh] bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <ErrorMessage
            message={error || "Invoice not found"}
            onRetry={handleRetry}
            className="mb-4"
          />
          <Button
            onClick={handleBackToDashboard}
            variant="outline"
            className="w-full bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  console.log(invoice);
  console.log(invoice.recipient);
  // if (!invoice.recipients) {
  //   return (
  //       <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
  //         <div className="text-center">
  //           <h2 className="text-xl font-bold mb-4">Invoice Loaded</h2>
  //           <p className="text-gray-400 mb-6">This invoice does not contain any recipients.</p>
  //           <Button onClick={handleBackToDashboard} variant="outline" className="bg-transparent">
  //             <ArrowLeft className="w-4 h-4 mr-2" />
  //             Back to Dashboard
  //           </Button>
  //         </div>
  //       </div>
  //     );
  // }

  // const currentRecipient = invoice.recipients[currentRecipientIndex]
  // const description = `Transfer to ${invoice.templateName}`;

  return (
    <div className="min-h-[75vh] bg-black px-4 sm:px-6 py-8 sm:py-10 text-white">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 max-w-6xl mx-auto">
        {/* Left Card */}
        <div className="bg-[#1C1C1C] rounded-2xl px-6 sm:px-8 py-7 sm:py-9 w-full lg:w-[40%]">
          <div className="flex justify-between items-center mb-4">
            <Image src="/logonusa2.png" alt="logo" width={120} height={50} />
            <button
              onClick={handleBackToDashboard}
              className="bg-[#373737] text-xs sm:text-sm px-4 sm:px-6 py-1 rounded-full"
            >
              Dashboard
            </button>
          </div>
          <h3 className="font-bold text-base sm:text-lg mb-5">Beneficiary</h3>
          <div className="flex items-center gap-4 mb-8">
            <Image
  src="/profile-placeholder.png"
  alt="Profile Picture"
  width={56}
  height={56}
  className="rounded-full object-cover"
/>
            <p className="font-semibold text-sm">{invoice.recipient}</p>

            <span className="ml-auto bg-[#373737] text-[10px] sm:text-xs px-6 sm:px-8 py-1.5 rounded-full">
              {invoice.currency}
            </span>
          </div>

          {[
            { label: "Currency", value: invoice.currency },
            { label: "Local Currency", value: invoice.localCurrency },
            { label: "Bank", value: invoice.bankAccountName },
            { label: "Bank Account", value: invoice.bankAccount },
          ].map(({ label, value }) => (
            <div key={label} className="mb-2">
              <label className="text-white text-[10px] sm:text-xs mb-1 block">
                {label}
              </label>
              <div className="modal-input bg-[#2a2a2a] text-white text-xs rounded-full px-5 py-1.5 w-full cursor-default">
                {value}
              </div>
            </div>
          ))}

          <div className="mt-10">
            <div className="flex justify-between text-[11px] sm:text-xs bg-white rounded-full px-4 py-1.5">
              {/* <button 
              onClick={handlePrevRecipient} 
              disabled={currentRecipientIndex === 0} 
              className={`text-black rounded-full ${currentRecipientIndex === 0? "opacity-50 cursor-not-allowed" : "hover:opacity-70"}`}
            >
              &larr; Prev
            </button> */}
              {/* <span className="text-black">({currentRecipientIndex + 1} / {invoice.recipients.length})</span> */}
              {/* <button 
              onClick={handleNextRecipient}
              disabled={currentRecipientIndex === invoice.recipients.length - 1}
              className={`text-black rounded-full ${currentRecipientIndex === invoice.recipients.length -1? "opacity-50 cursor-not-allowed" : "hover:opacity-70"}`}>Next &rarr;</button> */}
            </div>
          </div>
        </div>

        {/* Right Card */}
        <div className="bg-[#2A2A2A] rounded-2xl px-4 sm:px-6 py-4 shadow-xl w-full lg:w-[60%]">
          {/* Header */}
          <div className="flex justify-between py-2">
            <Image src="/logonusa2.png" alt="logo" width={100} height={40} />
            <div className="flex gap-6 text-[10px] items-center text-gray-400">
              {[
                { label: "Invoice Number", value: invoice.txId },
                {
                  label: "Issued",
                  value: new Date(invoice.createdAt).toLocaleDateString(),
                },
                {
                  label: "Due Date",
                  value: new Date(
                    invoice.completedAt || invoice.createdAt
                  ).toLocaleDateString(),
                },
              ].map(({ label, value }) => (
                <p key={label} className="flex flex-col">
                  {label}
                  <span className="text-white">{value}</span>
                </p>
              ))}
            </div>
          </div>

          {/* From & To */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {[
              {
                title: "↑ From",
                name: "NusaPay",
                label: "Currency",
                value: "USD",
              },
              {
                title: "↓ To",
                name: invoice.recipient,
                label: "Local Currency",
                value: invoice.localCurrency,
              },
              // {
              //   title: "↓ To",
              //   name: invoice.recipient,
              //   label: "Local Currency",
              // },
            ].map(({ title, name, label, value }) => (
              <div
                key={title}
                className="w-full sm:w-1/2 bg-[#1C1C1C] rounded-2xl px-4 py-4"
              >
                <p className="text-[10px] sm:text-xs bg-[#2A2A2A] rounded-full px-4 py-1 w-fit text-white">
                  {title}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <Image
                    src="/profile-placeholder.png"
                    alt="Profile Picture"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">{name}</p>
                    <p className="text-[10px] font-semibold text-[#818181]">
                      Indonesia
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <label className="text-white text-xs mb-1 block">
                    {label}
                  </label>
                  <div className="modal-input bg-[#2A2A2A] text-white text-xs rounded-full px-6 py-1.5 w-full cursor-default">
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESCRIPTION SECTION */}
<div className="bg-[#1C1C1C] rounded-2xl px-8 py-6 space-y-4 mt-5">
  {/* Bank */}
  <div>
    <p className="lg:text-[10px] text-xs font-bold border-b border-white/30 text-gray-400 pb-1 mb-2">Bank</p>
    <div className="flex items-center gap-2 border-b border-white/30 pb-2 px-0">
      <span className="text-xs text-gray-400 font-bold">•</span>
      <p className="text-white font-semibold text-xs">Bank Central Asia (BCA)</p>
    </div>
  </div>

  {/* Description + Amount */}
  <div>
    <div className="flex justify-between text-[10px] sm:text-xs font-semibold text-gray-400 border-b border-white/30 pb-1 px-0">
      <p>Description</p>
      <p>Amount</p>
    </div>
    <div className="flex justify-between items-center mt-2 text-xs font-medium border-b border-white/30 pb-2 px-0">
      <div className="flex items-center gap-2 text-white">
        {/* INI INDIKATOR STATUS TITIT */}
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <p>Recipient salaries</p>
      </div>
      <p className="text-white">{Number(invoice.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
    </div>
    <p className="text-xs pt-2 font-bold text-white">
      Status: <span className="text-white/70">On Process</span>
    </p>
  </div>

  {/*Total */}
  <div className="flex justify-end items-center px-0">
  <div className="flex items-center gap-2">
    <p className="text-white font-bold text-lg">Total:</p>
    <p className="text-white font-semibold text-lg">
      {Number(invoice.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
    </p>
  </div>
</div>

  {/* Powered by IDRX */}
  <div className="flex justify-start px-0">
    <div className="bg-[#2A2A2A] text-white text-[11px] px-4 py-1 rounded-full font-semibold">
      Powered by <span className="text-white font-bold">IDRX</span>
    </div>
  </div>
</div>
</div>
      </div>
    </div>
  );
}
