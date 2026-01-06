import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const FloatingCreateButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/app/new')}
      className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
      aria-label="Create new article"
    >
      <Plus className="w-5 h-5" />
    </button>
  );
};
