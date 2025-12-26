import { useState, useCallback } from "react";
import api from "../../api/axios";

export default function VideoUpload({ onUploadStarted }) {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
        else if (e.type === "dragleave") setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !title) return alert("Title and File are required");

        const formData = new FormData();
        formData.append("video", file);
        formData.append("title", title);
        formData.append("description", description);

        try {
            setLoading(true);
            // Notify parent immediately to close modal and switch tabs
            onUploadStarted();

            await api.post("/videos/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        } catch (err) {
            console.error("Upload error", err);
            alert("Upload failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInput").click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragging ? "border-indigo-500 bg-indigo-500/10" : "border-neutral-700 hover:border-neutral-500"
                    }`}
            >
                <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <div className="space-y-2">
                    <p className="text-lg font-medium">
                        {file ? file.name : "Drag and drop video or click to browse"}
                    </p>
                    <p className="text-sm text-neutral-400">MP4, MKV or MOV (Max 100MB)</p>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Video Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-md px-4 py-2 focus:border-indigo-500 outline-none"
                    placeholder="Enter video title"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-md px-4 py-2 focus:border-indigo-500 outline-none h-24"
                    placeholder="Tell viewers about your video"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-700 py-3 rounded-md font-bold transition cursor-pointer"
            >
                {loading ? "Starting Upload..." : "Upload Video"}
            </button>
        </form>
    );
}