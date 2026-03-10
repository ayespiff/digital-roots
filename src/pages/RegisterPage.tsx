import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
//import { registerUser } from "../services/authAPI";
import { register } from "../services/authAPI";

type Props = {
  setUser: React.Dispatch<React.SetStateAction<{ id: number; name: string } | null>>;
};
type User = { id: number; name: string } | null;

type AuthPageProps = {
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

//export default function RegisterPage({ setUser }: Props) {
export default function RegisterPage({ setUser }: AuthPageProps) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await register({ name, email, password });
    setLoading(false);

    if ("error" in res) {
      setError(res.error);
      return;
    }

    // register.php auto-logs in and returns user
    setUser(res.user);
    navigate("/learn");
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-2">Register</h1>
      <p className="text-sm text-slate-600 mb-4">Create an account to track progress.</p>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded-lg p-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-slate-600 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}