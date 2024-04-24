import { XCircle } from "lucide-react";

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/10 p-3 rounded-sm flex items-center gap-x-2 text-sm text-destructive">
      <XCircle height={15} width={15} />
      <p>{message}</p>
    </div>
  );
};
