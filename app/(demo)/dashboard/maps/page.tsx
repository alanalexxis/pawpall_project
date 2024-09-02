"use client";
// LocationPicker.jsx
import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

const LocationPicker = ({ onLocationChange }) => {
  const [position, setPosition] = useState(null); // Inicialmente sin posición
  const [address, setAddress] = useState(""); // Estado para almacenar la dirección

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAERpuLNoqLOK9Kp02Qi7WkX3n6uFM9ezA", // Reemplaza con tu API Key
    libraries,
  });

  const geocodePosition = (pos) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: pos }, (results, status) => {
      if (status === "OK" && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        console.error("Geocoder failed due to: " + status);
        setAddress("No se pudo determinar la dirección.");
      }
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const pos = { lat: latitude, lng: longitude };
          setPosition(pos);
          geocodePosition(pos);
          if (onLocationChange) {
            onLocationChange(pos);
          }
        },
        () => {
          console.error("Error obteniendo la ubicación.");
          setPosition({ lat: 51.505, lng: -0.09 }); // Posición por defecto
          geocodePosition({ lat: 51.505, lng: -0.09 }); // Geocoding para la posición por defecto
        }
      );
    } else {
      console.error("Geolocalización no es soportada por este navegador.");
      setPosition({ lat: 51.505, lng: -0.09 }); // Posición por defecto
      geocodePosition({ lat: 51.505, lng: -0.09 }); // Geocoding para la posición por defecto
    }
  }, [onLocationChange]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded || !position) return <div>Loading...</div>;

  const handleMarkerDragEnd = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const pos = { lat, lng };
    setPosition(pos);
    geocodePosition(pos);
    if (onLocationChange) {
      onLocationChange(pos);
    }
  };

  return (
    <div>
      <h1>Dirección seleccionada: {address}</h1>
      <GoogleMap
        mapContainerStyle={{ height: "400px", width: "100%" }}
        center={position}
        zoom={13}
      >
        <Marker
          position={position}
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
        />
      </GoogleMap>
    </div>
  );
};

export default LocationPicker;
