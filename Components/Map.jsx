"use client"; // Ensure this runs only on the client side

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

// Fix default marker icon issue in Leaflet (Next.js doesn't load icons correctly)
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

// React hooks
import { useEffect } from "react";

const Maps = ({ position }) => {
  const markerIcon = new L.Icon({
    iconUrl: markerIconPng.src,
    shadowUrl: markerShadowPng.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const FlyToMarker = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.flyTo(position, map.getZoom(), { animate: true, duration: 1.5 });
      }
    }, [position, map]);

    return null;
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      attributionControl={false}
      className="h-100 w-100"
      style={{ zIndex: "1" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FlyToMarker position={position} />
      <Marker position={position} icon={markerIcon}>
        <Popup>Your Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Maps;
