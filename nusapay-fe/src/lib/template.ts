"use client"

import { Employee } from "@/types/recipient"

export interface Template{
    groupId: string,
    companyId : string,
    companyName : string,
    nameOfGroup : string,
    employees: Employee[]
    createdAt: Date
    updatedAt: Date
}

export interface TemplateContextType{
    templates: Template[]
    currentTemplate: Template | null
    currentTemplateId: string | null; // ✅ Tambahkan ini
    switchTemplate: (templateId: string) => void
    createTemplate: (name: string) => void
    updateTemplate: (templateId: string, employees: Employee[]) => void
    deleteTemplate: (templateId: string) => void
}