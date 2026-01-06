import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { useArticle } from '@/hooks/useArticles';
import { EditArticleModal } from '@/components/EditArticleModal';
import { AuthGuard } from '@/components/AuthGuard';
import { Header } from '@/components/Header';

const ArticleDetailContent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: article, isLoading } = useArticle(id);
  const [editOpen, setEditOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto px-6 py-12">
          <p className="text-muted-foreground text-sm">Loading...</p>
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto px-6 py-12">
          <p className="text-muted-foreground text-sm font-serif">Article not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/app')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 font-mono text-xs uppercase tracking-wide"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <article>
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="font-serif text-3xl">{article.title}</h1>
            <button
              onClick={() => setEditOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors shrink-0"
              aria-label="Edit article"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          
          <time className="font-mono text-xs text-muted-foreground">
            {format(new Date(article.created_at), 'MMMM d, yyyy')}
          </time>
          
          <div className="mt-8">
            <div className="font-serif text-foreground/80 whitespace-pre-wrap break-words leading-relaxed text-lg">
              {article.body.split(/(\!\[.*?\]\(.*?\))/).map((part, index) => {
                const imageMatch = part.match(/^\!\[(.*?)\]\((.*?)\)$/);
                if (imageMatch) {
                  return (
                    <img
                      key={index}
                      src={imageMatch[2]}
                      alt={imageMatch[1] || 'Article image'}
                      className="max-w-full h-auto rounded-lg my-4"
                    />
                  );
                }
                return <span key={index}>{part}</span>;
              })}
            </div>
          </div>
        </article>

        <EditArticleModal
          article={article}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      </main>
    </div>
  );
};

const ArticleDetail = () => {
  return (
    <AuthGuard>
      <ArticleDetailContent />
    </AuthGuard>
  );
};

export default ArticleDetail;
