export default function Slug(props: {
  post?: { html: string; title: string };
}) {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <a href="/" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to home
      </a>
      <article
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: props.post?.html! }}
      />
    </div>
  );
}
