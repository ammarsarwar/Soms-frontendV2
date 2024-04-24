import { CheckCircle } from "lucide-react";

interface FormSuccessProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div className="bg-green-500/10 p-3 rounded-sm flex items-center gap-x-2 text-sm text-green-500">
      <CheckCircle height={15} width={15} />
      <p>{message}</p>
    </div>
  );
};
