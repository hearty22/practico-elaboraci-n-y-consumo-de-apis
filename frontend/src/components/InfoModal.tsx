import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { memo } from "react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  action?: {
    text: string;
    to: string;
  };
}

export const InfoModal = memo(({
  isOpen,
  onClose,
  title,
  message,
  action,
}: InfoModalProps) => {
  return (
    <Dialog open={isOpen} handler={onClose} size="xs">
      <DialogHeader>{title}</DialogHeader>
      <DialogBody divider>{message}</DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="blue-gray"
          onClick={onClose}
          className="mr-1"
        >
          <span>Cerrar</span>
        </Button>
        {action && (
          <Link to={action.to} onClick={onClose}>
            <Button variant="gradient" color="green">
              <span>{action.text}</span>
            </Button>
          </Link>
        )}
      </DialogFooter>
    </Dialog>
  );
});
