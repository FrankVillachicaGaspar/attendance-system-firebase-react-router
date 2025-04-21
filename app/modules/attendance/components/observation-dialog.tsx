import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardList } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ObservationDialogProps {
  observation_type: string;
  observation: string;
  employeeName: string;
}

export function ObservationDialog({
  observation_type,
  observation,
  employeeName,
}: ObservationDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          Observación
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Observaciones - {employeeName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select defaultValue={observation_type}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tipo de observación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="justificada">Falta justificada</SelectItem>
              <SelectItem value="injustificada">Falta injustificada</SelectItem>
              <SelectItem value="dia-libre">Día libre</SelectItem>
              <SelectItem value="feriado">Feriado</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            value={observation}
            className="min-h-[150px] resize-none"
            placeholder="Sin observaciones"
            readOnly
          />
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
