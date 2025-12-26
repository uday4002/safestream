import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import {
    Users,
    Crown,
    Shield,
    Eye,
    Search,
    Mail,
    Calendar,
    ChevronDown
} from "lucide-react";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const loadUsers = async () => {
        try {
            const res = await api.get("/users");
            setUsers(res.data.data);
        } catch {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const updateUserRole = async (userId, newRole) => {
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            setUsers(prev => prev.map(u =>
                u._id === userId ? { ...u, role: newRole } : u
            ));
            toast.success(`Role updated to ${newRole}`);
        } catch {
            toast.error("Failed to update user role");
        }
    };

    const roleStyles = {
        admin: {
            color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
            icon: <Crown className="w-4 h-4" />
        },
        editor: {
            color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
            icon: <Shield className="w-4 h-4" />
        },
        viewer: {
            color: "text-green-400 bg-green-400/10 border-green-500/20",
            icon: <Eye className="w-4 h-4" />
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="bg-[#171717] border border-neutral-800 rounded-2xl p-8 shadow-2xl animate-pulse">
                <div className="h-8 bg-neutral-800 rounded-lg w-64 mb-8"></div>
                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-16 bg-neutral-800/50 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#171717] border border-neutral-800 rounded-2xl p-6 shadow-2xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600/10 text-blue-500 rounded-xl flex items-center justify-center border border-blue-500/20">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">User Directory</h2>
                        <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">{users.length} Total Members</p>
                    </div>
                </div>

                {/* Active Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-black border border-neutral-800 rounded-xl pl-12 pr-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none w-full md:w-80 transition-all"
                    />
                </div>
            </div>

            {/* Users List */}
            <div className="space-y-3">
                {filteredUsers.map((user) => {
                    const style = roleStyles[user.role] || roleStyles.viewer;
                    return (
                        <div
                            key={user._id}
                            className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl hover:border-neutral-600 hover:bg-neutral-900 transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                {/* Avatar Glow */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-105 ${style.color}`}>
                                    {style.icon}
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-white tracking-tight">{user.name}</p>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${style.color}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-neutral-500">
                                        <span className="flex items-center gap-1 text-[11px] font-medium"><Mail className="w-3 h-3" /> {user.email}</span>
                                        <span className="hidden sm:flex items-center gap-1 text-[11px] font-medium"><Calendar className="w-3 h-3" /> Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Role Switcher */}
                            <div className="flex items-center gap-4 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-neutral-800">
                                <div className="relative w-full md:w-auto">
                                    <select
                                        value={user.role}
                                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                                        className="appearance-none bg-black border border-neutral-800 rounded-lg pl-4 pr-10 py-2 text-xs font-bold text-neutral-400 hover:text-white focus:border-blue-500 outline-none transition-all w-full cursor-pointer"
                                    >
                                        <option value="viewer">Viewer Access</option>
                                        <option value="editor">Editor Access</option>
                                        <option value="admin">System Admin</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-600 pointer-events-none" />
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-neutral-800 rounded-2xl">
                    <div className="bg-neutral-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-neutral-600" />
                    </div>
                    <p className="text-neutral-400 font-bold uppercase tracking-widest text-sm">No members found</p>
                    <p className="text-neutral-600 text-xs mt-1">Try adjusting your search criteria</p>
                </div>
            )}
        </div>
    );
}