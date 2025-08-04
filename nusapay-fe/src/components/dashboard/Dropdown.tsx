import type { Template } from "@/lib/template"
interface DropdownItemProps{
    template: Template
    isActive: boolean
    onClick?: () => void
}

export default function DropdownItem({template, isActive=false, onClick}
    :DropdownItemProps){
        return(
            <button
                onClick={onClick}
                className={`w-full min-w-xs text-left px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-700/50 hover:text-white
                    ${isActive? " font-medium" : " text-gray-300 "}`}
                
            >
                <div className="flex justify-between items-center">
                    <span>{template.nameOfGroup}</span>
                    <span className="text-xs text-gray-500">{template.employees.length}</span>
                </div>
                
            </button>
        )
}