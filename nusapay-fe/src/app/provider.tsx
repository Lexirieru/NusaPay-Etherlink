// lib/provider.tsx
'use client';

import { WagmiProvider } from 'wagmi'; // 🆕 Ganti WagmiConfig ➜ WagmiProvider
import { wagmiConfig } from '@/config/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const client = new QueryClient();

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={client}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
