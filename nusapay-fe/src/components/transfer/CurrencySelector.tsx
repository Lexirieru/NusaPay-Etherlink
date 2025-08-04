// src/components/CurrencySelector.tsx

"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
}

// Daftar currency kripto yang didukung
const SUPPORTED_CRYPTO_CURRENCIES: Currency[] = [
  { code: "USDC", name: "USD Coin", symbol: "USDC", flag: "🔵" },
  { code: "USDT", name: "Tether", symbol: "USDT", flag: "🟢" },
  { code: "DAI", name: "Dai", symbol: "DAI", flag: "🟡" },
  { code: "ETH", name: "Ethereum", symbol: "ETH", flag: "Ξ" },
  { code: "MATIC", name: "Polygon", symbol: "MATIC", flag: "🔷" },
  { code: "BNB", name: "Binance Coin", symbol: "BNB", flag: "🔶" },
  { code: "AVAX", name: "Avalanche", symbol: "AVAX", flag: "🔺" },
  { code: "LINK", name: "Chainlink", symbol: "LINK", flag: "🔗" },
];

// ✅ BARU: Daftar mata uang fiat untuk tujuan transfer
const FIAT_CURRENCIES: Currency[] = [
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
];

interface CurrencySelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  // ✅ BARU: Prop untuk memilih jenis daftar mata uang ('crypto' atau 'fiat')
  currencyType: "crypto" | "fiat";
  placeholder?: string;
  disabled?: boolean;
}

export default function CurrencySelector({
  label,
  value,
  onChange,
  currencyType,
  placeholder = "Select a currency",
  disabled = false,
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ DIPERBARUI: Pilih daftar mata uang berdasarkan prop `currencyType`
  const currencyList =
    currencyType === "crypto" ? SUPPORTED_CRYPTO_CURRENCIES : FIAT_CURRENCIES;

  const [filteredCurrencies, setFilteredCurrencies] =
    useState<Currency[]>(currencyList);

  useEffect(() => {
    const filtered = currencyList.filter(
      (currency) =>
        currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        currency.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCurrencies(filtered);
  }, [searchTerm, currencyList]);

  const selectedCurrency = currencyList.find(
    (currency) => currency.code === value
  );

  const handleSelect = (currencyCode: string) => {
    onChange(currencyCode);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Sisa dari komponen (JSX) tidak berubah, hanya logikanya saja yang diperbarui
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-3 
          bg-slate-700/50 border border-white/10 rounded-lg text-white
          hover:bg-slate-700/70 transition-colors duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${isOpen ? "ring-2 ring-cyan-500/50" : ""}
        `}
      >
        <div className="flex items-center space-x-3">
          {selectedCurrency ? (
            <>
              <span className="text-lg">{selectedCurrency.flag}</span>
              <div className="text-left">
                <div className="font-medium">{selectedCurrency.code}</div>
                <div className="text-sm text-gray-400">
                  {selectedCurrency.name}
                </div>
              </div>
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="absolute z-50 w-full mt-2 bg-slate-800 border border-white/20 
            rounded-lg shadow-xl max-h-80 overflow-hidden flex flex-col"
          >
            <div className="p-3 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search token..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto">
              {filteredCurrencies.length > 0 ? (
                filteredCurrencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => handleSelect(currency.code)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-700/50 transition-colors duration-150 text-left
                      ${
                        value === currency.code
                          ? "bg-cyan-500/20 text-cyan-300"
                          : "text-white"
                      }`}
                  >
                    <span className="text-lg">{currency.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium">{currency.code}</div>
                      <div className="text-sm text-gray-400">
                        {currency.name}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-400">
                  No currencies found
                </div>
              )}
            </div>
          </div>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
}
