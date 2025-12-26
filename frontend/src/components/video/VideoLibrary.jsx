import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import socket from "../../api/socket";
import { useAuth } from "../../context/AuthContext";
import VideoCard from "./VideoCard";
import VideoPlayer from "./VideoPlayer";
import { Loader2, Film } from "lucide-react";

/* ---------------- STATUS ENUM ---------------- */
const STATUS_OPTIONS = [
    { label: "All", value: "ALL" },
    { label: "Uploaded", value: "UPLOADED" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Safe", value: "SAFE" },
    { label: "Flagged", value: "FLAGGED" },
];

export default function VideoLibrary({ fetchType = "all" }) {
    const { user } = useAuth();

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(null);
    const [statusFilter, setStatusFilter] = useState("ALL");

    /* ---------------- FETCH VIDEOS ---------------- */
    const loadVideos = useCallback(async () => {
        setLoading(true);
        try {
            const endpoint =
                fetchType === "mine" ? "/videos/my-videos" : "/videos";
            const res = await api.get(endpoint);
            setVideos(res.data?.data || []);
        } catch (err) {
            console.error("Failed to load videos", err);
        } finally {
            setLoading(false);
        }
    }, [fetchType]);

    /* ---------------- SOCKET LISTENERS ---------------- */
    useEffect(() => {
        loadVideos();
        socket.connect();

        socket.on("video:progress", ({ videoId, progress }) => {
            setVideos((prev) =>
                prev.map((v) =>
                    v._id === videoId
                        ? {
                            ...v,
                            status: "PROCESSING",
                            processingProgress: progress,
                        }
                        : v
                )
            );
        });

        socket.on("video:completed", ({ videoId, status }) => {
            setVideos((prev) =>
                prev.map((v) =>
                    v._id === videoId
                        ? {
                            ...v,
                            status,
                            processingProgress: undefined,
                        }
                        : v
                )
            );
        });

        return () => {
            socket.off("video:progress");
            socket.off("video:completed");
            socket.disconnect();
        };
    }, [loadVideos]);

    /* ---------------- ACTIONS ---------------- */
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this video?")) return;
        try {
            await api.delete(`/videos/${id}`);
            setVideos((prev) => prev.filter((v) => v._id !== id));
        } catch {
            alert("Action failed. You may not have permission.");
        }
    };

    const handleFlagToggle = async (videoId, currentStatus) => {
        try {
            const isFlagged = currentStatus === "FLAGGED";
            const endpoint = isFlagged
                ? `/videos/${videoId}/unflag`
                : `/videos/${videoId}/flag`;

            const res = await api.put(endpoint);

            setVideos((prev) =>
                prev.map((v) =>
                    v._id === videoId
                        ? { ...v, status: res.data.data.status }
                        : v
                )
            );
        } catch {
            alert("Failed to update status");
        }
    };

    const handleEdit = (video) => {
        console.log("Edit video:", video);
    };

    /* ---------------- FILTER LOGIC ---------------- */
    const filteredVideos =
        statusFilter === "ALL"
            ? videos
            : videos.filter(
                (v) => v.status?.toUpperCase() === statusFilter
            );

    /* ---------------- RENDER STATES ---------------- */

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-neutral-500 font-medium animate-pulse">
                    Syncing library...
                </p>
            </div>
        );
    }

    if (videos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 border-2 border-dashed border-neutral-800 rounded-2xl">
                <Film className="w-12 h-12 text-neutral-700 mb-4" />
                <p className="text-neutral-400 text-lg font-medium">
                    {fetchType === "mine"
                        ? "Your library is empty"
                        : "No videos found"}
                </p>
                <p className="text-neutral-600 text-sm">
                    Upload a video to get started
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header / Filter */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-400">
                    Showing {filteredVideos.length} video
                    {filteredVideos.length !== 1 && "s"}
                </p>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="
                        bg-neutral-900 border border-neutral-800
                        text-sm text-white rounded-lg px-3 py-2
                        focus:outline-none focus:ring-1 focus:ring-blue-500
                        cursor-pointer
                    "
                >
                    {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Grid */}
            <div className="space-y-6">
                {/* Empty state (filtered but no match) */}
                {filteredVideos.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-neutral-800 rounded-2xl bg-neutral-950/40">
                        <Film className="w-12 h-12 text-neutral-700 mb-4" />
                        <p className="text-neutral-300 text-lg font-semibold">
                            No videos found
                        </p>
                        <p className="text-neutral-500 text-sm mt-1">
                            No videos with status <span className="font-medium">{statusFilter}</span>
                        </p>
                    </div>
                )}

                {/* Grid */}
                {filteredVideos.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {filteredVideos.map((video) => (
                            <VideoCard
                                key={video._id}
                                video={{
                                    ...video,
                                    status: video.status?.toLowerCase(),
                                }}
                                role={user.role}
                                onPlay={() => setPlaying(video)}
                                onFlag={() =>
                                    handleFlagToggle(video._id, video.status)
                                }
                                onUnflag={() =>
                                    handleFlagToggle(video._id, video.status)
                                }
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>


            {/* Video Player Modal */}
            {playing && (
                <VideoPlayer
                    videoId={playing._id}
                    onClose={() => setPlaying(null)}
                />
            )}
        </div>
    );
}
