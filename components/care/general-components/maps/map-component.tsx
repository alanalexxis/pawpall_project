"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Route, MousePointer } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function GoogleMapRouteComponent({
  onOriginChange,
  onDestinationChange,
}) {
  const [directions, setDirections] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [distance, setDistance] = useState(null);
  const [destination, setDestination] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [routeCalculated, setRouteCalculated] = useState(false);
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [destinationInput, setDestinationInput] = useState("");
  const [autocomplete, setAutocomplete] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const geocodeLatLng = useCallback((latLng, callback) => {
    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results[0]) {
          callback(results[0].formatted_address);
        } else {
          console.error("Geocoder failed due to " + status);
          callback("Address not found");
        }
      });
    } else {
      console.error("Google Maps is not loaded.");
    }
  }, []);

  const directionsCallback = useCallback(
    (response) => {
      if (response !== null && response.status === "OK") {
        setDirections(response);
        const route = response.routes[0].legs[0];
        setTravelTime(route.duration.text);
        setDistance(route.distance.text);
        setRouteCalculated(true);
        geocodeLatLng({ lat: origin.lat, lng: origin.lng }, (address) => {
          setOriginAddress(address);
          onOriginChange(address); // Update origin in parent component
        });
        geocodeLatLng(
          { lat: destination.lat, lng: destination.lng },
          (address) => {
            setDestinationAddress(address);
            onDestinationChange(address); // Update destination in parent component
          }
        );
      } else {
        console.error("Directions request failed due to " + response?.status);
      }
    },
    [destination, origin, geocodeLatLng, onOriginChange, onDestinationChange]
  );
  const handleSetDestination = () => {
    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: destinationInput }, (results, status) => {
        if (status === "OK" && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          setDestination({ lat: lat(), lng: lng() });
          setRouteCalculated(false);
        } else {
          console.error("Geocoding failed due to " + status);
        }
      });
    }
  };

  const handleMapClick = (event) => {
    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();
    setDestination({ lat: clickedLat, lng: clickedLng });
    setRouteCalculated(false);
    geocodeLatLng({ lat: clickedLat, lng: clickedLng }, (address) => {
      setDestinationAddress(address);
      setDestinationInput(address);
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const initialPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setOrigin(initialPosition);
        geocodeLatLng(initialPosition, setOriginAddress);
        setIsLoading(false);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  }, [geocodeLatLng]);

  useEffect(() => {
    if (window.google && window.google.maps) {
      const input = document.getElementById("destination-input");
      if (input) {
        const autocomplete = new window.google.maps.places.Autocomplete(input);
        setAutocomplete(autocomplete);
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          handlePlaceSelect(place);
        });
      }
    }
  }, [window.google]);

  const handlePlaceSelect = (place) => {
    if (place.geometry) {
      setDestination({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
      setDestinationInput(place.formatted_address);
      setRouteCalculated(false);
      geocodeLatLng(
        {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
        (address) => {
          setDestinationAddress(address);
        }
      );
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setDestinationInput(value);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Planificador de ruta de paseos.</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={
              origin || { lat: 37.437041393899676, lng: -4.191635586788259 }
            }
            zoom={15}
            onClick={handleMapClick}
          >
            {origin && <Marker position={origin} />}
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
              <DirectionsRenderer options={{ directions: directions }} />
            )}
          </GoogleMap>
        )}

        <div className="mt-4 space-y-4">
          <div className="flex items-center space-x-2">
            <MapPin className="text-primary" />
            <Input
              id="destination-input"
              type="text"
              placeholder="Ingrese el destino"
              value={destinationInput}
              onChange={handleInputChange}
            />
            <Button onClick={handleSetDestination}>Establecer destino</Button>
          </div>
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto w-full">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handlePlaceSelect(suggestion)}
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MousePointer size={16} />
            <span>O haga clic en el mapa para seleccionar el destino</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="font-semibold">Origen:</p>
              <p>{originAddress || "Cargando..."}</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Destino:</p>
              <p>{destinationAddress || "No establecido"}</p>
            </div>
          </div>
          {travelTime && distance && (
            <div className="bg-primary/10 p-4 rounded-md">
              <div className="flex items-center space-x-2">
                <Clock className="text-primary" />
                <p>
                  Tiempo estimado de caminata: <strong> {travelTime}</strong>
                </p>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Route className="text-primary" />
                <p>
                  Distancia estimada: <strong>{distance}</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
