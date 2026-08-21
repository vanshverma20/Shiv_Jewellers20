"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email, password, redirect: false
    });
    
    if (res?.error) {
      setError("Invalid credentials. Since there are no users right now, entering any email/password creates a Super Admin.");
    } else {
      router.push("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">JWL Admin Portal</h1>
        <p className="text-slate-500 text-center text-sm mb-6">Sign in to manage products and QR codes</p>
        
        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4 text-sm font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required 
              className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required 
              className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 outline-none transition-all" />
          </div>
          <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white rounded-md py-2.5 font-medium hover:bg-slate-800 transition-colors disabled:opacity-70 mt-4 shadow-sm">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
