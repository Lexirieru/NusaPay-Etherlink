"use client"
import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import ModalOverlay from "./ModalOverlay"

/**
 * Process Loading Components
 * Fungsi:
 * - Loading tiap tahap
 * - nyantumin tf ke berapa negara
 */

interface ProcessLoadingProps{
    recepientCount: number
    onComplete: () => void
    isStage1Complete: boolean
}

interface ProcessStage{
    id: string
    title: string
    duration: number
}

// durasi per process bisa disesuaiin nanti
const PROCESS_STAGES: ProcessStage[] =[
    {
        id: "tahap1",
        title: "Sending Employee Data to Smart Contract ",
        duration: 2000,
    },
    {
        id: "tahap2",
        title: "Token Transfer Process Using Chainlink CCIP ",
        duration: 5000,
    },
    {
        id: "tahap3",
        title: "Minting Process with IDRX API",
        duration: 5000,
    },
]

export default function ProcessingModal({recepientCount,onComplete, isStage1Complete}:ProcessLoadingProps){
    const [currentStageIndex, setCurrentStageIndex] = useState(0)
    const [completedStages, setCompletedStages] = useState<Set<string>>(new Set())

    const countryCount = Math.min(Math.ceil(recepientCount/2))
    // useEffect(() => {
    //     if(currentStageIndex >= PROCESS_STAGES.length){
    //         const timer = setTimeout(() =>{
    //             onComplete()
    //         }, 1000)
    //         return () => clearTimeout(timer)
    //     }

    //     const currentStage = PROCESS_STAGES[currentStageIndex]
    //     const timer = setTimeout(() =>{
    //         //Nandain stage saat ini kelar
    //         setCompletedStages((prev) => new Set([...prev, currentStage.id]))

    //         //habis kelar pindah ke next stage
    //         setTimeout(() => {
    //             setCurrentStageIndex((prev) => prev + 1)
    //         }, 500)
    //     }, currentStage.duration)

    //     return() => clearTimeout(timer)
    // }, [currentStageIndex, onComplete])

    useEffect(() =>{
        const proceedToNextStage = () =>{
            const currentStage = PROCESS_STAGES[currentStageIndex]
            setCompletedStages((prev) => new Set([...prev, currentStage.id]))

            setTimeout(() => {
                setCurrentStageIndex((prev => prev + 1))
            }, 500)
        }
        if(currentStageIndex >= PROCESS_STAGES.length){
            const doneTimer = setTimeout(() =>{
                onComplete()
            }, 1000)
            return () => clearTimeout(doneTimer)
        }

        const currentStage = PROCESS_STAGES[currentStageIndex]
        if(currentStage.id === "tahap1"){
            if(isStage1Complete){
                const timer = setTimeout(() =>{
                    proceedToNextStage()
                }, 500)
                return () => clearTimeout(timer)   
            }
        }else{
            const timer = setTimeout(() =>{
                proceedToNextStage()
            }, currentStage.duration)
            return () => clearTimeout(timer)
        }
    }, [currentStageIndex, isStage1Complete, onComplete])

    return(
        <ModalOverlay onClose={() => {}}>
            <div className="relative bg-transparent border border-white/20 rounded-2xl p-8 w-full max-w-md backdrop-blur-sm">
                {/* Header */}
                <div>
                    <h2 className="text-center text-2xl font-bold text-white mb-2">NusaPay Payment Process</h2>
                    <p className="text-gray-300 mb-4">Paying to {countryCount} countries</p>
                </div>

                {/* Process Stages */}
                <div className="space-y-2">
                    {PROCESS_STAGES.map((stage, index) => (
                        <ProcessStageItem
                            key={stage.id}
                            stage={stage}
                            isActive={index === currentStageIndex}
                            isCompleted={completedStages.has(stage.id)}
                            isPending={index > currentStageIndex}
                        />
                        
                    ))}
                </div>
                
                {/* Progress Bar */}
                {/* <div className="mt-8">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{Math.round((completedStages.size / PROCESS_STAGES.length) * 100 )}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{
                                width: `${(completedStages.size / PROCESS_STAGES.length) * 100}%`,
                            }}
                        >
                        </div>
                    </div>
                </div> */}
            </div>
        </ModalOverlay>
    )
}

/**
 * Process Stage Item Component (males bikin component sekali pakai tambahan)
 * komponen buat nampilin tiap tahap process
 */

interface ProcessStageItemProps{
    stage: ProcessStage
    isActive: boolean
    isCompleted: boolean
    isPending: boolean
}

function ProcessStageItem({stage, isActive, isCompleted, isPending}: ProcessStageItemProps){
    return(
        <div
            className={`flex items-center space-x-4 rounded-lg transition-all duration-300 bg-transparent ${isPending ? "opacity-40" : "opacity-100"}`}
    >
        
            {/* Icon */}
            <div className="flex-shrink-0">
                {isCompleted ? (
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3  text-black"/>
                    </div>
                ): isActive ? (
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin " /> 
                ): (
                    <div className="w-2 h-2 bg-white rounded-full "/>
                )

                }
            </div>

            {/* Stage info */}
            <div >
                <p className="text-gray-400 text-sm">{stage.title}</p>
            </div>
        </div>
    )
}