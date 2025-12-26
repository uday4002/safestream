import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://safestream-qj0v.onrender.com";

const socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket", "polling"],
    withCredentials: true,
    auth: {
        token: localStorage.getItem("token")
    }
});

// Update auth token when it changes
export const updateSocketAuth = (token) => {
    socket.auth.token = token;
    if (socket.connected) {
        socket.disconnect();
        socket.connect();
    }
};

export default socket;
