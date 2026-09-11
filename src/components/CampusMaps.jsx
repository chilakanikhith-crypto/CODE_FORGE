import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibreWorker from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

maplibregl.setWorkerUrl(maplibreWorker);

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;

const STREET_STYLE =
  `https://api.maptiler.com/maps/streets-v4/style.json?key=${MAPTILER_KEY}`;

const SATELLITE_STYLE =
  `https://api.maptiler.com/maps/satellite-v4/style.json?key=${MAPTILER_KEY}`;

// =====================================================
// GRIET CAMPUS LOCATIONS
// =====================================================

const locations = [
  // BLOCK 4
  {
    id: "Block 4",
    type: "building",
    name: "Block 4",
    departments: "ECE • EEE • Civil • Mechanical",
    position: [78.36786, 17.52202],
    icon: "🏢",
  },

  // BLOCK 1
  {
    id: "Block 1",
    type: "building",
    name: "Block 1",
    departments: "CSE",
    position: [78.367262, 17.52145],
    icon: "🏢",
  },

  // BLOCK 2
  {
    id: "Block 2",
    type: "building",
    name: "Block 2",
    departments: "AIML • DS • CSBS",
    position: [78.36645, 17.52103],
    icon: "🏢",
  },

  // BLOCK 3
  {
    id: "Block 3",
    type: "building",
    name: "Block 3",
    departments: "IT • Humanities • Administration",
    position: [78.36740, 17.52032],
    icon: "🏢",
  },

  // RO SYSTEM
  {
    id: "RO",
    type: "facility",
    name: "RO System",
    position: [78.36580, 17.52110],
    icon: "💧",
  },

  // CANTEEN
  {
    id: "CANTEEN",
    type: "facility",
    name: "Canteen",
    position: [78.3666564, 17.5203451],
    icon: "🍽️",
  },

  // PHARMACY
  {
    id: "PHARMACY",
    type: "facility",
    name: "Pharmacy",
    position: [78.36884, 17.52050],
    icon: "💊",
  },

  // SEWAGE TREATMENT PLANT
  {
    id: "SEWAGE",
    type: "facility",
    name: "Sewage Treatment Plant",
    position: [78.36575, 17.51921],
    icon: "♻️",
  },

  // COMMON CAMPUS PARKING
  {
    id: "PARKING",
    type: "parking",
    name: "Campus Parking",
    position: [78.36800, 17.52092],
    icon: "🅿️",
  },

  // HALL 1
  {
    id: "Hall 1",
    type: "hall",
    name: "Hall 1",
    position: [78.36795, 17.51932],
  },

  // HALL 2
  {
    id: "Hall 2",
    type: "hall",
    name: "Hall 2",
    position: [78.36830, 17.51932],
  },

  // HALL 3
  {
    id: "Hall 3",
    type: "hall",
    name: "Hall 3",
    position: [78.36830, 17.51902],
  },

  // HALL 4
  {
    id: "Hall 4",
    type: "hall",
    name: "Hall 4",
    position: [78.36795, 17.51902],
  },

  // MAIN GATE
  {
    id: "GATE",
    type: "gate",
    name: "Main Gate",
    position: [78.36859, 17.51908],
    icon: "⛩️",
  },

  // GOKARAJU LAILAVATHI ENGINEERING COLLEGE
  {
    id: "GLEC",
    type: "college",
    name: "Gokaraju Lailavathi Engineering College",
    position: [78.36555, 17.52065],
    icon: "🎓",
  },
];

// =====================================================
// MARKER SCALE
// =====================================================

function getMarkerScale(zoom) {
  if (zoom <= 15) return 0.72;
  if (zoom <= 16) return 0.82;
  if (zoom <= 17) return 0.92;
  if (zoom <= 18) return 1;
  if (zoom <= 19) return 1.08;
  return 1.15;
}

// =====================================================
// CREATE MARKER ELEMENT
// =====================================================

function createMarkerElement(location, onClick) {
  const wrapper = document.createElement("div");

  wrapper.className =
    `campus-marker campus-marker-${location.type}`;

  const content = document.createElement("div");

  content.className = "campus-marker-content";

  // ===================================================
  // BUILDING MARKER
  // ===================================================

  if (location.type === "building") {
    content.innerHTML = `
      <div class="building-pin">
        <div class="building-icon">
          ${location.icon}
        </div>

        <div class="building-label">
          ${location.id}
        </div>
      </div>
    `;
  }

  // ===================================================
  // HALL MARKER
  // ===================================================

  else if (location.type === "hall") {
    content.innerHTML = `
      <div class="hall-pin">
        <div class="hall-label">
          ${location.id}
        </div>
      </div>
    `;
  }

  // ===================================================
  // GLEC MARKER
  // ===================================================

  else if (location.type === "college") {
    content.innerHTML = `
      <div class="college-pin">
        <div class="college-icon">
          ${location.icon}
        </div>

        <div class="college-label">
          GLEC
        </div>
      </div>
    `;
  }

  // ===================================================
  // FACILITY / PARKING / GATE
  // ===================================================

  else {
    content.innerHTML = `
      <div class="facility-pin">
        <div class="facility-icon">
          ${location.icon}
        </div>

        <div class="facility-label">
          ${location.name}
        </div>
      </div>
    `;
  }

  wrapper.appendChild(content);

  // ===================================================
  // CLICK
  // ===================================================

  wrapper.addEventListener("click", (event) => {
    event.stopPropagation();
    onClick(location);
  });

  return wrapper;
}

// =====================================================
// CAMPUS MAP COMPONENT
// =====================================================

export default function CampusMaps({
  onBuildingClick,
  darkMode,
}) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // Street is default for Light Mode
  const [mapStyle, setMapStyle] = useState("street");

  const [selectedLocation, setSelectedLocation] =
    useState(null);

  // ===================================================
  // LOCATION CLICK
  // ===================================================

  const handleLocationClick = (location) => {
    setSelectedLocation(location);

    if (location.type === "building") {
      if (onBuildingClick) {
        onBuildingClick(location);
      }

      window.dispatchEvent(
        new CustomEvent("open-campus-analytics", {
          detail: location,
        })
      );
    }
  };

  // ===================================================
  // UPDATE MARKER SCALE
  // ===================================================

  const updateMarkerScale = (zoom) => {
    const scale = getMarkerScale(zoom);

    markersRef.current.forEach(({ element }) => {
      const content = element.querySelector(
        ".campus-marker-content"
      );

      if (content) {
        content.style.transform = `scale(${scale})`;
      }
    });
  };

  // ===================================================
  // INITIALIZE MAP
  // ===================================================

  useEffect(() => {
    if (!mapContainer.current) return;

    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,

      style: STREET_STYLE,

      center: [
        78.36705,
        17.52030,
      ],

      zoom: 16.5,

      pitch: 0,

      bearing: 0,

      attributionControl: true,
    });

    mapRef.current = map;

    // =================================================
    // NAVIGATION CONTROL
    // =================================================

    map.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
      }),
      "top-right"
    );

    // =================================================
    // MAP LOAD
    // =================================================

    map.on("load", () => {
      locations.forEach((location) => {
        const element = createMarkerElement(
          location,
          handleLocationClick
        );

        const marker = new maplibregl.Marker({
          element,
          anchor: "center",
        })
          .setLngLat(location.position)
          .addTo(map);

        markersRef.current.push({
          marker,
          element,
        });
      });

      updateMarkerScale(map.getZoom());
    });

    // =================================================
    // ZOOM
    // =================================================

    map.on("zoom", () => {
      updateMarkerScale(map.getZoom());
    });

    // =================================================
    // CLEANUP
    // =================================================

    return () => {
      markersRef.current.forEach(({ marker }) => {
        marker.remove();
      });

      markersRef.current = [];

      map.remove();

      mapRef.current = null;
    };
  }, []);

  // ===================================================
  // CHANGE MAP STYLE
  // ===================================================

  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    const style =
      mapStyle === "satellite"
        ? SATELLITE_STYLE
        : STREET_STYLE;

    map.setStyle(style);
  }, [mapStyle]);

  // ===================================================
  // RETURN UI
  // ===================================================

  return (
    <div
      className={`
        campus-map-wrapper
        ${
          darkMode
            ? "campus-map-dark"
            : "campus-map-light"
        }
      `}
    >
      {/* =================================================
          MAP
      ================================================= */}

      <div
        ref={mapContainer}
        className="campus-map"
      />

      {/* =================================================
          MAP STYLE BUTTONS
      ================================================= */}

      <div className="map-style-buttons">
        <button
          type="button"
          className={
            mapStyle === "satellite"
              ? "map-style-button active"
              : "map-style-button"
          }
          onClick={() => setMapStyle("satellite")}
        >
          🛰️ Satellite
        </button>

        <button
          type="button"
          className={
            mapStyle === "street"
              ? "map-style-button active"
              : "map-style-button"
          }
          onClick={() => setMapStyle("street")}
        >
          🗺️ Street
        </button>
      </div>

      {/* =================================================
          SELECTED LOCATION
      ================================================= */}

      {selectedLocation && (
        <div className="selected-location">
          <button
            type="button"
            className="close-location"
            onClick={() =>
              setSelectedLocation(null)
            }
          >
            ×
          </button>

          <div className="selected-title">
            {selectedLocation.name}
          </div>

          {selectedLocation.departments && (
            <div className="selected-departments">
              {selectedLocation.departments}
            </div>
          )}

          {selectedLocation.type === "building" && (
            <button
              type="button"
              className="analytics-button"
              onClick={() => {
                if (onBuildingClick) {
                  onBuildingClick(selectedLocation);
                }

                window.dispatchEvent(
                  new CustomEvent(
                    "open-campus-analytics",
                    {
                      detail: selectedLocation,
                    }
                  )
                );
              }}
            >
              📊 Open AI Analytics
            </button>
          )}
        </div>
      )}

      {/* =================================================
          CSS
      ================================================= */}

      <style>{`

        /* =========================================
           MAP
        ========================================= */

        .campus-map-wrapper {
          position: relative;
          width: 100%;
          height: 620px;
          overflow: hidden;
          border-radius: 18px;
          transition:
            background 0.3s ease,
            box-shadow 0.3s ease;
        }

        .campus-map-light {
          background: #f1f5f9;
        }

        .campus-map-dark {
          background: #0f172a;
        }

        .campus-map {
          width: 100%;
          height: 100%;
        }

        /* =========================================
           MARKERS
        ========================================= */

        .campus-marker {
          cursor: pointer;
          user-select: none;
        }

        .campus-marker-content {
          transform-origin: center center;
          transition: transform 0.15s ease;
          pointer-events: auto;
        }

        /* =========================================
           BUILDING MARKER
        ========================================= */

        .building-pin {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }

        .building-icon {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: rgba(255, 255, 255, 0.96);

          border: 3px solid #111827;

          border-radius: 50%;

          font-size: 21px;

          box-shadow:
            0 3px 8px
            rgba(0, 0, 0, 0.35);
        }

        .building-label {
          min-width: 34px;

          padding: 3px 7px;

          border-radius: 6px;

          background: #111827;

          color: white;

          font-size: 11px;

          font-weight: 800;

          text-align: center;

          box-shadow:
            0 2px 5px
            rgba(0, 0, 0, 0.3);
        }

        /* =========================================
           HALL MARKER
        ========================================= */

        .hall-pin {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #2563eb;

          border: 3px solid white;

          border-radius:
            50%
            50%
            50%
            0;

          transform:
            rotate(-45deg);

          box-shadow:
            0 3px 8px
            rgba(0, 0, 0, 0.4);
        }

        .hall-label {
          color: white;

          font-size: 11px;

          font-weight: 900;

          transform:
            rotate(45deg);
        }

        /* =========================================
           COLLEGE MARKER
        ========================================= */

        .college-pin {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }

        .college-icon {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: white;

          border: 3px solid #7c3aed;

          border-radius: 50%;

          font-size: 21px;

          box-shadow:
            0 3px 8px
            rgba(0, 0, 0, 0.35);
        }

        .college-label {
          background: #7c3aed;

          color: white;

          padding: 4px 7px;

          border-radius: 6px;

          font-size: 10px;

          font-weight: 900;

          white-space: nowrap;

          box-shadow:
            0 2px 5px
            rgba(0, 0, 0, 0.3);
        }

        /* =========================================
           FACILITIES
        ========================================= */

        .facility-pin {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }

        .facility-icon {
          width: 38px;
          height: 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: white;

          border: 2px solid #374151;

          border-radius: 50%;

          font-size: 19px;

          box-shadow:
            0 3px 8px
            rgba(0, 0, 0, 0.35);
        }

        .facility-label {
          background:
            rgba(17, 24, 39, 0.94);

          color: white;

          padding: 3px 6px;

          border-radius: 5px;

          font-size: 8px;

          font-weight: 800;

          white-space: nowrap;

          text-transform: uppercase;
        }

        /* =========================================
           MAP STYLE BUTTONS
        ========================================= */

        .map-style-buttons {
          position: absolute;

          top: 15px;
          left: 15px;

          display: flex;

          gap: 7px;

          z-index: 10;
        }

        .map-style-button {
          border: 1px solid transparent;

          padding: 9px 13px;

          border-radius: 9px;

          font-size: 12px;

          font-weight: 700;

          cursor: pointer;

          box-shadow:
            0 2px 8px
            rgba(0, 0, 0, 0.25);

          transition:
            background 0.3s ease,
            color 0.3s ease,
            border 0.3s ease;
        }

        .campus-map-light .map-style-button {
          background: rgba(255, 255, 255, 0.95);
          color: #111827;
          border-color: #cbd5e1;
        }

        .campus-map-dark .map-style-button {
          background: rgba(15, 23, 42, 0.95);
          color: #e2e8f0;
          border-color: #334155;
        }

        .campus-map-light .map-style-button:hover {
          background: white;
        }

        .campus-map-dark .map-style-button:hover {
          background: #1e293b;
        }

        .map-style-button.active {
          background: #06b6d4 !important;
          color: white !important;
          border-color: #06b6d4 !important;
        }

        /* =========================================
           SELECTED LOCATION
        ========================================= */

        .selected-location {
          position: absolute;

          bottom: 18px;
          left: 18px;

          min-width: 250px;

          padding: 15px 17px;

          border-radius: 12px;

          box-shadow:
            0 5px 18px
            rgba(0, 0, 0, 0.3);

          z-index: 20;

          transition:
            background 0.3s ease,
            color 0.3s ease,
            border 0.3s ease;
        }

        .campus-map-light .selected-location {
          background: rgba(255, 255, 255, 0.97);
          border: 1px solid #cbd5e1;
          color: #111827;
        }

        .campus-map-dark .selected-location {
          background: rgba(15, 23, 42, 0.97);
          border: 1px solid #334155;
          color: white;
        }

        .selected-title {
          font-size: 16px;

          font-weight: 800;
        }

        .campus-map-light .selected-title {
          color: #111827;
        }

        .campus-map-dark .selected-title {
          color: white;
        }

        .selected-departments {
          margin-top: 5px;

          font-size: 12px;
        }

        .campus-map-light .selected-departments {
          color: #4b5563;
        }

        .campus-map-dark .selected-departments {
          color: #94a3b8;
        }

        /* =========================================
           ANALYTICS BUTTON
        ========================================= */

        .analytics-button {
          margin-top: 10px;

          border: none;

          background: #2563eb;

          color: white;

          padding: 8px 12px;

          border-radius: 7px;

          font-size: 12px;

          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .analytics-button:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        /* =========================================
           CLOSE BUTTON
        ========================================= */

        .close-location {
          position: absolute;

          top: 7px;
          right: 8px;

          width: 24px;
          height: 24px;

          border: none;

          background: transparent;

          font-size: 20px;

          cursor: pointer;
        }

        .campus-map-light .close-location {
          color: #6b7280;
        }

        .campus-map-dark .close-location {
          color: #94a3b8;
        }

        .campus-map-light .close-location:hover {
          color: #111827;
        }

        .campus-map-dark .close-location:hover {
          color: white;
        }

        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 768px) {
          .campus-map-wrapper {
            height: 500px;
          }

          .map-style-buttons {
            top: 10px;
            left: 10px;
          }

          .map-style-button {
            padding: 7px 9px;
            font-size: 10px;
          }

          .selected-location {
            left: 10px;
            right: 10px;
            bottom: 10px;
            min-width: auto;
          }
        }

      `}</style>
    </div>
  );
}