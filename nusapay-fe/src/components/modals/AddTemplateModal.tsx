import type React from "react";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ModalOverlay from "./ModalOverlay";

/**
 * Add Template Modal Component
 * Fungsi:
 * - Intine pas mencet add new template dari header
 * - input nama template
 */

interface addTemplateModalProps{
    onClose: () => void
    onSave: (templateName: string) => void
}

export default function AddTemplateModal({onClose, onSave}: addTemplateModalProps){
    const [templateName, setTemplateName] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        if(!templateName.trim()){
            alert("Please enter a template name")
            return
        }

        try{
            await new Promise((resolve) => setTimeout(resolve, 500))
            onSave(templateName.trim())
        } catch(error){
            console.error("Error creating template: ", error)
            alert("Failed to create template. Please try again.")
        } finally{
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if(e.key === "Enter" && !isLoading ){
            handleSubmit()
        }
    }

    return(
        <ModalOverlay onClose={onClose}>
            <div className="relative bg-slate-800/50 border border-white/20 rounded-2xl p-8 w-full max-w-sm backdrop-blur-sm">
                <div className="flex items-center justify-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Add New Template</h2>
                </div>

                <div className="space-y-5">
                    <div>
                        <Input 
                        id="template-name"
                        type="text"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder=""
                        disabled={isLoading}
                        autoFocus
                        maxLength={50}
                        className="bg-white text-black"
                        />
                    </div>
                    <Button 
                        onClick={handleSubmit}
                        disabled={isLoading || !templateName.trim()}
                        className="w-full py-3 rounded-lg bg-cyan-400 tet-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ?(
                            <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"/>
                            <span>Creating...</span>
                            </div>
                        ): (
                            "Save"
                        )}
                    </Button>
                </div>
            </div>


            
        </ModalOverlay>
    )
}