import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function NotificationBell({ adminId }) {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // ===== INITIAL FETCH =====
  const fetchNotifications = async () => {
    try {
      const res = await api.get(`/api/notifications/admin/${adminId}`);
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    if (!adminId) return;

    fetchNotifications();

    // ===== WEBSOCKET =====
    const socket = new SockJS(
      "https://my-backend-1-qxc9.onrender.com/ws"
    );

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: () => {},
    });

    client.onConnect = () => {
      client.subscribe("/topic/admin", (message) => {
        const payload = JSON.parse(message.body);
        setNotifications((prev) => [payload, ...prev]);
      });
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [adminId]);

  return (
    <div
      className="relative cursor-pointer"
      onClick={() => navigate("/driver-requests")}
    >
      <Bell className="w-6 h-6 text-gray-700" />

      {notifications.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
          {notifications.length}
        </span>
      )}
    </div>
  );
}
