"use client";

import { Plus } from "lucide-react";
import type { Employee } from "@/types/recipient";
import RecipientCard from "./RecipientCard";

/**
 * Recipient Grid Component
 *
 * Fungsi:
 * - Menampilkan grid responsive untuk recipient cards
 * - Mengatur layout dari 1-4 kolom berdasarkan screen size
 * - Menampilkan card "Add More" untuk menambah recipient baru
 */
interface RecipientGridProps {
  employees: Employee[];
  onAddClick: () => void;
  onRemoveRecipient: (id: string) => void;
  onRecipientClick: (employee: Employee) => void;
}

export default function RecipientGrid({
  employees,
  onAddClick,
  onRemoveRecipient,
  onRecipientClick,
}: RecipientGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {/* Render semua recipient cards */}
      {employees.map((employee) => {
        console.log("Rendering employee with id:", employee.id);

        return (
          <RecipientCard
            key={employee.id}
            employee={employee}
            onRemove={() => onRemoveRecipient(employee.id)}
            onClick={() => onRecipientClick(employee)}
          />
        );
      })}

      <AddMoreCard onClick={onAddClick} />
    </div>
  );
}

/**
 * Add More Card Component
 *
 * Fungsi:
 * - Card khusus untuk trigger modal add beneficiary
 */
interface AddMoreCardProps {
  onClick: () => void;
}

function AddMoreCard({ onClick }: AddMoreCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border-2 border-dashed border-white hover:border-cyan-400 transition-all duration-300 flex flex-col items-center justify-center space-y-3 min-h-45 group hover:bg-gray-800/50"
    >
      <div className="w-12 h-12 rounded-full  bg-gray-700/50 flex items-center justify-center group-hover:bg-cyan-400/20 transition-all duration-300">
        <Plus className="w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
      </div>
      <span className="text-gray-400 group-hover:text-cyan-400 transition-colors duration-300 font-medium">
        Add More
      </span>
    </button>
  );
}
