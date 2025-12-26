import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    autoConnect: false,
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
