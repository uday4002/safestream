import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Loader2, X, AlertCircle } from "lucide-react";

export default function VideoPlayer({ videoId, onClose, title }) {
    const videoRef = useRef(null);
    const { token } = useAuth();
    const [isWaiting, setIsWaiting] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!videoId || !token) return;

        setIsWaiting(true);
        setError(false);

        const streamUrl = `http://localhost:5000/api/videos/${videoId}/stream?token=${token}`;

        if (videoRef.current) {
            videoRef.current.src = streamUrl;
        }

        // Prevent background scrolling when popup is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [videoId, token]);

    if (!videoId) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Dark Backdrop */}
            <div
                className="absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-6xl max-h-full flex flex-col bg-[#0a0a0a] rounded-2xl border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Header Actions */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-800/50 bg-neutral-900/50">
                    <div className="flex flex-col">
                        <h3 className="text-white font-bold text-lg leading-none truncate max-w-50 sm:max-w-md">
                            {title || "Now Playing"}
                        </h3>
                        <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">Live Stream Active</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-neutral-800 hover:bg-red-500 text-white rounded-full transition-all cursor-pointer group"
                    >
                        <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                    </button>
                </div>

                {/* Video Area */}
                <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-75">
                    {isWaiting && !error && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
                            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center">
                            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                            <p className="text-white font-bold">Playback failed</p>
                            <button onClick={onClose} className="mt-4 text-blue-400 text-sm font-bold cursor-pointer">Close Player</button>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        controls
                        autoPlay
                        /* FIX: object-contain prevents cutting off top/bottom.
                           max-h-full ensures it fits inside the modal container.
                        */
                        className="w-full h-full max-h-[80vh] object-contain"
                        onWaiting={() => setIsWaiting(true)}
                        onCanPlay={() => setIsWaiting(false)}
                        onError={() => {
                            setIsWaiting(false);
                            setError(true);
                        }}
                    />
                </div>

                {/* Status Footer */}
                <div className="p-3 bg-neutral-900/50 flex items-center justify-center border-t border-neutral-800/50">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] text-neutral-400 font-bold tracking-[0.2em] uppercase">High Contrast Enabled</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}