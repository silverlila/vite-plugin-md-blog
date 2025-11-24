export default function Home(props: {
  posts: { slug: string; title: string }[];
}) {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">My Blog</h1>
      <ul className="space-y-4">
        {props?.posts.map((p) => (
          <li key={p.slug}>
            <a
              className="text-lg text-blue-600 hover:text-blue-800 hover:underline"
              href={`/post/${p.slug}`}
            >
              {p.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
