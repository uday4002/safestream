import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    Video,
    Users,
    LogOut,
    PlusCircle,
    Menu,
    X,
    LayoutDashboard
} from "lucide-react";

export default function Navbar({ active, setActive, onUploadClick }) {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);

    const navItems = [
        { key: "videos", label: "All Videos", icon: <Video className="w-4 h-4" />, roles: ["viewer", "editor", "admin"] },
        { key: "my-videos", label: "My Videos", icon: <Video className="w-4 h-4" />, roles: ["editor", "admin"] },
        { key: "users", label: "Users", icon: <Users className="w-4 h-4" />, roles: ["admin"] }
    ];

    return (
        <>
            {/* ================= MOBILE NAVBAR ================= */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-[#0a0a0a]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="font-black tracking-tighter text-white">SAFESTREAM</h1>
                </div>

                <button
                    onClick={() => setOpen(prev => !prev)}
                    className="p-2 text-neutral-400 hover:text-white cursor-pointer"
                >
                    {open ? <X /> : <Menu />}
                </button>
            </div>

            {/* ================= SIDEBAR ================= */}
            <aside
                className={`
                    fixed md:static
                    top-64px md:top-0
                    left-0 bottom-0
                    z-40
                    w-64
                    bg-[#0d0d0d]
                    border-r border-neutral-800/60
                    transform
                    ${open ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0
                    transition-transform duration-300 ease-in-out
                    flex flex-col
                `}
            >
                {/* Logo */}
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-black tracking-tighter text-white uppercase">
                            SafeStream
                        </h1>
                    </div>
                    <p className="text-[10px] mt-2 font-black text-neutral-500 uppercase tracking-widest">
                        {user.role}
                    </p>
                </div>

                <nav className="px-4 space-y-2 flex-1">
                    {(user.role === "editor" || user.role === "admin") && (
                        <button
                            onClick={() => {
                                onUploadClick();
                                setOpen(false);
                            }}
                            className="w-full mb-6 bg-white text-black py-3 rounded-xl font-black uppercase text-[11px] flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Upload Video
                        </button>
                    )}

                    {navItems
                        .filter(item => item.roles.includes(user.role))
                        .map(item => {
                            const isActive = active === item.key;
                            return (
                                <button
                                    key={item.key}
                                    onClick={() => {
                                        setActive(item.key);
                                        setOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold cursor-pointer
                                        ${isActive
                                            ? "bg-blue-600/10 text-blue-500"
                                            : "text-neutral-500 hover:bg-neutral-900"}
                                    `}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            );
                        })}
                </nav>

                <div className="p-4 border-t border-neutral-800">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ================= OVERLAY ================= */}
            {open && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}
        </>
    );
}
