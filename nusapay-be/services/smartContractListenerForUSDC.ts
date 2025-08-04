import { ethers } from "ethers";
import payrollUSDCABI from "../abi/payrollUSDCABI.json";
import dotenv from "dotenv";
import { doMinting } from "../utils/redeemingFromOtherTokens";

dotenv.config();

if (
  !process.env.LISK_SEPOLIA ||
  !process.env.CONTRACT_ADDRESS_SC_MINT_WITH_USDC ||
  !process.env.IDRX_API_KEY ||
  !process.env.IDRX_SECRET_KEY
) {
  throw new Error("Missing environment variables. Cek kembali file .env");
}

const provider = new ethers.providers.JsonRpcProvider(
  process.env.LISK_SEPOLIA!
);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS_SC_MINT_WITH_USDC!,
  payrollUSDCABI,
  provider
);

type RedeemTxMeta = {
  txHash: string;
  signature: string;
  timestamp: string;
};

let lastRedeemTxMeta: RedeemTxMeta | null = null;

export function setRedeemTxMeta(meta: RedeemTxMeta) {
  lastRedeemTxMeta = meta;
}

export function getRedeemTxMeta(): RedeemTxMeta | null {
  return lastRedeemTxMeta;
}

// async function testConnection(){
//   const network = await provider.getNetwork();
//   console.log("Connected to network:", network.name, network.chainId);
// }
// testConnection();

export const main = async () => {
  // ntar ganti karena aku gatau nama eventnya apa (berarti ganti juga ABI-nya)
  contract.on(
    "PayrollApproved",
    async (
      txId,
      userId,
      companyId,
      templateName,
      amount,
      recipient,
      IDRX_API_KEY,
      IDRX_SECRET_KEY,
      PRIVATE_KEY
    ) => {
      console.log(`[EVENT RECEIVED]`);

      console.log({
        txId,
        userId,
        companyId,
        templateName,
        amount,
        recipient,
        IDRX_API_KEY,
        IDRX_SECRET_KEY,
        PRIVATE_KEY,
      });
      amount = ethers.utils.formatUnits(amount, 6);
      console.log(amount);

      // catatannya adalah smart contract harus mbawain idrx api key,
      // idrx secret key, dan private key wallet di payloadnya
      await doMinting(
        txId,
        userId,
        companyId,
        templateName,
        amount.toString(),
        recipient,
        IDRX_API_KEY,
        IDRX_SECRET_KEY,
        PRIVATE_KEY
      );
    }
  );

  console.log("Listening for PayrollApproved...");
};
