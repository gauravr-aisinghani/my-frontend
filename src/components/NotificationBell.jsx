import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function NotificationBell({ adminId }) {
  const [notifications, setNotifications] = useState([]);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    // SockJS connection
    const socket = new SockJS("https://my-backend-1-qxc9.onrender.com/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("Connected to WebSocket");

      // Subscribe to admin topic
      client.subscribe("/topic/admin", (message) => {
        const payload = JSON.parse(message.body);
        console.log("New notification:", payload);

        setNotifications((prev) => [payload, ...prev]);
      });
    };

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <div className="relative">
      <Bell className="w-6 h-6 text-gray-700" />
      {notifications.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {notifications.length}
        </span>
      )}

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl z-50">
        {notifications.length === 0 ? (
          <p className="p-2 text-sm text-gray-500">No notifications</p>
        ) : (
          notifications.map((n, idx) => (
            <div key={idx} className="border-b p-2 text-sm">
              <strong>{n.title}</strong>
              <p>{n.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
