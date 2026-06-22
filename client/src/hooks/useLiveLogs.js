import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const MAX_LIVE_LOGS = 300;

export default function useLiveLogs() {
  const [liveLogs, setLiveLogs] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("shopsec_token");
    if (!token) return;

    const socket = io({
      path: "/socket.io",
      auth: { token },
    });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("new-log", (log) => {
      setLiveLogs((prev) => [log, ...prev].slice(0, MAX_LIVE_LOGS));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { liveLogs, connected };
}
