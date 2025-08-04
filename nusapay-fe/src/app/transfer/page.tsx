"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardHeader from "@/components/dashboard/Header";
import RecipientGrid from "@/components/dashboard/RecipientGrid";
import TransferPanel from "@/components/dashboard/TransferPanel";
import type { Employee } from "@/types/recipient";
import BeneficiaryModal from "@/components/modals/BeneficiaryModal";
import AddTemplateModal from "@/components/modals/AddTemplateModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Template } from "@/lib/template";
import ProcessingModal from "@/components/modals/ProcessLoading";

import { addGroupName, loadGroupName } from "@/api/groupService";
import {
  addOrUpdateEmployeeData,
  deleteEmployeeData,
  loadEmployeeData,
} from "@/api/employeeService";
import { useUser } from "@/lib/UserContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useUser();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const [showBeneficiaryModal, setShowBeneficiaryModal] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Employee | null>(
    null
  );
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showTransferAlert, setShowTransferAlert] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);

  // const [newlyCreatedInvoiceId, setNewlyCreatedInvoiceId] = useState<string|null>(null)
  const [isStage1Complete, setIsStage1Complete] = useState(false);
  const handleTemplateSwitch = useCallback(
    async (templateId: string) => {
      const selected = templates.find((t) => t.groupId === templateId);
      if (!selected) return;

      try {
        const response = await loadEmployeeData({
          groupId: selected.groupId,
        });

        const employeesFromBackend: Employee[] = response;

        const updatedTemplate: Template = {
          ...selected,
          employees: employeesFromBackend,
          updatedAt: new Date(),
        };

        setCurrentTemplate(updatedTemplate);
      } catch (err) {
        console.error("Failed to load employees for group", err);
      }
    },
    [templates]
  );

  // Fetch all templates first
  useEffect(() => {
    if (loading || !user?._id || hasFetched) return;

    const fetchTemplatesAndEmployees = async () => {
      try {
        const groupTemplates = await loadGroupName({
          companyId: user.companyId,
        });
        console.log(groupTemplates);

        const templatesWithEmptyRecipients: Template[] = groupTemplates.map(
          (group: Template) => ({
            groupId: group.groupId,
            companyId: group.companyId,
            companyName: group.companyName,
            nameOfGroup: group.nameOfGroup,
            employees: group.employees,
            createdAt: new Date(group.createdAt),
            updatedAt: new Date(group.updatedAt),
          })
        );

        setTemplates(templatesWithEmptyRecipients);

        if (templatesWithEmptyRecipients.length > 0) {
          await handleTemplateSwitch(templatesWithEmptyRecipients[0].groupId);
        }

        setHasFetched(true);
      } catch (err) {
        console.error("Failed to fetch templates", err);
      }
    };

    fetchTemplatesAndEmployees();
  }, [loading, user, hasFetched, handleTemplateSwitch]);

  const handleCreateTemplate = async (templateName: string) => {
    if (!user || !user._id) {
      alert("Cannot create template: User not found.");
      return;
    }
    console.log(user?._id);
    console.log(user);
    const newTemplate = {
      groupId: crypto.randomUUID(),
      companyId: user.companyId,
      companyName: user.companyName,
      nameOfGroup: templateName,
      employees: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await addGroupName(newTemplate);
    setTemplates([...templates, newTemplate]);
    setCurrentTemplate(newTemplate);
    setShowTemplateModal(false);
  };

  const updateCurrentTemplateRecipients = (newRecipients: Employee[]) => {
    if (!currentTemplate) return;

    const updatedTemplate: Template = {
      ...currentTemplate,
      employees: newRecipients,
      updatedAt: new Date(),
    };

    setCurrentTemplate(updatedTemplate);
    setTemplates(
      templates.map((t) =>
        t.groupId === currentTemplate.groupId ? updatedTemplate : t
      )
    );
  };

  const handleAddRecipient = (newRecipient: Omit<Employee, "_id">) => {
    if (!currentTemplate) return;
    const employee: Employee = {
      ...newRecipient,
    };
    updateCurrentTemplateRecipients([...currentTemplate.employees, employee]);
    setShowBeneficiaryModal(false);
  };

  // const handleEditRecipient = (updated: Employee) => {
  //   if (!currentTemplate) return;
  //   const updatedList = currentTemplate.recipients.map((r) =>
  //     r.id === updated._id ? updated : r
  //   );
  //   updateCurrentTemplateRecipients(updatedList);
  //   setEditingRecipient(null);
  //   setShowBeneficiaryModal(false);
  // };

  const handleRemoveRecipient = async (id: string) => {
    if (!currentTemplate) return;
    const updatedList = currentTemplate.employees.filter((r) => r.id !== id);
    await deleteEmployeeData(id);
    updateCurrentTemplateRecipients(updatedList);
  };

  const handleSaveBeneficiary = async (data: Employee) => {
    if (!currentTemplate) return;

    // ✅ PERBAIKAN: Ubah kondisi 'if' ini.
    // Cek ini memastikan 'data._id' ada dan bukan string kosong.
    console.log(data);
    if (data.id) {
      // Di dalam blok ini, TypeScript sekarang yakin bahwa data._id adalah 'string'.
      await addOrUpdateEmployeeData({ ...data, id: data.id });
      await handleTemplateSwitch(currentTemplate.groupId);
    } else {
      // Ini tambah baru
      handleAddRecipient(data);
    }

    setShowBeneficiaryModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-lg animate-pulse">Loading user...</p>
      </div>
    );
  }

  const handleConfirmTransfer = async () => {
    if (!currentTemplate || !user) return;

    setShowTransferAlert(false);
    setShowProcessingModal(true);
    setIsStage1Complete(false);

    try {
      // const creationPayload = {
      //   txId: crypto.randomUUID(),
      //   companyId: user.companyId,
      //   templateName: currentTemplate.nameOfGroup,
      //   recipients: currentTemplate.recipients.map((r) => ({
      //     employeeId: r.id,
      //     amount: r.amountTransfer,
      //   })),
      // };
      // const newInvoice = await addInvoiceData(creationPayload);
      // setNewlyCreatedInvoiceId(newInvoice._id)

      setIsStage1Complete(true);
    } catch (err) {
      console.error("Failed to create invoice: ", err);
      setShowProcessingModal(false);
      // setNewlyCreatedInvoiceId(null)
    }
  };

  const handleProcessingComplete = () => {
    setShowProcessingModal(false);
    // if(newlyCreatedInvoiceId){
    //   router.push(`/invoice/${newlyCreatedInvoiceId}`)
    // }
    router.push(`/invoice/32424141321`);
  };
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <main className="relative z-10 p-6 pb-32">
        <div className="flex items-center justify-center">
          <DashboardHeader
            templates={templates}
            currentTemplate={currentTemplate}
            onTemplateSwitch={handleTemplateSwitch}
            onCreateTemplate={() => setShowTemplateModal(true)}
          />
        </div>

        {currentTemplate ? (
          <RecipientGrid
            employees={currentTemplate.employees}
            onAddClick={() => setShowBeneficiaryModal(true)}
            onRemoveRecipient={handleRemoveRecipient}
            onRecipientClick={(recipient) => {
              setEditingRecipient(recipient);
              setShowBeneficiaryModal(true);
            }}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No template selected</p>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="mt-4 text-cyan-400 hover:text-cyan-300"
            >
              Create your first template
            </button>
          </div>
        )}
      </main>

      {currentTemplate && currentTemplate.employees.length > 0 && (
        <TransferPanel
          totalRecipients={currentTemplate.employees.length}
          onTransferClick={() => setShowTransferAlert(true)}
        />
      )}

      <AlertDialog open={showTransferAlert} onOpenChange={setShowTransferAlert}>
        <AlertDialogContent className="backdrop-blur-sm border-white/55 rounded-2xl bg-transparent">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-center font-bold">
              Are You Sure To Transfer To {currentTemplate?.nameOfGroup}?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-cyan-400">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-cyan-400"
              onClick={handleConfirmTransfer}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showBeneficiaryModal && (
        <BeneficiaryModal
          employee={editingRecipient}
          onClose={() => {
            setEditingRecipient(null);
            setShowBeneficiaryModal(false);
          }}
          onSave={handleSaveBeneficiary}
        />
      )}

      {showTemplateModal && (
        <AddTemplateModal
          onClose={() => setShowTemplateModal(false)}
          onSave={handleCreateTemplate}
        />
      )}

      {showProcessingModal && currentTemplate && (
        <ProcessingModal
          recepientCount={currentTemplate.employees.length}
          onComplete={handleProcessingComplete}
          isStage1Complete={isStage1Complete}
        />
      )}
    </div>
  );
}
