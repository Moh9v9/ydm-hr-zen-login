
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  attendanceId: string | undefined;
  employeeName: string;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  attendanceId,
  employeeName,
}: DeleteConfirmationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error deleting record:", error);
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>حذف سجل الحضور</AlertDialogTitle>
          <AlertDialogDescription>
            هل أنت متأكد أنك تريد حذف سجل الحضور لـ {employeeName}؟
            لا يمكن التراجع عن هذا الإجراء.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirmDelete();
            }}
            disabled={isDeleting}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري الحذف...
              </>
            ) : (
              "حذف"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
