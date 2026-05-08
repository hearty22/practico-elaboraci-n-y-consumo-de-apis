import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { useState, memo } from "react";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAction: () => void;
  taskAction: (task: {
    title: string;
    description?: string;
  }) => Promise<unknown>;
  initialData?: { title: string; description?: string };
  isUpdate?: boolean;
}

const INITIAL_STATE = {
  title: "",
  description: "",
};

export const TaskFormModal = memo(({
  isOpen,
  onClose,
  onTaskAction,
  taskAction,
  initialData,
  isUpdate = false,
}: TaskFormModalProps) => {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        title: initialData.title,
        description: initialData.description || "",
      };
    }
    return INITIAL_STATE;
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const taskData: { title: string; description?: string } = {
        title: formData.title,
      };

      if (formData.description) {
        taskData.description = formData.description;
      }

      await taskAction(taskData);
      onTaskAction();
      onClose();
    } catch (error) {
      console.error(`Failed to ${isUpdate ? "update" : "create"} task:`, error);
    }
  };

  return (
    <Dialog open={isOpen} handler={onClose} size="sm" className="bg-[#1a202c]">
      <form onSubmit={handleSubmit}>
        <DialogHeader className="text-slate-200">
          {isUpdate ? "Editar Tarea" : "Crear Nueva Tarea"}
        </DialogHeader>
        <DialogBody divider className="flex flex-col gap-6 border-white/10">
          <Input
            label="Título"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            autoComplete="off"
            color="white"
          />
          <Textarea
            label="Descripción (Opcional)"
            name="description"
            value={formData.description}
            onChange={handleChange}
            color="white"
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={onClose} className="mr-1">
            <span>Cancelar</span>
          </Button>
          <Button variant="gradient" color="green" type="submit">
            <span>{isUpdate ? "Guardar Cambios" : "Crear Tarea"}</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
});
