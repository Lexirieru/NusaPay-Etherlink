// PriceFeed.tsx
"use client";

import { useState, useEffect } from "react";
import { RefreshCw, TrendingUp, Clock } from "lucide-react";

import { type PriceFeedData } from "@/lib/smartContract";
import { getPriceFeedFromBE } from "@/api/transactionService";

interface PriceFeedProps {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  onRateUpdate?: (rate: number) => void;
}

export default function PriceFeed({
  fromCurrency,
  toCurrency,
  amount,
  onRateUpdate,
}: PriceFeedProps) {
  const [priceFeedData, setPriceFeedData] = useState<PriceFeedData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<string>("");

  // const fetchPriceFeed = async (useSmartContract: boolean = true) => {
  const fetchPriceFeed = async () => {
    if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
      setPriceFeedData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getPriceFeedFromBE(fromCurrency, toCurrency);
      console.log(data);
      setPriceFeedData(data);
      setLastRefreshTime(new Date().toLocaleTimeString());

      if (onRateUpdate) {
        onRateUpdate(data.rate);
      }
    } catch (error) {
      console.error("Error fetching price feed:", error);
      setError("Failed to fetch price feed");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh price feed setiap 30 detik
  useEffect(() => {
    if (fromCurrency && toCurrency && fromCurrency !== toCurrency) {
      fetchPriceFeed();

      const interval = setInterval(() => {
        fetchPriceFeed();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [fromCurrency, toCurrency]);

  // Hitung converted amount
  const convertedAmount =
    priceFeedData && amount ? amount * priceFeedData.rate : null;

  if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
    return (
      <div className="bg-slate-700/30 border border-white/10 rounded-lg p-4">
        <p className="text-gray-400 text-sm text-center">
          Select different currencies to see exchange rate
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-700/30 border border-white/10 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-white">
            Live Exchange Rate
          </span>
        </div>
        <button
          onClick={() => fetchPriceFeed()}
          disabled={isLoading}
          className={`p-1 rounded-full hover:bg-slate-600/50 transition-colors
            ${isLoading ? "animate-spin" : ""}
          `}
        >
          <RefreshCw className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Price Display */}
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
        </div>
      ) : error ? (
        <div className="text-red-400 text-sm text-center py-2">{error}</div>
      ) : priceFeedData ? (
        <div className="space-y-2">
          {/* Exchange Rate */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">1 {fromCurrency} =</span>
            <span className="text-white font-mono">
              {priceFeedData.rate.toLocaleString()} {toCurrency}
            </span>
          </div>

          {/* Converted Amount */}
          {amount > 0 && convertedAmount && (
            <div className="border-t border-white/10 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">You send:</span>
                <span className="text-cyan-300 font-medium">
                  {amount.toLocaleString()} {fromCurrency}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">They receive:</span>
                <span className="text-green-300 font-medium">
                  {convertedAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Updated: {lastRefreshTime}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
