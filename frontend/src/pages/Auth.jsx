import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
    Mail,
    Lock,
    UserPlus,
    LogIn,
    ShieldCheck,
    AlertCircle,
    Video
} from "lucide-react";

export default function Auth() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({
        email: "",
        password: "",
        role: "viewer"
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const url = isLogin ? "/auth/login" : "/auth/register";
            const res = await api.post(url, form);

            if (isLogin) {
                login(res.data.data.token, res.data.data.user);
                navigate("/dashboard");
            } else {
                setIsLogin(true);
                setForm({ ...form, password: "" });
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-6">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-2 mt-4">
                        <Video className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-semibold text-white">SafeStream</h1>
                    <p className="text-neutral-400 text-sm mt-1">
                        Secure Video Platform
                    </p>
                </div>

                {/* Card */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 mb-4">
                    <h2 className="text-xl font-semibold mb-2">
                        {isLogin ? "Login" : "Sign Up"}
                    </h2>
                    <p className="text-neutral-400 text-sm mb-6">
                        {isLogin
                            ? "Enter your email and password to continue."
                            : "Create an account to start using SafeStream."}
                    </p>

                    {error && (
                        <div className="flex items-center gap-2 p-3 mb-5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-3 text-white outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-3 text-white outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Role (Signup only) */}
                        {!isLogin && (
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-3 text-white outline-none focus:border-blue-500 cursor-pointer"
                                >
                                    <option value="viewer">Viewer</option>
                                    <option value="editor">Editor</option>
                                </select>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin cursor-pointer" />
                            ) : (
                                <>
                                    {isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
                                    {isLogin ? "Login" : "Create Account"}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-6 text-center">
                        <button
                            className="text-sm text-neutral-400 hover:text-white transition cursor-pointer"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError("");
                            }}
                        >
                            {isLogin
                                ? "Don't have an account? Sign up"
                                : "Already have an account? Login"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
