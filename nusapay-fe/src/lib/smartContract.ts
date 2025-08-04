import { ethers } from "ethers";
import payrollABI from "@/abi/payrollABI.json"

export interface PriceFeedData {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  lastUpdated: string;
}

export interface SmartContractResponse {
  success: boolean;
  data?: string;
  error?: string;
}

const SMART_CONTRACT_CONFIG = {
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "",
  abi:  payrollABI,
  networkId: process.env.NEXT_PUBLIC_NETWORK_ID || "4202",
};

// Type declaration for window.ethereum
// declare global {
//   interface Window {
//     ethereum?: ;
//   }
// }

export const initializeWeb3 = async () => {
  try {
    if (typeof window !== 'undefined' && window.ethereum) {
      // Use BrowserProvider for ethers v6, Web3Provider for v5
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      await provider.send("eth_requestAccounts", []);
      
      const signer = await provider.getSigner();
      
      // Validate contract address
      if (!SMART_CONTRACT_CONFIG.address || !ethers.isAddress(SMART_CONTRACT_CONFIG.address)) {
        throw new Error('Invalid contract address');
      }
      
      // Validate ABI
      if (!SMART_CONTRACT_CONFIG.abi || SMART_CONTRACT_CONFIG.abi.length === 0) {
        throw new Error('Contract ABI is empty or not provided');
      }
      
      const contract = new ethers.Contract(
        SMART_CONTRACT_CONFIG.address,
        SMART_CONTRACT_CONFIG.abi,
        signer
      );
      
      return { provider, signer, contract };
    } else {
      throw new Error('MetaMask not found. Please install MetaMask extension.');
    }
  } catch (error) {
    console.error('Error initializing Web3:', error);
    throw error;
  }
};

// export const getPriceFeedFromBE = async (
//   fromCurrency: string,
//   toCurrency: string
// ): Promise<PriceFeedData> => {
//   try {
//     // Validate input parameters
//     if (!fromCurrency || !toCurrency) {
//       throw new Error('Both fromCurrency and toCurrency are required');
//     }
    
//     if (!isValidCurrencyPair(fromCurrency, toCurrency)) {
//       throw new Error(`Invalid currency pair: ${fromCurrency}/${toCurrency}`);
//     }
    
//     const { contract } = await initializeWeb3();
    
//     // Check if contract has the required function
//     if (!contract.getPriceFeed) {
//       throw new Error('Contract does not have getPriceFeed function');
//     }
    
//     // Call getPriceFeed function from smart contract
//     const result = await contract.getPriceFeed(fromCurrency, toCurrency);
    
//     // Handle different ethers versions
//     let rate: number;
//     if (typeof result === 'bigint') {
//       // ethers v6 returns bigint
//       rate = parseFloat(ethers.formatUnits(result, 18));
//     } else {
//       // ethers v5 returns BigNumber
//       rate = parseFloat(ethers.formatUnits(result, 18));
//     }
    
//     // Validate rate
//     if (isNaN(rate) || rate <= 0) {
//       throw new Error('Invalid rate received from contract');
//     }
    
//     return {
//       fromCurrency,
//       toCurrency,
//       rate,
//       lastUpdated: new Date().toISOString(),
//     };
//   } catch (error) {
//     console.error('Error getting price feed:', error);
//     throw error;
//   }
// };

export const addRecipientToContract = async (
  name: string,
  bankAccount: string,
  amount: number
): Promise<SmartContractResponse> => {
  try {
    // Validate input parameters
    if (!name || !bankAccount || amount <= 0) {
      throw new Error('All parameters (name, bankAccount, amount) are required and amount must be positive');
    }
    
    const { contract } = await initializeWeb3();
    
    // Check if contract has the required function
    if (!contract.addRecipient) {
      throw new Error('Contract does not have addRecipient function');
    }
    
    // Convert amount to Wei
    const amountInWei = ethers.parseEther(amount.toString());
    
    // Execute transaction
    const tx = await contract.addRecipient(name, bankAccount, amountInWei);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    console.log(receipt)
    return {
      success: true,
      // data: { 
      //   transactionHash: tx.hash,
      //   blockNumber: receipt.blockNumber,
      //   gasUsed: receipt.gasUsed.toString()
      // },
    };
  } catch (error: unknown) {
    console.error("Error adding recipient:", error);
    let errorMessage = "An unknown error occurred.";
    
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('user rejected')) {
        errorMessage = "Transaction was rejected by user";
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = "Insufficient funds for transaction";
      } else if (error.message.includes('gas')) {
        errorMessage = "Gas estimation failed. Please try again.";
      } else if ('reason' in error) {
        errorMessage = "Gas estimation failed. Please try again.";
        // errorMessage = (error ).reason;
      } else {
        errorMessage = error.message;
      }
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Function to get supported currencies
export const getSupportedCurrencies = (): string[] => {
  return [
    'USDC', 'USDT', 'DAI', // Stablecoins
    'ETH', 'WETH', // Ethereum
    'MATIC', 'WMATIC', // Polygon
    'BNB', 'WBNB', // Binance Smart Chain
    'AVAX', 'WAVAX', // Avalanche
    'LINK', 'UNI', 'AAVE' // DeFi Tokens
  ];
};

// Function to validate currency pair
export const isValidCurrencyPair = (fromCurrency: string, toCurrency: string): boolean => {
  const supportedCurrencies = getSupportedCurrencies();
  return supportedCurrencies.includes(fromCurrency) && supportedCurrencies.includes(toCurrency);
};

// Helper function to check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

// Helper function to check if connected to correct network
export const checkNetwork = async (): Promise<boolean> => {
  try {
    if (!isMetaMaskInstalled()) {
      return false;
    }
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    
    return network.chainId.toString() === SMART_CONTRACT_CONFIG.networkId;
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
};

// Helper function to switch network
export const switchNetwork = async (): Promise<SmartContractResponse> => {
  try {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask not installed');
    }
    
    const chainId = '0x' + parseInt(SMART_CONTRACT_CONFIG.networkId).toString(16);
    
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Error switching network:', error);
    let errorMessage = "Failed to switch network";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};