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

interface Props {
  handleConfirmAction: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  confirmText: string;
  descriptionTitle?: string;
  descriptionText: string;
}

export default function ConfirmDialog({
  handleConfirmAction,
  open,
  onOpenChange,
  confirmText,
  descriptionText,
  descriptionTitle,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {descriptionTitle || "Estas seguro?"}
          </AlertDialogTitle>
          <AlertDialogDescription>{descriptionText}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmAction}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
