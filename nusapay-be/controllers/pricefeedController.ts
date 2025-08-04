import { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import { ethers } from "ethers";

dotenv.config();

// --- API Key & Chain Info ---
const IDRX_API_KEY = process.env.IDRX_API_KEY || "";
const IDRX_CHAIN_ID = "8453"; // Base Mainnet
const ALCHEMY_RPC_URL = process.env.ALCHEMY_RPC_URL_ETH_MAINNET!;

// --- Chainlink Price Feed Addresses (Ethereum Mainnet) ---
const ETH_USD_ADDRESS = "0x5147eA642CAEF7BD9c1265AadcA78f997AbB9649";
const USDC_USD_ADDRESS = "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6";
const USDT_USD_ADDRESS = "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D";
const DAI_USD_ADDRESS = "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9";
const BNB_USD_ADDRESS = "0x14e613AC84a31f709eadbdF89C6CC390fDc9540A";
const AVAX_USD_ADDRESS = "0xFF3EEb22B5E3dE6e705b44749C2559d704923FD7";
const LINK_USD_ADDRESS = "0x76F8C9E423C228E83DCB11d17F0Bd8aEB0Ca01bb";
const AAVE_USD_ADDRESS = "0xbd7F896e60B650C01caf2d7279a1148189A68884";
const UNI_USD_ADDRESS = "0x553303d460EE0afB37EdFf9bE42922D8addFF63220e";

// --- ABI for Chainlink Aggregator ---
const aggregatorV3Abi = [
  "function latestRoundData() view returns (uint80, int256, uint256, uint256, uint80)",
  "function decimals() view returns (uint8)",
];

// --- Get IDRX/USDC rate via API ---
export const fetchIdrxRateFromUSDC = async (): Promise<number> => {
  if (!IDRX_API_KEY) {
    throw new Error("Missing IDRX API key");
  }

  const url = `https://idrx.co/api/transaction/rates?usdtAmount=1&chainId=${IDRX_CHAIN_ID}`;

  const response = await axios.get(url, {
    headers: {
      "idrx-api-key": IDRX_API_KEY,
    },
  });

  const buyAmount = response.data?.data?.buyAmount;

  if (!buyAmount) {
    throw new Error("No buyAmount in response");
  }

  // ✅ IDRX menggunakan 2 desimal
  return parseFloat(ethers.utils.formatUnits(buyAmount.toString(), 2));
};

// --- Dipakai untuk endpoint GET /api/idrx/usdc ---
export const getIdrxRateFromUSDC = async (_req: Request, res: Response) => {
  try {
    const rate = await fetchIdrxRateFromUSDC();
    res.status(200).json({ rate });
    return;
  } catch (error: any) {
    console.error("Failed to fetch IDRX rate:", error.message);
    res.status(500).json({ error: error.message || "Internal server error" });
    return;
  }
};

// --- Fungsi umum untuk dapatkan harga token → USDC ---
const getTokenToUsdcRate = async (
  tokenFeedAddress: string,
  provider: ethers.providers.JsonRpcProvider
): Promise<number> => {
  const tokenFeed = new ethers.Contract(
    tokenFeedAddress,
    aggregatorV3Abi,
    provider
  );
  const usdcFeed = new ethers.Contract(
    USDC_USD_ADDRESS,
    aggregatorV3Abi,
    provider
  );

  const [, tokenUsdRaw] = await tokenFeed.latestRoundData();
  const tokenDecimals = await tokenFeed.decimals();

  const [, usdcUsdRaw] = await usdcFeed.latestRoundData();
  const usdcDecimals = await usdcFeed.decimals();

  const tokenUsd = Number(tokenUsdRaw) / 10 ** tokenDecimals;
  const usdcUsd = Number(usdcUsdRaw) / 10 ** usdcDecimals;

  return tokenUsd / usdcUsd;
};

const resolveTokenToIdrx = async (
  fromCurrency: string,
  provider: ethers.providers.JsonRpcProvider
): Promise<number> => {
  const idrxRate = await fetchIdrxRateFromUSDC(); // 1 USDC = x IDRX

  if (fromCurrency.toUpperCase() === "USDC") {
    return idrxRate;
  }

  const feedMap: Record<string, string> = {
    ETH: ETH_USD_ADDRESS,
    USDT: USDT_USD_ADDRESS,
    DAI: DAI_USD_ADDRESS,
    BNB: BNB_USD_ADDRESS,
    AVAX: AVAX_USD_ADDRESS,
    LINK: LINK_USD_ADDRESS,
    AAVE: AAVE_USD_ADDRESS,
    UNI: UNI_USD_ADDRESS,
  };

  const tokenFeedAddress = feedMap[fromCurrency.toUpperCase()];
  if (!tokenFeedAddress) {
    throw new Error(`Unsupported fromCurrency: ${fromCurrency}`);
  }

  const tokenToUsdcRate = await getTokenToUsdcRate(tokenFeedAddress, provider);
  return tokenToUsdcRate * idrxRate;
};

// --- Endpoint GET /api/idrx/rates/to-usdc ---
export const getAllRatesToUsdc = async (req: Request, res: Response) => {
  const { fromCurrency, toCurrency } = req.body;
  if (!fromCurrency || !toCurrency) {
    res.status(400).json({ error: "Missing fromCurrency or toCurrency" });
    return;
  }

  if (
    toCurrency.toUpperCase() !== "IDRX" &&
    toCurrency.toUpperCase() !== "IDR"
  ) {
    res
      .status(400)
      .json({ error: "Currently only supports conversion to IDRX" });
    return;
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_RPC_URL);
    const result = await resolveTokenToIdrx(fromCurrency, provider);

    res.status(200).json({
      fromCurrency: fromCurrency.toUpperCase(),
      toCurrency: "IDRX",
      rate: result,
      lastUpdated: new Date().toISOString(),
    });
    return;
  } catch (error: any) {
    console.error("Error resolving rate:", error.message);
    res.status(500).json({ error: error.message || "Internal error" });
    return;
  }
};
