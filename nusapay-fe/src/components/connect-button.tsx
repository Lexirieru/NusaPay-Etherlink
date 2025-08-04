import { useAccount, useConnect, useDisconnect } from "wagmi";

export const ConnectButton = () => {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="flex flex-col items-start gap-2">
      {isConnected ? (
        <button
          onClick={() => disconnect()}
          className="text-center mx-auto w-full px-4 py-2 text-sm rounded-xl border-1 border-cyan-400 hover:bg-cyan-950 hover:scale-105 transition"
        >
          Disconnect ({address?.slice(0, 6)}...{address?.slice(-4)})
        </button>
      ) : (
        connectors
          .filter((connector) => connector.name === "MetaMask")
          .map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              className="text-center mx-auto w-full px-4 py-2 text-sm rounded-xl bg-gradient-to-tl from-cyan-400/45 to-cyan-400 hover:bg-[#a8a8a8] hover:scale-105 transition"
            >
              Connect with MetaMask
            </button>
          ))
      )}
    </div>
  );
};
