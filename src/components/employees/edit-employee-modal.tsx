
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { EditEmployeeForm } from "./edit-employee-form";

interface EditEmployeeModalProps {
  employeeId: string; // This is employee_id
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

  if (isMobile === false) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <EditEmployeeForm employeeId={employeeId} onClose={handleClose} />
        </DialogContent>
      </Dialog>
    );
  }

  // Fallback for when isMobile is still undefined during first render
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Employee</SheetTitle>
        </SheetHeader>
        <EditEmployeeForm employeeId={employeeId} onClose={handleClose} />
      </SheetContent>
    </Sheet>
  );
}
