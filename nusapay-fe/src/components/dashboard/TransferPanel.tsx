"use client"
/** Transfer Panel Component
 * 
 * Fungsi: 
 * - panel floating buat preview
 * - nampilin jumlah recipients sama total amount
 * */ 

interface TransferPanelProps{
    totalRecipients: number
    onTransferClick:() =>void
}
export default function TransferPanel({ totalRecipients, onTransferClick}: TransferPanelProps){
    const adminFee = 0.001
    return(
        <div className="flex justify-center w-full items-center px-10 fixed bottom-0 left-0 right-0 z-20 p-6">
            <div className="w-full max-w-3xl border border-white backdrop-blur-md rounded-2xl p-5 shadow-2xl bg-transparent ">
                <div className="flex items-center justify-between">
                    {/* Preview */}
                    <div className="ml-12 space-y-1 text-white">
                        <div className="flex items-center space-x-4 ">
                            <div className="flex items-center space-x-2">
                                <span className="text-xl font-bold">Transfer to {totalRecipients} People and 9 Region</span>
                            </div>
                        </div>
                        <p>
                            Admin fee: ${adminFee}
                        </p>
                    </div>

                    {/* Transfer Button */}
                    <button onClick={onTransferClick} className="mr-10 bg-cyan-400 hover:bg-cyan-300 text-white font-semibold px-10 py-5 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group rounded-xl flex items-center">
                        Transfer Now
                    </button>
                </div>
            </div>
        </div>
    )
}