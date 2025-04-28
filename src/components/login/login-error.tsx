
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginErrorProps {
  error: string | null;
}

export function LoginError({ error }: LoginErrorProps) {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-6 animate-in">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
