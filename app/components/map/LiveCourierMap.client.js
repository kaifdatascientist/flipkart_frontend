"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import socket from "@/services/socket";
import "leaflet/dist/leaflet.css";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function LiveCourierMapClient({
  orderId,
  userLat,
  userLng,
}) {
  const [courier, setCourier] = useState(null);

  useEffect(() => {
  if (!orderId) return;

  // Join order room
  socket.emit("join-order", orderId);

  // 🔥 START COURIER WHEN MAP OPENS
  socket.emit("start-courier", {
    orderId,
    userLat,
    userLng,
  });

  socket.on("courier-location", (data) => {
    if (data.orderId === orderId) {
      setCourier({ lat: data.lat, lng: data.lng });
    }
  });

  return () => {
    socket.off("courier-location");
  };
}, [orderId]);


  if (!userLat || !userLng) return null;

  return (
    <div className="mt-6 h-[350px] w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={[userLat, userLng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 👤 USER */}
        <Marker position={[userLat, userLng]}>
          <Popup>You</Popup>
        </Marker>

        
       {/* 🛵 COURIER */}
        {courier && courier.lat && courier.lng && (
          <Marker position={[courier.lat, courier.lng]}>
            <Popup>
              🛵 Courier <br />
              From: {courier.city || "City"}
            </Popup>
          </Marker>
        )}


      </MapContainer>
    </div>
  );
}
