"use client";

import { Building2, User, Trash2 } from "lucide-react";
import type { Employee } from "@/types/recipient";
/**
 * Recipient Card Component
 *
 * Fungsi:
 * - Versii ringkas infone penerima
 * - Menampilkan nama, bank, account, dan amount
 * - Tombol delete untuk menghapus recipient
 */
interface RecipientCardProps {
  employee: Employee;
  onRemove: () => void;
  onClick: () => void;
}

export default function RecipientCard({
  employee,
  onRemove,
  onClick,
}: RecipientCardProps) {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };
  return (
    <div
      onClick={onClick}
      className=" backdrop-blur-sm rounded-2xl p-3 border border-white hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10 group relative"
    >
      {/* Currency Badge */}
      <div className="absolute top-4 right-4">
        <span className="bg-cyan-500 text-black px-4 py-1 rounded-full text-sm font-extrabold">
          {employee.localCurrency}
        </span>
      </div>

      {/* Delete Button */}
      <button
        onClick={handleDeleteClick}
        className="absolute top-4 right-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 hover:bg-red-500/20 rounded-lg"
      >
        <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
      </button>

      {/* Profile Section */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {employee.name.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-lg text-white group-hover:text-cyan-400 transition-colors duration-300">
            {employee.name}
          </h3>
        </div>
      </div>

      {/* Bank Information */}
      <div className="space-y-3 mx-2">
        <div className="flex items-center font-medium space-x-2 text-white">
          <Building2 className="w-4 h-4" />
          <span className="text-sm">{employee.bankAccountName}</span>
        </div>

        <div className="flex items-center space-x-2 text-gray-400">
          <User className="w-4 h-4" />
          <span className="text-sm">{employee.bankAccount}</span>
        </div>

        {/* Amount Section */}
        <div className="pt-2 border-t border-gray-700/50">
          <p className="justify-end flex text-cyan-400 font-bold text-xl">
            {employee.currency} {employee.amountTransfer.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
