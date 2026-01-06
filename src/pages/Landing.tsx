import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Lock, Palette } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold text-foreground">Notebook</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button asChild variant="ghost">
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center space-y-6 mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Your personal space for thoughts
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A minimal, distraction-free notebook for capturing ideas, writing notes, and organizing your thoughts into playlists.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Simple Writing</h3>
            <p className="text-sm text-muted-foreground">
              Focus on what matters. Write your thoughts without distractions.
            </p>
          </div>

          <div className="space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Private & Secure</h3>
            <p className="text-sm text-muted-foreground">
              Your notes are yours alone. Only you can see what you write.
            </p>
          </div>

          <div className="space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Dark & Light</h3>
            <p className="text-sm text-muted-foreground">
              Switch between themes for comfortable reading anytime.
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-sm text-muted-foreground">
        <p>Start writing today. It's free.</p>
      </footer>
    </div>
  );
};

export default Landing;
