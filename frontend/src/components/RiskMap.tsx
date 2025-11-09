import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RiskArea, RiskLevel, formatNumber } from "../types/api";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface RiskMapProps {
  data: RiskArea[];
  selectedZone?: RiskArea | null;
  onZoneSelect?: (zone: RiskArea) => void;
  showLegend?: boolean;
}

// Component to handle map zoom to selected zone
const ZoomToZone = ({ zone }: { zone: RiskArea | null }) => {
  const map = useMap();

  useEffect(() => {
    if (zone) {
      map.setView([zone.latitude, zone.longitude], 13, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [zone, map]);

  return null;
};

const RiskMap = ({
  data,
  selectedZone = null,
  onZoneSelect,
  showLegend = true,
}: RiskMapProps) => {
  const center: [number, number] = [18.52, 73.86]; // Pune center

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border shadow-lg">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomToZone zone={selectedZone} />

        {data.map((area) => {
          const isSelected = selectedZone?.pincode === area.pincode;

          return (
            <CircleMarker
              key={area.pincode}
              center={[area.latitude, area.longitude]}
              radius={isSelected ? 14 : 8 + area.risk_level * 2}
              pathOptions={{
                color: isSelected ? "#3b82f6" : "#fff",
                fillColor: area.color,
                fillOpacity: isSelected ? 1 : 0.7,
                weight: isSelected ? 3 : 2,
              }}
              eventHandlers={{
                click: () => onZoneSelect?.(area),
                mouseover: (e) => {
                  e.target.setStyle({
                    fillOpacity: 1,
                    weight: 3,
                  });
                },
                mouseout: (e) => {
                  if (!isSelected) {
                    e.target.setStyle({
                      fillOpacity: 0.7,
                      weight: 2,
                    });
                  }
                },
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -10]}
                className="custom-tooltip"
              >
                <div className="text-xs font-medium">
                  <div className="font-bold text-sm mb-1">
                    Pincode: {area.pincode}
                  </div>
                  <div className="space-y-0.5">
                    <div>🌡️ Temp: {area.temperature}°C</div>
                    <div>💧 Humidity: {area.humidity}%</div>
                    <div>⚠️ Risk: {area.risk_label}</div>
                    <div>👥 Population: {formatNumber(area.population)}</div>
                    <div className="text-muted-foreground text-[10px] mt-1">
                      Click for details
                    </div>
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      {showLegend && (
        <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-800/95 px-4 py-3 rounded-lg border shadow-lg z-[1000] backdrop-blur-sm">
          <h4 className="font-semibold mb-2 text-sm">Risk Levels</h4>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 border border-white"></span>
              <span>Caution</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500 border border-white"></span>
              <span>Extreme Caution</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 border border-white"></span>
              <span>Danger</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 border border-white"></span>
              <span>Extreme Danger</span>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-800/95 px-4 py-2 rounded-lg border shadow-lg z-[1000] backdrop-blur-sm">
        <div className="text-sm">
          <span className="font-semibold">{data.length}</span> areas monitored
        </div>
        {selectedZone && (
          <div className="text-xs text-muted-foreground mt-1">
            Selected:{" "}
            <span className="font-medium">{selectedZone.pincode}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskMap;
