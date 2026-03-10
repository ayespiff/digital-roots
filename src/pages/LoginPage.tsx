import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
//import { loginUser } from "../services/authAPI";
import { login } from "../services/authAPI";


type Props = {
  setUser: React.Dispatch<React.SetStateAction<{ id: number; name: string } | null>>;
};

type User = { id: number; name: string } | null;

type AuthPageProps = {
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

//export default function LoginPage({ setUser }: Props) {
export default function LoginPage({ setUser }: AuthPageProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login({ email, password });
    setLoading(false);

    if ("error" in res) {
      setError(res.error);
      return;
    }

    setUser(res.user);
    navigate("/learn");
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-2">Login</h1>
      <p className="text-sm text-slate-600 mb-4">Access your learning progress.</p>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded-lg p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border rounded-lg p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg p-2 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-sm text-slate-600 mt-4">
        Don’t have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}