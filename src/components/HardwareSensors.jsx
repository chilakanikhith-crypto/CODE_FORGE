import React, { useState, useEffect, useRef } from "react";
import {
  Cpu,
  Radio,
  Zap,
  Droplets,
  Thermometer,
  Eye,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Send,
  Sliders,
  Play,
  Square,
  ShieldCheck,
} from "lucide-react";

export default function HardwareSensors({
  darkMode,
  onTriggerAlert,
  onIncrementStudent,
}) {
  const [isConnected, setIsConnected] = useState(true);
  const [selectedPort, setSelectedPort] = useState("COM3 (ESP32-WROOM-32D)");
  const [baudRate, setBaudRate] = useState("115200");
  const [packetsReceived, setPacketsReceived] = useState(1482);
  const [latency, setLatency] = useState(1.2);

  // Live sensor readings state
  const [currentAmps, setCurrentAmps] = useState(5.8);
  const [waterDepth, setWaterDepth] = useState(74);
  const [tempC, setTempC] = useState(28.4);
  const [humidity, setHumidity] = useState(58);
  const [pirTripped, setPirTripped] = useState(false);
  const [gasPpm, setGasPpm] = useState(142);

  // Serial logs
  const [logs, setLogs] = useState([
    "[13:20:01.102] [ESP32-CORE] Boot complete. Free heap: 284,120 bytes.",
    "[13:20:01.145] [ESP32-CORE] ADC1 initialized: GPIO34 (CT Sensor), GPIO35 (MQ-2).",
    "[13:20:01.189] [ESP32-CORE] Ultrasonic JSN-SR04T ready on Trig=GPIO5, Echo=GPIO18.",
    "[13:20:01.210] [ESP32-CORE] DHT22 one-wire bus active on GPIO4.",
    "[13:20:02.304] [ESP32-CORE] TELEMETRY_STREAM_STARTED: 115200 bps.",
    "[13:20:04.108] [RX_PACKET] ADC_CH6=1894 -> Irms=5.82A, ActivePower=1.35kW",
    "[13:20:06.115] [RX_PACKET] US_ECHO=2470us -> WaterLevel=74%, Depth=42.5cm",
    "[13:20:08.121] [RX_PACKET] DHT22 -> Temp=28.4C, Humidity=58%, CRC_OK",
  ]);
  const [commandInput, setCommandInput] = useState("");
  const terminalEndRef = useRef(null);

  // Simulate incoming packets every 2.5s if connected
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setPacketsReceived((prev) => prev + 1);
      setLatency((Math.random() * 0.8 + 0.8).toFixed(1));

      // slight sensor jitter
      const newAmps = +(5.5 + (Math.random() * 0.8 - 0.4)).toFixed(2);
      const newWater = Math.min(100, Math.max(20, Math.round(74 + (Math.random() * 2 - 1))));
      const newTemp = +(28.2 + (Math.random() * 0.6 - 0.3)).toFixed(1);
      const newGas = Math.round(140 + (Math.random() * 10 - 5));

      setCurrentAmps(newAmps);
      setWaterDepth(newWater);
      setTempC(newTemp);
      setGasPpm(newGas);

      const timestamp = new Date().toTimeString().split(" ")[0] + "." + Math.floor(Math.random() * 900 + 100);
      const packet = `[${timestamp}] [RX_PACKET] CH34_RMS=${newAmps}A | US_LVL=${newWater}% | DHT_T=${newTemp}C | MQ2=${newGas}ppm`;

      setLogs((prev) => [...prev.slice(-30), packet]);
    }, 2500);

    return () => clearInterval(interval);
  }, [isConnected]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Handle command dispatch
  const handleSendCommand = (e) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const timestamp = new Date().toTimeString().split(" ")[0];
    const userCmd = `[${timestamp}] [TX_COMMAND] -> ${commandInput}`;
    let response = `[${timestamp}] [ESP32-ACK] OK: Command processed.`;

    if (commandInput.toUpperCase().includes("CALIBRATE")) {
      response = `[${timestamp}] [ESP32-ACK] ADC Zero-Offset Calibrated. Offset=0.042V`;
    } else if (commandInput.toUpperCase().includes("STATUS")) {
      response = `[${timestamp}] [ESP32-ACK] STATUS: All 5 hardware sensors ONLINE. Battery: 12.4V Mains`;
    } else if (commandInput.toUpperCase().includes("PING")) {
      response = `[${timestamp}] [ESP32-ACK] PONG (round-trip: 0.94ms)`;
    }

    setLogs((prev) => [...prev, userCmd, response]);
    setCommandInput("");
  };

  // Hardware trigger actions
  const triggerPIRBeamBreak = () => {
    setPirTripped(true);
    const timestamp = new Date().toTimeString().split(" ")[0];
    setLogs((prev) => [
      ...prev,
      `[${timestamp}] [HARDWARE_INT] GPIO19 RISING_EDGE: PIR Beam Break detected!`,
      `[${timestamp}] [STUDENT_LOGIC] Incrementing campus student count by +1`,
    ]);

    if (onIncrementStudent) {
      onIncrementStudent();
    }

    setTimeout(() => setPirTripped(false), 1200);
  };

  const triggerCurrentSpike = () => {
    setCurrentAmps(18.4);
    const timestamp = new Date().toTimeString().split(" ")[0];
    setLogs((prev) => [
      ...prev,
      `[${timestamp}] [HARDWARE_ALERT] GPIO34 ADC OVERFLOW! Irms spiked to 18.4A (Threshold: 12.0A)`,
    ]);

    if (onTriggerAlert) {
      onTriggerAlert({
        id: Date.now(),
        level: "Critical",
        type: "electrical",
        color: "border-red-500 bg-red-500/15",
        icon: "⚡",
        title: "Hardware Current Spike: SCT-013 Pin GPIO34",
        building: "Block 2 Substation",
        message:
          "CT Sensor SCT-013 detected an abnormal current surge of 18.4A. Potential short-circuit in laboratory distribution breaker.",
        time: "Just now",
        resolved: false,
      });
    }
  };

  const triggerGasLeak = () => {
    setGasPpm(680);
    const timestamp = new Date().toTimeString().split(" ")[0];
    setLogs((prev) => [
      ...prev,
      `[${timestamp}] [HARDWARE_ALERT] GPIO35 MQ-2 ANALOG TRIP! Gas PPM: 680 (Threshold: 300 PPM)`,
    ]);

    if (onTriggerAlert) {
      onTriggerAlert({
        id: Date.now(),
        level: "Critical",
        type: "fire",
        color: "border-red-500 bg-red-500/15",
        icon: "🔥",
        title: "Hardware MQ-2 Gas/Smoke Hazard Alert",
        building: "Block 3 Chemistry Lab",
        message:
          "Analog pin GPIO35 read 680 PPM combustible vapor. Exhaust ventilation activated; physical inspection required.",
        time: "Just now",
        resolved: false,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Strictly Hardware Focus */}
      <div
        className={`rounded-3xl border p-6 relative overflow-hidden shadow-2xl transition-all ${
          darkMode
            ? "bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-cyan-500/30 shadow-cyan-950/20"
            : "bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border-slate-700 text-white shadow-xl"
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20 shrink-0">
              <Cpu size={36} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ⚡ STRICTLY HARDWARE PROJECT
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  PHYSICAL SENSOR TELEMETRY LAB
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                IoT Embedded Hardware Prototype
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Direct microcontroller interfacing hub. Reads raw physical signals from CT Current Transformers, Ultrasonic Echo Sensors, DHT22 Probes, and Optical Beam Detectors via physical GPIOs.
              </p>
            </div>
          </div>

          {/* Connect / Disconnect Hardware Control */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-700/80 shrink-0">
            <div className="text-left w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    isConnected
                      ? "bg-green-400 animate-ping"
                      : "bg-red-500"
                  }`}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {isConnected ? "HARDWARE ONLINE" : "HARDWARE OFFLINE"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {selectedPort} @ {baudRate} baud
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsConnected(!isConnected)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                isConnected
                  ? "bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/40"
                  : "bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/40"
              }`}
            >
              {isConnected ? (
                <>
                  <Square size={14} /> Disconnect
                </>
              ) : (
                <>
                  <Play size={14} /> Connect Serial
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hardware Status Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/60 text-xs">
          <div>
            <span className="text-slate-400">Microcontroller:</span>
            <p className="font-bold text-cyan-300">ESP32 32-bit Dual Core (240MHz)</p>
          </div>
          <div>
            <span className="text-slate-400">Packets Ingested:</span>
            <p className="font-bold text-green-400">{packetsReceived.toLocaleString()} frames</p>
          </div>
          <div>
            <span className="text-slate-400">ADC Sampling Rate:</span>
            <p className="font-bold text-yellow-300">12-Bit (0-4095) @ 100Hz</p>
          </div>
          <div>
            <span className="text-slate-400">Bus Latency:</span>
            <p className="font-bold text-cyan-400">{latency} ms (Real-Time)</p>
          </div>
        </div>
      </div>

      {/* Grid of 5 Physical Hardware Sensors */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`text-xl font-bold tracking-tight ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Physical Hardware Sensor Array (Live Pin Telemetry)
          </h2>
          <span className="text-xs text-slate-400">
            5 Physical Sensors Connected to MCU
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {/* Sensor 1: CT Current Sensor */}
          <div
            className={`rounded-2xl border p-5 transition-all ${
              darkMode
                ? "bg-slate-900/80 border-slate-700/80 hover:border-yellow-500/40"
                : "bg-white border-slate-200 shadow-md"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  GPIO34 • ADC1_CH6
                </span>
                <h3
                  className={`text-base font-bold mt-2 ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  SCT-013-000 Non-Invasive CT Sensor
                </h3>
                <p className="text-xs text-slate-400">AC Current & Load Monitor</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-yellow-500/15 text-yellow-400 flex items-center justify-center">
                <Zap size={20} />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-yellow-400">
                {currentAmps}
              </span>
              <span className="text-xs text-slate-400 font-semibold">Amps RMS</span>
              <span className="text-xs text-slate-500 ml-auto font-mono">
                {(currentAmps * 0.23).toFixed(2)} kW
              </span>
            </div>

            {/* Simulated Live Sine Wave Oscilloscope */}
            <div className="mt-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                <span>ADC Waveform (12-bit)</span>
                <span className="text-yellow-400">50.0 Hz AC</span>
              </div>
              <div className="h-10 flex items-center justify-center overflow-hidden">
                <svg className="w-full h-8" preserveAspectRatio="none" viewBox="0 0 100 20">
                  <path
                    d="M 0 10 Q 12.5 0, 25 10 T 50 10 T 75 10 T 100 10"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            </div>

            <button
              type="button"
              onClick={triggerCurrentSpike}
              className="mt-4 w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-yellow-500/15 text-yellow-300 hover:bg-yellow-500/25 border border-yellow-500/30 transition-all"
            >
              ⚡ Trigger Overcurrent Spike Test
            </button>
          </div>

          {/* Sensor 2: Ultrasonic Depth Sensor */}
          <div
            className={`rounded-2xl border p-5 transition-all ${
              darkMode
                ? "bg-slate-900/80 border-slate-700/80 hover:border-blue-500/40"
                : "bg-white border-slate-200 shadow-md"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  TRIG: GPIO5 • ECHO: GPIO18
                </span>
                <h3
                  className={`text-base font-bold mt-2 ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  JSN-SR04T Waterproof Ultrasonic
                </h3>
                <p className="text-xs text-slate-400">Overhead Water Reservoir Sensor</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <Droplets size={20} />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-blue-400">
                {waterDepth}%
              </span>
              <span className="text-xs text-slate-400 font-semibold">Tank Capacity</span>
              <span className="text-xs text-slate-500 ml-auto font-mono">
                Depth: 180 cm
              </span>
            </div>

            {/* Gauge bar */}
            <div className="mt-4">
              <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${waterDepth}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0 cm (Empty)</span>
                <span className="text-blue-400 font-semibold">2,500 L Tank</span>
                <span>200 cm (Full)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setWaterDepth((prev) => (prev > 50 ? 25 : 85))}
              className="mt-4 w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 border border-blue-500/30 transition-all"
            >
              💧 Toggle Reservoir Level Test
            </button>
          </div>

          {/* Sensor 3: DHT22 Temperature & Humidity */}
          <div
            className={`rounded-2xl border p-5 transition-all ${
              darkMode
                ? "bg-slate-900/80 border-slate-700/80 hover:border-cyan-500/40"
                : "bg-white border-slate-200 shadow-md"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  GPIO4 • 1-Wire Digital
                </span>
                <h3
                  className={`text-base font-bold mt-2 ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  DHT22 / AM2302 Microclimate
                </h3>
                <p className="text-xs text-slate-400">Ambient Temperature & RH%</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                <Thermometer size={20} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400">Temperature</span>
                <p className="text-2xl font-black text-cyan-400">{tempC}°C</p>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400">Humidity</span>
                <p className="text-2xl font-black text-cyan-300">{humidity}%</p>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-400 flex justify-between">
              <span>Heat Index: {tempC > 32 ? "High" : "Comfortable"}</span>
              <span className="text-green-400 font-mono">Checksum: 0x4F OK</span>
            </div>

            <button
              type="button"
              onClick={() => setTempC(tempC > 35 ? 28.2 : 38.5)}
              className="mt-4 w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30 transition-all"
            >
              🌡️ Toggle Microclimate Extreme
            </button>
          </div>

          {/* Sensor 4: Optical Beam / PIR Motion Counter */}
          <div
            className={`rounded-2xl border p-5 transition-all ${
              darkMode
                ? "bg-slate-900/80 border-slate-700/80 hover:border-purple-500/40"
                : "bg-white border-slate-200 shadow-md"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  GPIO19 • External INT
                </span>
                <h3
                  className={`text-base font-bold mt-2 ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  PIR & Optical Beam Gate
                </h3>
                <p className="text-xs text-slate-400">Physical Foot-Traffic Detector</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <Eye size={20} />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400">Gate Beam Status</span>
                <p className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      pirTripped
                        ? "bg-purple-400 animate-ping"
                        : "bg-green-400"
                    }`}
                  />
                  {pirTripped ? "BEAM BROKEN (PULSE)" : "BEAM CLEAR (READY)"}
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded bg-purple-500/20 text-purple-300">
                INT0 ACTIVE
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-3">
              *Physical break-beam triggers hardware interrupt that dynamically increments campus student count.
            </p>

            <button
              type="button"
              onClick={triggerPIRBeamBreak}
              className="mt-4 w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/40 transition-all flex items-center justify-center gap-2"
            >
              👥 Simulate Physical Gate Entry (+1 Student)
            </button>
          </div>

          {/* Sensor 5: MQ-2 Gas / Fire Detector */}
          <div
            className={`rounded-2xl border p-5 transition-all ${
              darkMode
                ? "bg-slate-900/80 border-slate-700/80 hover:border-red-500/40"
                : "bg-white border-slate-200 shadow-md"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                  GPIO35 • ADC1_CH7
                </span>
                <h3
                  className={`text-base font-bold mt-2 ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  MQ-2 Flammable Gas & Smoke
                </h3>
                <p className="text-xs text-slate-400">Laboratory Hazard Sensor</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center">
                <Flame size={20} />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span
                className={`text-3xl font-black ${
                  gasPpm > 300 ? "text-red-400 animate-pulse" : "text-emerald-400"
                }`}
              >
                {gasPpm}
              </span>
              <span className="text-xs text-slate-400 font-semibold">PPM (Analog)</span>
              <span
                className={`text-xs font-bold ml-auto px-2 py-0.5 rounded ${
                  gasPpm > 300
                    ? "bg-red-500/20 text-red-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {gasPpm > 300 ? "DANGER" : "SAFE"}
              </span>
            </div>

            <div className="mt-4 text-[11px] text-slate-400">
              Threshold: 300 PPM • Calibrated with clean air base resistance (10kΩ).
            </div>

            <button
              type="button"
              onClick={triggerGasLeak}
              className="mt-4 w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 transition-all"
            >
              🔥 Simulate Laboratory Hazard Test
            </button>
          </div>

          {/* Circuit / Pinout Schematic Info Card */}
          <div
            className={`rounded-2xl border p-5 flex flex-col justify-between ${
              darkMode
                ? "bg-slate-900/50 border-slate-800"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Microcontroller Architecture
              </span>
              <h3
                className={`text-base font-bold mt-1 ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                ESP32 Hardware Pin Map
              </h3>
              <div className="mt-3 space-y-1.5 text-xs text-slate-300 font-mono">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">GPIO34 (ADC)</span>
                  <span className="text-yellow-400">SCT-013 Current CT</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">GPIO5 / 18</span>
                  <span className="text-blue-400">JSN-SR04T Echo/Trig</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">GPIO4</span>
                  <span className="text-cyan-400">DHT22 Microclimate</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">GPIO19 (INT)</span>
                  <span className="text-purple-400">PIR Optical Beam</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GPIO35 (ADC)</span>
                  <span className="text-red-400">MQ-2 Gas / Smoke</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-green-400 shrink-0" />
              <span>Opto-isolated & ESD protected analog frontend.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Serial Terminal Console */}
      <div
        className={`rounded-3xl border overflow-hidden shadow-2xl ${
          darkMode
            ? "bg-slate-950 border-slate-800"
            : "bg-slate-900 border-slate-800 text-slate-100"
        }`}
      >
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Terminal size={18} className="text-cyan-400" />
            <span className="font-mono text-sm font-bold text-white">
              Raw Hardware Serial Terminal (115200 Baud)
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-green-500/20 text-green-400 border border-green-500/30">
              TTY STREAM
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLogs([])}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors"
            >
              Clear Log
            </button>
            <span className="text-xs text-slate-500 font-mono">
              Port: COM3
            </span>
          </div>
        </div>

        {/* Console Box */}
        <div className="p-4 font-mono text-xs text-green-400 bg-slate-950/90 h-64 overflow-y-auto space-y-1.5 selection:bg-cyan-500/30">
          {logs.map((log, i) => (
            <div
              key={i}
              className={`${
                log.includes("ALERT") || log.includes("OVERFLOW")
                  ? "text-red-400 font-bold"
                  : log.includes("TX_COMMAND")
                  ? "text-cyan-300 font-semibold"
                  : log.includes("ACK")
                  ? "text-amber-300"
                  : "text-slate-300"
              }`}
            >
              {log}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Command Dispatch Form */}
        <form
          onSubmit={handleSendCommand}
          className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-3"
        >
          <span className="text-slate-500 font-mono text-xs pl-2">CMD&gt;</span>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="Type hardware command: STATUS, CALIBRATE, PING, or SET_RATE..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center gap-1"
          >
            <Send size={12} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
