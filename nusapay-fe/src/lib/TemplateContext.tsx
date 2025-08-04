"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Template, TemplateContextType } from "./template";
import { Employee } from "@/types/recipient";

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export const TemplateProvider = ({ children }: { children: ReactNode }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(null);

  const currentTemplate = templates.find((t) => t.groupId === currentTemplateId) || null;

  const switchTemplate = (templateId: string) => {
    setCurrentTemplateId(templateId);
  };

  const createTemplate = (name: string) => {
    const newTemplate: Template = {
      groupId: Date.now().toString(),
      companyId: "your-company-id",
      companyName: "Your Company",
      nameOfGroup: name,
      employees: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTemplates((prev) => [...prev, newTemplate]);
    setCurrentTemplateId(newTemplate.groupId);
  };

  const updateTemplate = (templateId: string, recipients: Employee[]) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.groupId === templateId ? { ...t, recipients, updatedAt: new Date() } : t
      )
    );
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((t) => t.groupId !== templateId));
    if (templateId === currentTemplateId) {
      setCurrentTemplateId(null);
    }
  };

  return (
    <TemplateContext.Provider
      value={{
        templates,
        currentTemplate,
        currentTemplateId,
        switchTemplate,
        createTemplate,
        updateTemplate,
        deleteTemplate,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }
  return context;
};
