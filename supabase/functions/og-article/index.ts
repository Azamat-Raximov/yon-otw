import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return new Response(JSON.stringify({ error: "Missing slug parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch article from public_articles view
    const { data: article, error } = await supabase
      .from("public_articles")
      .select("id, title, body, slug, created_at")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!article) {
      return new Response(JSON.stringify({ error: "Article not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a description from the body (first 160 chars)
    const description = article.body
      .replace(/!\[.*?\]\(.*?\)/g, "") // Remove markdown images
      .replace(/\n/g, " ") // Replace newlines with spaces
      .trim()
      .substring(0, 160);

    const siteUrl = "https://yon-otw.lovable.app";
    const articleUrl = `${siteUrl}/read/${article.slug}`;
    const ogImageUrl = `${siteUrl}/share-og.jpg?v=1`;

    return new Response(
      JSON.stringify({
        title: article.title,
        description: description || "Read this article on YON - Your Own Notebook",
        url: articleUrl,
        image: ogImageUrl,
        siteName: "YON - Your Own Notebook",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
