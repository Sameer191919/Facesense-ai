import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      await api.post("/auth/signup", null, {
        params: { email, password }
      });
      alert("Account created");
      navigate("/");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600">
      <div className="bg-white p-8 rounded-xl shadow w-96 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-2 text-center">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Start your AI interview journey
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
          onClick={signup}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded transition"
        >
          Sign Up
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-indigo-600 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
