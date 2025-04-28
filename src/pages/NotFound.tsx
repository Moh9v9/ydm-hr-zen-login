
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/layouts/AppLayout";

const NotFoundContent = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-xl text-muted-foreground mb-6">Sorry, the page you are looking for doesn't exist.</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

const NotFound = () => {
  const { user } = useAuth();

  // If user is authenticated, show NotFound within AppLayout
  if (user) {
    return (
      <AppLayout>
        <NotFoundContent />
      </AppLayout>
    );
  }

  // If not authenticated, show standalone NotFound page
  return <NotFoundContent />;
};

export default NotFound;
