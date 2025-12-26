import { useNavigate } from "react-router-dom";
import {
    Shield,
    Play,
    Upload,
    Users,
    Zap,
    Lock,
    ArrowRight,
    Video
} from "lucide-react";

export default function Landing() {
    const navigate = useNavigate();

    const features = [
        {
            icon: Shield,
            title: "Content Classification",
            description:
                "Server-side rule-based validation and classification during video processing."
        },
        {
            icon: Zap,
            title: "Real-Time Processing",
            description:
                "Live progress updates during uploads and processing using WebSockets."
        },
        {
            icon: Play,
            title: "Secure Video Streaming",
            description:
                "HTTP range-based streaming for smooth playback and fast seeking."
        },
        {
            icon: Users,
            title: "Role-Based Access Control",
            description:
                "Viewer, Editor, and Admin roles with strict permission enforcement."
        },
        {
            icon: Lock,
            title: "Data Isolation",
            description:
                "Users can only access videos they own or are explicitly permitted to."
        },
        {
            icon: Upload,
            title: "Reliable Upload Pipeline",
            description:
                "Validated uploads with background processing and status tracking."
        }
    ];

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100">
            {/* NAVBAR */}
            <nav className="border-b border-neutral-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <Video className="w-5 h-5 text-blue-500" />
                        SafeStream
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/auth")}
                            className="text-sm text-neutral-400 hover:text-white transition cursor-pointer"
                        >
                            Sign in
                        </button>
                        <button
                            onClick={() => navigate("/auth")}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section className="max-w-5xl mx-auto px-6 py-24 text-center">
                <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight mb-6">
                    Secure Video <br />
                    <span className="text-blue-500">Management Platform</span>
                </h1>

                <p className="text-neutral-400 text-lg max-w-2xl mx-auto mb-10">
                    Upload, process, and stream sensitive media securely with real-time
                    progress tracking and strict role-based access control.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate("/auth")}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg text-sm font-medium transition cursor-pointer"
                    >
                        Start Using SafeStream
                        <ArrowRight size={16} />
                    </button>
                </div>
            </section>

            {/* FEATURES */}
            <section className="border-t border-neutral-800 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-semibold mb-3">
                            Platform Capabilities
                        </h2>
                        <p className="text-neutral-400">
                            Designed for reliability, security, and scale.
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition"
                            >
                                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-neutral-800 mb-4">
                                    <feature.icon className="w-5 h-5 text-blue-500" />
                                </div>

                                <h3 className="text-lg font-medium mb-2">
                                    {feature.title}
                                </h3>

                                <p className="text-sm text-neutral-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
                        Ready to manage your video content securely?
                    </h2>
                    <p className="text-neutral-400 mb-8">
                        Get started with SafeStream and control access to sensitive media
                        with confidence.
                    </p>
                    <button
                        onClick={() => navigate("/auth")}
                        className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg text-sm font-medium transition cursor-pointer"
                    >
                        Create Account
                    </button>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-neutral-800 py-8 text-center">
                <p className="text-xs text-neutral-500">
                    © 2025 SafeStream. Secure Media Management Platform.
                </p>
            </footer>
        </div>
    );
}
