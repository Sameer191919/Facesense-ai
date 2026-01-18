import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await api.post("/auth/login", null, {
        params: { email, password }
      });
      localStorage.setItem("token", "demo");
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
      <div className="bg-white p-8 rounded-xl shadow w-96 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-2 text-center">
          FaceSense AI
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Sign in to continue
        </p>

        <input
          className="border p-3 w-full mb-4 rounded"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-3 w-full mb-6 rounded"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded transition"
        >
          Login
        </button>

        <p className="text-sm text-center mt-4">
          New here?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-indigo-600 cursor-pointer"
          >
            Create account
          </span>
        </p>
      </div>
    </div>
  );
}
