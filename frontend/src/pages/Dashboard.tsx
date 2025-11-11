import {
  getRiskMap,
  getRiskForecast,
  getPincodeDetails,
  getStatistics,
  formatTemperature,
  formatHumidity,
  formatNumber,
  calculateVulnerablePopulation,
  type RiskArea,
  type RiskLevel,
  type StatisticsResponse,
  type PincodeDetailsResponse,
  type ForecastItem,
} from "../types/api";
import Navbar from "../components/Navbar";
import RiskBadge from "../components/RiskBadge";
import DataCard from "../components/DataCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Loader2,
  RefreshCw,
  AlertTriangle,
  Search,
  Thermometer,
  Droplets,
  Users,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ZoomToZone = ({ zone }: { zone: RiskArea | null }) => {
  const map = useMap();
  useEffect(() => {
    if (zone) {
      map.setView([zone.latitude, zone.longitude], 13, {
        animate: true,
      });
    }
  }, [zone, map]);
  return null;
};

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [riskMap, setRiskMap] = useState<RiskArea[]>([]);
  const [statistics, setStatistics] = useState<StatisticsResponse | null>(null);
  const [selectedZone, setSelectedZone] = useState<RiskArea | null>(null);
  const [selectedPincodeDetails, setSelectedPincodeDetails] =
    useState<PincodeDetailsResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [forecastDays, setForecastDays] = useState<1 | 5>(1);
  const [searchPincode, setSearchPincode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchSuccess, setSearchSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery && riskMap.length > 0) {
      performSearch(searchQuery);
      setSearchParams({});
    }
  }, [searchParams, riskMap]);

  useEffect(() => {
    if (forecastDays === 5) loadForecast();
  }, [forecastDays]);

  useEffect(() => {
    if (selectedZone) loadPincodeDetails(selectedZone.pincode);
  }, [selectedZone]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [riskMapData, statsData] = await Promise.all([
        getRiskMap(),
        getStatistics(),
      ]);
      setRiskMap(riskMapData.risk_map);
      setStatistics(statsData);

      const highRiskZone =
        riskMapData.risk_map.find((z) => z.risk_level >= 2) ||
        riskMapData.risk_map[0];
      setSelectedZone(highRiskZone);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const loadForecast = async () => {
    try {
      const forecastData = await getRiskForecast(5);
      setForecast(forecastData.forecast);
    } catch (err) {
      console.error("Forecast error:", err);
    }
  };

  const loadPincodeDetails = async (pincode: number) => {
    try {
      const details = await getPincodeDetails(pincode);
      setSelectedPincodeDetails(details);
    } catch (err) {
      console.error("Pincode details error:", err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    if (forecastDays === 5) await loadForecast();
    setRefreshing(false);
  };

  const performSearch = (pincodeStr: string) => {
    const pincode = parseInt(pincodeStr.trim());

    if (isNaN(pincode)) {
      setError("Please enter a valid pincode number");
      setSearchSuccess(false);
      setTimeout(() => setError(null), 3000);
      return;
    }

    const zone = riskMap.find((z) => z.pincode === pincode);

    if (zone) {
      setSelectedZone(zone);
      setSearchPincode("");
      setError(null);
      setSearchSuccess(true);

      setTimeout(() => setSearchSuccess(false), 3000);

      setTimeout(() => {
        if (window.innerWidth < 1024) {
          document.querySelector(".leaflet-container")?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    } else {
      setError(`Pincode ${pincode} not found. `);
      setSearchSuccess(false);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleSearch = () => {
    if (!searchPincode.trim()) {
      setError("Please enter a pincode");
      setTimeout(() => setError(null), 2000);
      return;
    }
    performSearch(searchPincode);
  };

  const getCityWideRiskLevel = (): RiskLevel => {
    if (!statistics) return 0;
    const ratio = statistics.high_risk_areas / statistics.total_areas;
    if (ratio >= 0.5) return 3;
    if (ratio >= 0.3) return 2;
    if (ratio >= 0.1) return 1;
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar alertCount={statistics?.high_risk_areas || 0} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Live Risk Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Real-time monitoring • Last updated: {statistics?.date}
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="lg"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh Data
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {searchSuccess && selectedZone && (
          <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Found Pincode {selectedZone.pincode} - Risk Level:{" "}
              <strong>{selectedZone.risk_label}</strong>
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="max-w-2xl">
              <label className="text-sm font-medium mb-2 block">
                Search by Pincode
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Enter 6-digit pincode (e.g., 411001)"
                    className="pl-12 h-12"
                    value={searchPincode}
                    onChange={(e) => setSearchPincode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    type="text"
                    maxLength={6}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  size="lg"
                  disabled={!searchPincode.trim()}
                  className="px-8"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              {riskMap.length > 0 && (
                <div className="mt-3 text-xs text-muted-foreground"></div>
              )}
            </div>
          </CardContent>
        </Card>

        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DataCard
              title="Average Temperature"
              value={formatTemperature(statistics.average_temperature)}
              icon={Thermometer}
              description="Across all monitored areas"
              variant={
                parseFloat(statistics.average_temperature) > 35
                  ? "warning"
                  : "default"
              }
              trend="up"
              trendValue="+2.3°C from yesterday"
            />
            <DataCard
              title="Average Humidity"
              value={formatHumidity(statistics.average_humidity)}
              icon={Droplets}
              description="Current humidity level"
            />
            <DataCard
              title="High Risk Areas"
              value={statistics.high_risk_areas}
              icon={AlertTriangle}
              description={`Out of ${statistics.total_areas} total zones`}
              variant="danger"
            />
            <DataCard
              title="Affected Population"
              value={formatNumber(statistics.affected_population)}
              icon={Users}
              description="People in high-risk zones"
              trend="up"
              trendValue="+15K from last week"
            />
          </div>
        )}

        {statistics && statistics.high_risk_areas > 0 && (
          <Card className="mb-8 border-red-500 border-2 bg-red-50 dark:bg-red-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                City-Wide Heatwave Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 flex-wrap">
                <RiskBadge level={getCityWideRiskLevel()} size="lg" />
                <div className="flex-1">
                  <p className="text-red-900 dark:text-red-100 font-medium">
                    <strong>{statistics.high_risk_areas}</strong> zones at high
                    risk affecting{" "}
                    <strong>
                      {formatNumber(statistics.affected_population)}
                    </strong>{" "}
                    people.
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    ⚠️ Take immediate precautions. Stay hydrated and avoid peak
                    sun hours (11 AM - 4 PM).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Pune Heat Risk Zones
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {riskMap.length} areas monitored
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="w-full h-[600px] rounded-lg overflow-hidden border shadow-lg relative">
                  <MapContainer
                    center={[18.52, 73.86] as LatLngExpression}
                    zoom={11}
                    scrollWheelZoom={true}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <ZoomToZone zone={selectedZone} />

                    {riskMap.map((zone) => (
                      <CircleMarker
                        key={zone.pincode}
                        center={[zone.latitude, zone.longitude]}
                        radius={8 + zone.risk_level * 2}
                        pathOptions={{
                          color:
                            selectedZone?.pincode === zone.pincode
                              ? "#000"
                              : "#fff",
                          fillColor: zone.color,
                          fillOpacity:
                            selectedZone?.pincode === zone.pincode ? 1 : 0.7,
                          weight:
                            selectedZone?.pincode === zone.pincode ? 3 : 2,
                        }}
                        eventHandlers={{
                          click: () => {
                            setSelectedZone(zone);
                            setSearchSuccess(true);
                            setTimeout(() => setSearchSuccess(false), 3000);
                          },
                          mouseover: (e) => {
                            e.target.setStyle({ fillOpacity: 1 });
                          },
                          mouseout: (e) => {
                            const opacity =
                              selectedZone?.pincode === zone.pincode ? 1 : 0.7;
                            e.target.setStyle({ fillOpacity: opacity });
                          },
                        }}
                      >
                        <Tooltip>
                          <div className="text-xs font-medium">
                            <strong>Pincode: {zone.pincode}</strong>
                            <br />
                            🌡️ {zone.temperature.toFixed(1)}°C
                            <br />
                            💧 {zone.humidity.toFixed(0)}%
                            <br />
                            ⚠️ {zone.risk_label}
                            <br />
                            👥 {formatNumber(zone.population)} people
                            <br />
                            👴 {zone.elderly_percent.toFixed(1)}% elderly
                          </div>
                        </Tooltip>
                      </CircleMarker>
                    ))}
                  </MapContainer>

                  <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-800/95 px-4 py-3 rounded-lg text-xs border shadow-lg z-[1000]">
                    <h4 className="font-semibold mb-2">Risk Levels</h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span>Caution (Level 0)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                        <span>Extreme Caution (Level 1)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                        <span>Danger (Level 2)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span>Extreme Danger (Level 3)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  💡 Click on any circle to view detailed information for that
                  area
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {selectedZone && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Selected Zone Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">
                        Pincode {selectedZone.pincode}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        📍 {selectedZone.latitude.toFixed(4)},{" "}
                        {selectedZone.longitude.toFixed(4)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">
                        Current Risk Status:
                      </p>
                      <RiskBadge level={selectedZone.risk_level as RiskLevel} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Temperature</p>
                        <span className="text-2xl font-bold">
                          {selectedZone.temperature.toFixed(1)}°C
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Humidity</p>
                        <span className="text-2xl font-bold">
                          {selectedZone.humidity.toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        variant={forecastDays === 1 ? "default" : "outline"}
                        onClick={() => setForecastDays(1)}
                        className="flex-1"
                      >
                        Today
                      </Button>
                      <Button
                        variant={forecastDays === 5 ? "default" : "outline"}
                        onClick={() => setForecastDays(5)}
                        className="flex-1"
                      >
                        7-Day Forecast
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <DataCard
                  title="Total Population"
                  value={formatNumber(selectedZone.population)}
                  icon={Users}
                  description={`${selectedZone.elderly_percent.toFixed(
                    1
                  )}% elderly residents`}
                />

                <DataCard
                  title="Vulnerable Population"
                  value={formatNumber(
                    calculateVulnerablePopulation(
                      selectedZone.population,
                      selectedZone.elderly_percent
                    )
                  )}
                  icon={AlertTriangle}
                  description="Elderly residents at high risk"
                  variant={selectedZone.risk_level >= 2 ? "danger" : "default"}
                />

                {forecastDays === 5 &&
                selectedPincodeDetails &&
                selectedPincodeDetails.forecast &&
                selectedPincodeDetails.forecast.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        7-Day Weather Forecast
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedPincodeDetails.forecast
                          .slice(0, 7)
                          .map((day, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between py-2 border-b last:border-0"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {idx === 0
                                    ? "Today"
                                    : idx === 1
                                    ? "Tomorrow"
                                    : new Date(day.date).toLocaleDateString(
                                        "en-US",
                                        {
                                          weekday: "short",
                                          month: "short",
                                          day: "numeric",
                                        }
                                      )}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  🌡️ {day.temperature.toFixed(1)}°C • 💧{" "}
                                  {day.humidity.toFixed(0)}%
                                </p>
                              </div>
                              <RiskBadge
                                level={day.risk_level as RiskLevel}
                                size="sm"
                                showIcon={false}
                              />
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : forecastDays === 5 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Loading Forecast...
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
