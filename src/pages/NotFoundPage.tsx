import { Link } from "react-router-dom";
export default function NotFoundPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">404 — Page not found</h1>
      <p className="mt-2"><Link className="underline" to="/">Go home</Link></p>
    </div>
  );
}
