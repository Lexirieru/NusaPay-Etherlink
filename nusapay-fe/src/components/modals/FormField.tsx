"use client"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
interface FormFieldProps{
    label: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    type?: string
    required?: boolean
}

export default function FormField({label, value, onChange, placeholder, type ="text", required = false} : FormFieldProps){
    return(
        <div >
            <Label 
            className="text-white mb-2 block">
                {label} {required && <span className="text-red-400">*</span>}
            </Label>
            <Input
                id={label.toLowerCase().replace(" ", "-")}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="modal-input bg-white text-black"
                required={required}>
            </Input>
        </div>
    )
}