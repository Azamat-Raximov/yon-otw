import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';

export const Header = () => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <header className="flex items-center justify-between mb-12">
      <h1 className="font-mono text-sm text-muted-foreground uppercase tracking-widest">YON</h1>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};
