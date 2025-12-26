import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import VideoUpload from "../components/video/VideoUpload";
import VideoLibrary from "../components/video/VideoLibrary";
import UsersManagement from "../components/UserManagement";
import { X, LayoutGrid, UserCircle } from "lucide-react";

export default function Dashboard() {
    const { user } = useAuth();
    const [active, setActive] = useState("videos");
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleUploadStarted = () => {
        setShowUploadModal(false);
        setActive("my-videos");

        // Refresh library slightly after upload starts to show the "Processing" state
        setTimeout(() => {
            setRefreshKey(prev => prev + 1);
        }, 800);
    };

    return (
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
            {/* FIXED SIDEBAR */}
            <Navbar
                active={active}
                setActive={setActive}
                onUploadClick={() => setShowUploadModal(true)}
            />

            {/* SCROLLABLE MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">

                {/* Dashboard Header - Sticky */}
                <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-4 md:py-6 bg-[#050505]/80 backdrop-blur-xl border-b border-neutral-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                        <h2 className="text-2xl font-black uppercase tracking-tighter">
                            {active.replace("-", " ")}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-bold text-white">{user?.name || "User"}</span>
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{user?.role}</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
                            <UserCircle className="w-6 h-6" />
                        </div>
                    </div>
                </header>

                {/* Viewport for Dynamic Components */}
                <section className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar scroll-smooth">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {active === "users" && user.role === "admin" && <UsersManagement />}

                        {active === "videos" && (
                            <VideoLibrary key={`all-${refreshKey}`} fetchType="all" />
                        )}

                        {active === "my-videos" && (
                            <VideoLibrary key={`mine-${refreshKey}`} fetchType="mine" />
                        )}

                    </div>
                </section>

                {/* UPLOAD MODAL - Enhanced Transition */}
                {showUploadModal && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
                        {/* Backdrop with heavy blur */}
                        <div
                            className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity cursor-pointer"
                            onClick={() => setShowUploadModal(false)}
                        />

                        {/* Modal Body */}
                        <div className="relative bg-[#0d0d0d] border border-neutral-800 w-full max-w-2xl rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-300">
                            <div className="flex justify-between items-center p-4 md:p-6 border-b border-neutral-800/50 bg-neutral-900/30">
                                <div className="flex items-center gap-3">
                                    <LayoutGrid className="text-blue-500 w-5 h-5" />
                                    <h3 className="text-xl font-black uppercase tracking-tighter">Broadcast Content</h3>
                                </div>
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-all cursor-pointer"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-4 md:p-8">
                                <VideoUpload onUploadStarted={handleUploadStarted} />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}