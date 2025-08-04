"use client"
import DropdownItem from "./Dropdown"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { Template } from "@/lib/template"
import { useTemplate } from "@/lib/TemplateContext"

interface DashboardHeaderProps{
    templates: Template[]
    currentTemplate: Template | null
    onTemplateSwitch: (templateId: string) => void
    onCreateTemplate: () => void
}

export default function DashboardHeader({templates, currentTemplate, onTemplateSwitch, onCreateTemplate} : DashboardHeaderProps){
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const {switchTemplate} = useTemplate();
    const handleHeaderClick = () =>{
        setIsDropdownOpen(!isDropdownOpen)
    }

    const handleCloseDropDown = () => {
        setIsDropdownOpen(false)
    }

    // handler buat ganti template
    const handleTemplateSelect =(templateId: string) => {
        console.log(templateId) //groupId

        switchTemplate(templateId)
        onTemplateSwitch(templateId)
        handleCloseDropDown()
    }

    // handler untuk buat template baru
    const handleCreateTemplate = () => {
        onCreateTemplate()
        handleCloseDropDown()
    }
    return(
        <div className="flex items-center justify-between mb-8 relative">
            <button 
                onClick={handleHeaderClick}
                className="flex items-center space-x-3  p-3 rounded-xl transition-all duration-300 group">
                    <h1 
                        className="text-3xl font-black bg-gradient-to-r
                         from-white to-gray-300 bg-clip-text 
                         text-transparent group-hover:from-cyan-400 group-hover:to-blue-400 
                         transition-all duration-300">
                        {currentTemplate?.nameOfGroup || "No Template Selected"}
                    </h1>
                    <div
                        className={`bg-white rounded-full transition-transform duration-300 ${isDropdownOpen? "rotate-180": ""}`}>
                            <ChevronDown className={`w-4 h-4 m-1 text-black group-hover:text-cyan-400 transition-colors duration-300`} />
                    </div>
            </button>

            {/* Template Info */}
            {currentTemplate&& (
                <div className="text-right">
                    <p className="text-gray-400 text-sm">
                        {currentTemplate.employees.length} Recipients
                    </p>
                    <p className="text-gray-500 text-xs">
                        Updated {new Date(currentTemplate.updatedAt).toLocaleDateString()}
                    </p>
                </div>
            )}

            {/* Pilihan Dropdown / Instansinya apa aja*/}
            {isDropdownOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={handleCloseDropDown}/>
                    <div className="absolute top-full left-0 mt-2 bg-transparent backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl z-20 min-w-2xs">
                        <div className="p-2">
                            {/* list */}
                            <div className="mb-2">
                                {templates.length>0?(
                                    templates.map((template) =>(
                                        <DropdownItem
                                            key={template.groupId}
                                            template={template}
                                            isActive={currentTemplate?.groupId === template.groupId}
                                            onClick={() => handleTemplateSelect(template.groupId)}
                                        />
                                    ))
                                ): (
                                    <div className="px-3 py-2 text-gray-500 text-sm">
                                        No templates available
                                    </div>
                                )}
                            </div>
                            {/* Separator */}
                            {templates.length > 0 && <hr className="border-gray-700 my-2"/>}

                            {/* Add new template */}
                            <button
                                onClick={handleCreateTemplate}
                                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700/5- hover:text-cyan-400 transition-all duration-200"
                            >
                                <p>Add New Template</p>
                            </button>
                        </div>

                    </div>
                </>
            )}
        
        </div>
    )
}

