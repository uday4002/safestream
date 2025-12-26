import { Play, Flag, CheckCircle, Edit, Trash2, AlertTriangle, Clock } from "lucide-react";

export default function VideoCard({ video, role, onPlay, onFlag, onUnflag, onEdit, onDelete }) {
    const isBlocked = video.status === "flagged" && role === "viewer";
    const canModerate = ["editor", "admin"].includes(role);
    const canEdit = role === "admin";
    const isProcessing = video.status === "processing";

    // Production Color Mapping - "safe" is now green
    const statusMap = {
        safe: { color: "text-green-400 bg-green-400/10 border-green-500/20", icon: <CheckCircle className="w-3.5 h-3.5" /> },
        flagged: { color: "text-red-400 bg-red-400/10 border-red-500/20", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
        processing: { color: "text-blue-400 bg-blue-400/10 border-blue-500/20", icon: <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> },
    };

    const currentStatus = statusMap[video.status] || { color: "text-neutral-400 bg-neutral-800", icon: null };

    // Construct the stream URL for the thumbnail
    // Adding #t=0.1 tells the browser to load the frame at 0.1 seconds
    const thumbUrl = `http://localhost:5000/api/videos/${video._id}/stream?token=${localStorage.getItem("token")}#t=0.1`;

    return (
        <div className="group relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-neutral-600 hover:shadow-2xl flex flex-col h-full">

            {/* Thumbnail Section */}
            <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
                {isProcessing ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Processing...</span>
                    </div>
                ) : (
                    <video
                        src={thumbUrl}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                        muted
                        preload="metadata"
                    />
                )}

                {/* Play Overlay (Desktop) */}
                {!isBlocked && !isProcessing && (
                    <div
                        onClick={() => onPlay(video._id)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-xl scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-6 h-6 fill-current" />
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="text-white font-semibold truncate text-sm flex-1">{video.title}</h3>
                    <div className={`shrink-0 flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-tighter ${currentStatus.color}`}>
                        {currentStatus.icon}
                        {video.status}
                    </div>
                </div>

                {video.description && (
                    <p className="text-neutral-500 text-xs line-clamp-2 mb-4">
                        {video.description}
                    </p>
                )}

                {/* Processing/Confidence Bar */}
                {(isProcessing || video.confidence) && (
                    <div className="mb-4">
                        <div className="w-full bg-neutral-800 rounded-full h-1 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${isProcessing ? 'bg-blue-500' : 'bg-green-500'}`}
                                style={{ width: `${isProcessing ? video.processingProgress : video.confidence}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="mt-auto pt-3 border-t border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-neutral-600 font-mono">
                            {new Date(video.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        {canModerate && video.status === "safe" && (
                            <button onClick={() => onFlag(video._id)} className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer" title="Flag">
                                <Flag className="w-4 h-4" />
                            </button>
                        )}
                        {canModerate && video.status === "flagged" && (
                            <button onClick={() => onUnflag(video._id)} className="p-2 text-neutral-500 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors cursor-pointer" title="Approve">
                                <CheckCircle className="w-4 h-4" />
                            </button>
                        )}
                        {canEdit && (
                            <>
                                <button onClick={() => onEdit(video)} className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer" title="Edit">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => onDelete(video._id)} className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Blocked Overlay Message */}
            {isBlocked && (
                <div className="absolute inset-0 bg-neutral-900/120 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                    <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
                    <p className="text-white text-xs font-bold uppercase">Restricted Content</p>
                    <p className="text-white text-[10px] mt-1">This video has been flagged by moderators.</p>
                </div>
            )}
        </div>
    );
}