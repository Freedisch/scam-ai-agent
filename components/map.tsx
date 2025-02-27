// components/Map.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Call } from '@/components/sidebar';  // Import the Call type

// Add this line to include the type definitions
/// <reference types="@types/google.maps" />

interface MapProps {
  selectedCall: Call | null;
}

const Map: React.FC<MapProps> = ({ selectedCall }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: `${process.env.GOOGLE_API_KEY}`, 
      version: "weekly",
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const mapOptions: google.maps.MapOptions = {
          center: { lat: -1.9441, lng: 30.0619 },
          zoom: 12,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#e0e0e0" }] }, // Light gray background
            { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] }, // White text stroke
            { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] }, // Dark gray text
            {
              featureType: "administrative.locality",
              elementType: "labels.text.fill",
              stylers: [{ color: "#757575" }], // Medium gray for locality text
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [{ color: "#757575" }], // Medium gray for POI text
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#d5d5d5" }], // Light gray for parks
            },
            {
              featureType: "poi.park",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9e9e9e" }], // Medium gray for park labels
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#f0f0f0" }], // Very light gray for roads
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#d0d0d0" }], // Light gray for road borders
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#757575" }], // Medium gray for road labels
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#c0c0c0" }], // Medium gray for highways
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#b0b0b0" }], // Slightly darker gray for highway borders
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.fill",
              stylers: [{ color: "#616161" }], // Dark gray for highway labels
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#d5d5d5" }], // Light gray for transit areas
            },
            {
              featureType: "transit.station",
              elementType: "labels.text.fill",
              stylers: [{ color: "#757575" }], // Medium gray for transit labels
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#b0b0b0" }], // Medium gray for water bodies
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9e9e9e" }], // Medium gray for water labels
            },
            {
              featureType: "water",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#ffffff" }], // White stroke for water labels
            },
          ],
          mapTypeControl: false,
          streetViewControl: true,
          fullscreenControl: false,
          zoomControl: false,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
          },
          scaleControl: true,
          // scaleControlOptions: {
          //   position: google.maps.ControlPosition.BOTTOM_RIGHT
          // }
        };

        const newMap = new google.maps.Map(mapRef.current, mapOptions);
        setMap(newMap);

        const newInfoWindow = new google.maps.InfoWindow();
        setInfoWindow(newInfoWindow);
      }
    });
  }, []);

  useEffect(() => {
    if (map && selectedCall) {
      const position = { lat: selectedCall.location.lat, lng: selectedCall.location.lng };
      
      const svgMarker = {
        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
        fillColor: "#FF0000",
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "#FFFFFF",
        scale: 2,
        anchor: new google.maps.Point(12, 24),
      };
      // Custom easing function for smooth animation
      const easing = (t: number) => t * (2 - t);
      
      // Animate the transition
      const animate = (startTime: number) => {
        const time = Date.now() - startTime;
        const duration = 1000; // Animation duration in milliseconds
        
        if (time < duration) {
          const t = easing(time / duration);
          const currentCenter = map.getCenter();
          if (currentCenter) {
            const lat = currentCenter.lat() + (position.lat - currentCenter.lat()) * t;
            const lng = currentCenter.lng() + (position.lng - currentCenter.lng()) * t;
            map.panTo({ lat, lng });
          }
          requestAnimationFrame(() => animate(startTime));
        } else {
          map.panTo(position);
          map.setZoom(16);
        }
      };
      
      animate(Date.now());

      if (marker) {
        // If marker exists, animate its movement
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => {
          marker.setAnimation(null);
          marker.setPosition(position);
        }, 500);
      } else {
        // If no marker exists, create a new one
        const newMarker = new google.maps.Marker({
          position: position,
          map: map,
          icon: svgMarker,
          animation: google.maps.Animation.DROP,
        });
        setMarker(newMarker);
      }
    }
  }, [map, marker, selectedCall]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default Map;