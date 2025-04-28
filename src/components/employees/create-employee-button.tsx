
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { CreateEmployeeForm } from "./create-employee-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function CreateEmployeeButton() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleClose = () => {
    setOpen(false);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Create Employee</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[95vh] overflow-y-auto">
          <div className="px-4 py-6">
            <CreateEmployeeForm onClose={handleClose} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Create Employee</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Employee</DialogTitle>
        </DialogHeader>
        <CreateEmployeeForm onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
