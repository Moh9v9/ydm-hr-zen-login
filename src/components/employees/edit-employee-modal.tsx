
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { EditEmployeeForm } from "./edit-employee-form";

interface EditEmployeeModalProps {
  employeeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditEmployeeModal({ employeeId, open, onOpenChange }: EditEmployeeModalProps) {
  const isMobile = useIsMobile();

  const handleClose = () => {
    onOpenChange(false);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[85%] pt-2">
          <DrawerHeader className="text-left">
            <DrawerTitle>Edit Employee</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 py-2 overflow-y-auto">
            <EditEmployeeForm employeeId={employeeId} onClose={handleClose} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>
            Make changes to the employee information below.
          </DialogDescription>
        </DialogHeader>
        <EditEmployeeForm employeeId={employeeId} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
