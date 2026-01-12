import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { BookOpen, Lock, Globe } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const Landing = () => {
  return (
    <>
      <Helmet>
        <title>YON - Your Own Notebook | Free Online Note Taking App</title>
        <meta name="description" content="YON is a free, minimal, distraction-free online notebook for capturing ideas, writing notes, and organizing your thoughts. Access your notes anywhere, anytime." />
        <link rel="canonical" href="https://yon-otw.lovable.app/" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <header className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-xl font-semibold text-foreground">YON</h1>
          <nav className="flex items-center gap-4" aria-label="Main navigation">
            <ThemeToggle />
            <Button asChild variant="ghost">
              <Link to="/auth">Sign In</Link>
            </Button>
          </nav>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-24">
          <section className="text-center space-y-6 mb-20 animate-fade-in-up" style={{ animationDelay: '0.1s' }} aria-labelledby="hero-heading">
            <h2 id="hero-heading" className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Your Own Notebook
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A minimal, distraction-free space for capturing ideas, writing notes, and organizing your thoughts into playlists.
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link to="/auth">Get Started Free</Link>
            </Button>
          </section>

          <section className="grid md:grid-cols-3 gap-8 mt-16" aria-label="Features">
            <article className="space-y-3 text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto" aria-hidden="true">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Access Anywhere</h3>
              <p className="text-sm text-muted-foreground">
                Your notes live on the web. Access them from any device, anywhere in the world.
              </p>
            </article>

            <article className="space-y-3 text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto" aria-hidden="true">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Simple Writing</h3>
              <p className="text-sm text-muted-foreground">
                Focus on what matters. Clean interface with dark and light modes for comfortable writing.
              </p>
            </article>

            <article className="space-y-3 text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto" aria-hidden="true">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Private & Secure</h3>
              <p className="text-sm text-muted-foreground">
                Your notes are yours alone. Only you can see what you write, always.
              </p>
            </article>
          </section>
        </main>

        <footer className="text-center py-8 text-sm text-muted-foreground space-y-1 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p>Start writing today. It's completely free.</p>
          <p className="text-xs">Developed by <span itemProp="author">Azamat Raximov</span></p>
        </footer>
      </div>
    </>
  );
};

export default Landing;
