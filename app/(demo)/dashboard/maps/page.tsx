"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const GoogleMapRouteComponent = () => {
  const [directions, setDirections] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [distance, setDistance] = useState(null);
  const [destination, setDestination] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [routeCalculated, setRouteCalculated] = useState(false);
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");

  const geocodeLatLng = (latLng, callback) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        callback(results[0].formatted_address);
      } else {
        console.error("Geocoder failed due to " + status);
        callback("Address not found");
      }
    });
  };

  const directionsCallback = useCallback(
    (response) => {
      if (response !== null) {
        if (response.status === "OK") {
          setDirections(response);
          const route = response.routes[0].legs[0];
          setTravelTime(route.duration.text);
          setDistance(route.distance.text);
          setRouteCalculated(true);
          geocodeLatLng({ lat: origin.lat, lng: origin.lng }, setOriginAddress);
          geocodeLatLng(
            { lat: destination.lat, lng: destination.lng },
            setDestinationAddress
          );
        } else {
          console.error("Directions request failed due to " + response.status);
        }
      }
    },
    [destination, origin]
  );

  const handleMapClick = (event) => {
    setDestination({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    setRouteCalculated(false);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setOrigin({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={origin || { lat: 37.437041393899676, lng: -4.191635586788259 }}
        zoom={15}
        onClick={handleMapClick}
      >
        {origin && destination && !routeCalculated && (
          <DirectionsService
            options={{
              destination: destination,
              origin: origin,
              travelMode: "WALKING",
            }}
            callback={directionsCallback}
          />
        )}
        {directions && (
          <DirectionsRenderer
            options={{
              directions: directions,
            }}
          />
        )}
      </GoogleMap>
      <h1>
        Dirección origen: {originAddress} <br />
        Dirección destino: {destinationAddress}
      </h1>
      {travelTime && (
        <>
          <p>Tiempo de paseo estimado: {travelTime}</p>
          <p>Distancia estimada: {distance}</p>
        </>
      )}
    </LoadScript>
  );
};

export default GoogleMapRouteComponent;
