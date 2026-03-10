import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="font-display text-8xl font-bold neon-text-pink mb-4">404</h1>
      <p className="text-gray-400 font-mono mb-8">Страница не найдена</p>
      <Link to="/" className="btn-neon">
        На главную
      </Link>
    </div>
  );
}
