import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const DRIVERS = [
  { id: "d1", name: "Hassan Alaoui", vehicle: "Dacia Logan – 13 IF 4421", status: "AVAILABLE", rides: 4, zone: "AUI Campus", lat: 33.531, lng: -5.103 },
  { id: "d2", name: "Youssef Benali", vehicle: "Renault Symbol – 17 IF 8812", status: "BUSY", rides: 7, zone: "Downtown", lat: 33.526, lng: -5.112 },
  { id: "d3", name: "Rachid Ouhssain", vehicle: "Dacia Sandero – 09 IF 2234", status: "AVAILABLE", rides: 2, zone: "Hospital", lat: 33.534, lng: -5.098 },
  { id: "d4", name: "Omar Tahiri", vehicle: "Fiat Punto – 15 IF 5567", status: "OFFLINE", rides: 0, zone: "—", lat: 33.528, lng: -5.106 },
  { id: "d5", name: "Khalid Filali", vehicle: "Peugeot 206 – 11 IF 9931", status: "AVAILABLE", rides: 5, zone: "Market", lat: 33.522, lng: -5.118 },
];

const RIDES_HISTORY = [
  { id: "r001", date: "2026-03-04", from: "AUI Campus", to: "Downtown", driver: "Hassan Alaoui", status: "COMPLETED", duration: "8 min" },
  { id: "r002", date: "2026-03-03", from: "Hospital", to: "AUI Campus", driver: "Youssef Benali", status: "COMPLETED", duration: "12 min" },
  { id: "r003", date: "2026-03-02", from: "Market", to: "AUI Campus", driver: "—", status: "FAILED", duration: "—" },
  { id: "r004", date: "2026-03-01", from: "AUI Campus", to: "Market", driver: "Rachid Ouhssain", status: "COMPLETED", duration: "6 min" },
];

const ZONES = ["AUI Campus", "Downtown", "Hospital", "Market", "Hay Salam", "Gare Routière", "Ifrane Centre"];

const EVENTS = [
  { time: "14:23", id: "r089", event: "RIDE COMPLETED", driver: "Hassan Alaoui", zone: "AUI → Downtown" },
  { time: "14:19", id: "r088", event: "RIDE STARTED", driver: "Youssef Benali", zone: "Hospital → AUI" },
  { time: "14:15", id: "r087", event: "OFFER ACCEPTED", driver: "Rachid Ouhssain", zone: "Market → Centre" },
  { time: "14:12", id: "r086", event: "OFFER EXPIRED", driver: "Omar Tahiri", zone: "AUI → Hospital" },
  { time: "14:09", id: "r085", event: "RIDE COMPLETED", driver: "Khalid Filali", zone: "Downtown → AUI" },
  { time: "14:04", id: "r084", event: "RIDE COMPLETED", driver: "Hassan Alaoui", zone: "Centre → Market" },
];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green: #1a5c35;
    --green-mid: #2d7a4f;
    --green-lt: #4a9e6e;
    --green-pale: #e8f4ed;
    --green-glow: rgba(26,92,53,0.12);
    --gold: #c9a84c;
    --gold-lt: #f0d88a;
    --ink: #111a14;
    --ink-mid: #3d4f44;
    --ink-lt: #7a8c80;
    --surface: #f6faf7;
    --card: #ffffff;
    --border: #d4e6da;
    --red: #c0392b;
    --red-pale: #fdf0ee;
    --amber: #d97706;
    --amber-pale: #fffbeb;
    --radius: 12px;
    --shadow: 0 2px 16px rgba(26,92,53,0.08), 0 1px 4px rgba(0,0,0,0.04);
    --shadow-lg: 0 8px 40px rgba(26,92,53,0.14), 0 2px 8px rgba(0,0,0,0.06);
  }

body { font-family: 'DM Sans', sans-serif; background: var(--surface); color: var(--ink); -webkit-font-smoothing: antialiased; margin: 0; width: 100%; overflow-x: hidden; }

  .app { min-height: 100vh; display: flex; flex-direction: column; width: 100%; }

  /* NAV */
  .nav { background: var(--ink); padding: 0 48px; display: flex; align-items: center; gap: 0; height: 60px; border-bottom: 2px solid var(--green); width: 100%; }
  .nav-brand { font-family: 'DM Serif Display', serif; font-size: 18px; color: var(--gold); letter-spacing: 0.02em; margin-right: auto; }
  .nav-brand span { color: #fff; }
  .nav-tab { padding: 0 20px; height: 60px; display: flex; align-items: center; font-size: 13px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-lt); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; }
  .nav-tab:hover { color: #fff; }
  .nav-tab.active { color: var(--gold); border-bottom-color: var(--gold); }

  /* LAYOUT */
  .page { flex: 1; padding: 32px 48px; width: 100%; min-width: 0; }
  .page-title { font-family: 'DM Serif Display', serif; font-size: 28px; color: var(--green); margin-bottom: 4px; }
  .page-sub { font-size: 14px; color: var(--ink-lt); margin-bottom: 28px; }

  /* CARDS */
  .card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; box-shadow: var(--shadow); }
  .card-title { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-lt); margin-bottom: 16px; }

  /* GRID */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
  .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 16px; }
  .col-span-2 { grid-column: span 2; }
  .stack { display: flex; flex-direction: column; gap: 16px; }

  /* BUTTONS */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 22px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; border: none; transition: all 0.18s; white-space: nowrap; }
  .btn-primary { background: var(--green); color: #fff; }
  .btn-primary:hover { background: var(--green-mid); transform: translateY(-1px); box-shadow: 0 4px 12px var(--green-glow); }
  .btn-outline { background: transparent; color: var(--green); border: 1.5px solid var(--green); }
  .btn-outline:hover { background: var(--green-pale); }
  .btn-danger { background: var(--red); color: #fff; }
  .btn-danger:hover { background: #a93226; }
  .btn-gold { background: var(--gold); color: var(--ink); }
  .btn-gold:hover { background: var(--gold-lt); }
  .btn-lg { padding: 14px 32px; font-size: 15px; border-radius: 10px; }
  .btn-sm { padding: 6px 14px; font-size: 12px; border-radius: 6px; }
  .btn-full { width: 100%; }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; }

  /* FORM */
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-size: 12px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--ink-mid); }
  .form-input { padding: 11px 14px; border: 1.5px solid var(--border); border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink); background: #fff; transition: border-color 0.15s, box-shadow 0.15s; outline: none; }
  .form-input:focus { border-color: var(--green); box-shadow: 0 0 0 3px var(--green-glow); }
  select.form-input { cursor: pointer; }

  /* BADGES */
  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
  .badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .badge-green { background: var(--green-pale); color: var(--green); }
  .badge-red { background: var(--red-pale); color: var(--red); }
  .badge-amber { background: var(--amber-pale); color: var(--amber); }
  .badge-grey { background: #f0f0f0; color: #888; }

  /* TABLE */
  .table-wrap { overflow-x: auto; border-radius: var(--radius); border: 1px solid var(--border); }
  table { width: 100%; border-collapse: collapse; }
  th { background: var(--green); color: #fff; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 12px 16px; text-align: left; }
  td { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid var(--border); color: var(--ink-mid); }
  tr:last-child td { border-bottom: none; }
  tr:nth-child(even) td { background: var(--green-pale); }
  tr:hover td { background: #e0f0e7; }

  /* KPI CARDS */
  .kpi { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px 24px; box-shadow: var(--shadow); position: relative; overflow: hidden; }
  .kpi::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--green); }
  .kpi-label { font-size: 11px; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; color: var(--ink-lt); margin-bottom: 8px; }
  .kpi-value { font-family: 'DM Serif Display', serif; font-size: 36px; color: var(--green); line-height: 1; }
  .kpi-unit { font-size: 14px; color: var(--ink-lt); margin-top: 4px; }

  /* STATUS INDICATOR */
  .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; }
  .dot-green { background: #22c55e; box-shadow: 0 0 0 2px rgba(34,197,94,0.2); }
  .dot-red { background: var(--red); }
  .dot-grey { background: #aaa; }
  .dot-amber { background: var(--amber); box-shadow: 0 0 0 2px rgba(217,119,6,0.2); }

  /* TOGGLE */
  .toggle-wrap { display: flex; align-items: center; gap: 12px; }
  .toggle { position: relative; width: 52px; height: 28px; cursor: pointer; }
  .toggle input { opacity: 0; width: 0; height: 0; }
  .toggle-slider { position: absolute; inset: 0; background: #ccc; border-radius: 14px; transition: 0.2s; }
  .toggle-slider::before { content: ''; position: absolute; width: 22px; height: 22px; left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
  .toggle input:checked + .toggle-slider { background: var(--green); }
  .toggle input:checked + .toggle-slider::before { transform: translateX(24px); }
  .toggle-label { font-size: 14px; font-weight: 500; color: var(--ink-mid); }

  /* RIDE STATE FLOW */
  .state-flow { display: flex; align-items: center; gap: 0; margin: 24px 0; }
  .state-step { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; }
  .state-circle { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; border: 2px solid var(--border); color: var(--ink-lt); background: #fff; transition: all 0.3s; }
  .state-circle.done { background: var(--green); border-color: var(--green); color: #fff; }
  .state-circle.active { background: var(--gold); border-color: var(--gold); color: var(--ink); box-shadow: 0 0 0 4px var(--amber-pale); }
  .state-name { font-size: 10px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--ink-lt); text-align: center; }
  .state-name.done, .state-name.active { color: var(--ink-mid); }
  .state-line { flex: 1; height: 2px; background: var(--border); margin-top: -22px; transition: background 0.3s; }
  .state-line.done { background: var(--green); }

  /* OFFER CARD */
  .offer-card { background: var(--card); border: 2px solid var(--gold); border-radius: 14px; padding: 28px; box-shadow: var(--shadow-lg); animation: slideIn 0.3s ease; }
  @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  /* TIMER */
  .timer { font-family: 'DM Serif Display', serif; font-size: 48px; color: var(--green); text-align: center; line-height: 1; }
  .timer.urgent { color: var(--red); animation: pulse 1s infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }

  /* MAP PLACEHOLDER */
  .map-box { background: linear-gradient(135deg, #e8f4ed 0%, #d0e8d8 40%, #c5e0ce 100%); border-radius: var(--radius); border: 1px solid var(--border); height: 220px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
  .map-box::before { content: ''; position: absolute; inset: 0; background-image: repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(26,92,53,0.06) 28px, rgba(26,92,53,0.06) 29px), repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(26,92,53,0.06) 28px, rgba(26,92,53,0.06) 29px); }
  .map-label { font-size: 13px; color: var(--green); font-weight: 500; background: rgba(255,255,255,0.85); padding: 8px 16px; border-radius: 20px; backdrop-filter: blur(4px); border: 1px solid var(--border); z-index: 1; }
  .map-pin { position: absolute; z-index: 2; }
  .map-pin-dot { width: 14px; height: 14px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
  .map-pin-dot.green { background: var(--green); }
  .map-pin-dot.gold { background: var(--gold); }
  .map-pin-dot.red { background: var(--red); }

  /* DIVIDER */
  .divider { height: 1px; background: var(--border); margin: 20px 0; }

  /* ALERT */
  .alert { padding: 14px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 10px; }
  .alert-success { background: var(--green-pale); color: var(--green); border: 1px solid #b8dfc8; }
  .alert-error { background: var(--red-pale); color: var(--red); border: 1px solid #f5c6c2; }
  .alert-info { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  /* DRIVER CARD */
  .driver-card { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 10px; border: 1px solid var(--border); background: var(--card); transition: box-shadow 0.2s; }
  .driver-card:hover { box-shadow: var(--shadow); }
  .driver-avatar { width: 42px; height: 42px; border-radius: 50%; background: var(--green); display: flex; align-items: center; justify-content: center; color: #fff; font-family: 'DM Serif Display', serif; font-size: 16px; flex-shrink: 0; }
  .driver-info { flex: 1; }
  .driver-name { font-size: 14px; font-weight: 600; color: var(--ink); }
  .driver-vehicle { font-size: 12px; color: var(--ink-lt); margin-top: 2px; }

  /* SECTION SPACER */
  .section-gap { margin-top: 28px; }

  /* EMPTY STATE */
  .empty { text-align: center; padding: 48px 24px; color: var(--ink-lt); }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-text { font-size: 14px; }

  /* SCORE BAR */
  .score-bar { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
  .score-fill { height: 100%; background: var(--green); border-radius: 3px; transition: width 0.6s ease; }

  /* POLICY FORM */
  .policy-row { display: flex; align-items: center; gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--border); }
  .policy-label { flex: 1; }
  .policy-label strong { font-size: 14px; color: var(--ink); display: block; }
  .policy-label span { font-size: 12px; color: var(--ink-lt); }
  .policy-input { width: 90px; padding: 8px 10px; border: 1.5px solid var(--border); border-radius: 6px; font-size: 14px; text-align: center; font-family: 'DM Sans', sans-serif; color: var(--ink); outline: none; }
  .policy-input:focus { border-color: var(--green); }

  .fade-in { animation: fadeIn 0.35s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
`;

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Badge({ status }) {
  const map = {
    AVAILABLE: ["badge-green", "Available"],
    BUSY: ["badge-amber", "Busy"],
    OFFLINE: ["badge-grey", "Offline"],
    COMPLETED: ["badge-green", "Completed"],
    FAILED: ["badge-red", "Failed"],
    CANCELLED: ["badge-red", "Cancelled"],
    REQUESTED: ["badge-amber", "Requested"],
    OFFERED: ["badge-amber", "Offered"],
    ASSIGNED: ["badge-green", "Assigned"],
    PENDING_OFFER: ["badge-amber", "Pending"],
  };
  const [cls, label] = map[status] || ["badge-grey", status];
  return <span className={`badge ${cls}`}>{label}</span>;
}

function MapBox({ pins = [], label }) {
  const positions = [
    { top: "30%", left: "25%" },
    { top: "55%", left: "60%" },
    { top: "40%", left: "75%" },
    { top: "65%", left: "35%" },
    { top: "25%", left: "55%" },
  ];
  return (
    <div className="map-box">
      {pins.map((p, i) => (
        <div key={i} className="map-pin" style={positions[i % positions.length]}>
          <div className={`map-pin-dot ${p.color}`} title={p.label} />
        </div>
      ))}
      <span className="map-label">📍 {label || "Ifrane — Live Map View"}</span>
    </div>
  );
}

// ─── PASSENGER INTERFACE ──────────────────────────────────────────────────────

function PassengerPage() {
  const [screen, setScreen] = useState("request"); // request | waiting | active | done
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [contact, setContact] = useState("");
  const [rideStep, setRideStep] = useState(0); // 0=assigned,1=en_route,2=arrived,3=started,4=ended
  const [history, setHistory] = useState(false);

  const steps = ["Assigned", "En Route", "Arrived", "Started", "Ended"];

  const handleRequest = () => {
    if (!pickup || !dropoff) return;
    setScreen("waiting");
    setTimeout(() => setScreen("active"), 2800);
  };

  const advanceStep = () => {
    if (rideStep < 4) setRideStep(s => s + 1);
    else { setScreen("done"); }
  };

  if (history) return <PassengerHistory onBack={() => setHistory(false)} />;

  return (
    <div className="page fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div className="page-title">Passenger</div>
          <div className="page-sub">Request and track your ride</div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => setHistory(true)}>Ride History</button>
      </div>

      {screen === "request" && (
        <div className="stack fade-in">
          <MapBox label="Select your pickup location" pins={[{ color: "green", label: "You" }]} />
          <div className="card">
            <div className="card-title">New Ride Request</div>
            <div className="stack" style={{ gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Pickup Zone</label>
                <select className="form-input" value={pickup} onChange={e => setPickup(e.target.value)}>
                  <option value="">Select pickup…</option>
                  {ZONES.map(z => <option key={z}>{z}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Dropoff Location</label>
                <select className="form-input" value={dropoff} onChange={e => setDropoff(e.target.value)}>
                  <option value="">Select destination…</option>
                  {ZONES.filter(z => z !== pickup).map(z => <option key={z}>{z}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Contact Number (optional)</label>
                <input className="form-input" type="tel" placeholder="06 XX XX XX XX" value={contact} onChange={e => setContact(e.target.value)} />
              </div>
              <button
                className="btn btn-primary btn-lg btn-full"
                onClick={handleRequest}
                disabled={!pickup || !dropoff}
              >
                Request Taxi
              </button>
            </div>
          </div>
        </div>
      )}

      {screen === "waiting" && (
        <div className="stack fade-in">
          <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "var(--green)", marginBottom: 8 }}>
              Finding your driver…
            </div>
            <div style={{ fontSize: 14, color: "var(--ink-lt)", marginBottom: 28 }}>
              From <strong>{pickup}</strong> to <strong>{dropoff}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: "50%", background: "var(--green)",
                  animation: `pulse 1.2s ${i * 0.3}s infinite`
                }} />
              ))}
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => setScreen("request")}>Cancel Request</button>
          </div>
        </div>
      )}

      {screen === "active" && (
        <div className="stack fade-in">
          <div className="alert alert-success">✓ Driver assigned — Hassan Alaoui is on the way</div>
          <MapBox label="Hassan is heading to you" pins={[
            { color: "green", label: "Driver" },
            { color: "gold", label: "Pickup" },
            { color: "red", label: "Dropoff" },
          ]} />
          <div className="card">
            <div className="card-title">Ride Progress</div>
            <div className="state-flow">
              {steps.map((s, i) => (
                <>
                  {i > 0 && <div key={`l${i}`} className={`state-line ${i <= rideStep ? "done" : ""}`} />}
                  <div key={s} className="state-step">
                    <div className={`state-circle ${i < rideStep ? "done" : i === rideStep ? "active" : ""}`}>
                      {i < rideStep ? "✓" : i + 1}
                    </div>
                    <div className={`state-name ${i <= rideStep ? "active" : ""}`}>{s}</div>
                  </div>
                </>
              ))}
            </div>
            <div className="divider" />
            <div className="driver-card">
              <div className="driver-avatar">H</div>
              <div className="driver-info">
                <div className="driver-name">Hassan Alaoui</div>
                <div className="driver-vehicle">Dacia Logan – 13 IF 4421</div>
              </div>
              <Badge status="ASSIGNED" />
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <button className="btn btn-outline btn-sm" onClick={advanceStep} style={{ flex: 1 }}>
                {rideStep === 4 ? "Ride Complete" : `Advance: ${steps[rideStep]}`}
              </button>
              {rideStep < 3 && (
                <button className="btn btn-danger btn-sm" onClick={() => setScreen("request")}>Cancel</button>
              )}
            </div>
          </div>
        </div>
      )}

      {screen === "done" && (
        <div className="stack fade-in">
          <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "var(--green)", marginBottom: 8 }}>
              Ride Completed
            </div>
            <div style={{ fontSize: 14, color: "var(--ink-lt)", marginBottom: 8 }}>
              {pickup} → {dropoff}
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-lt)", marginBottom: 32 }}>
              Driver: Hassan Alaoui · ~8 min
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => { setScreen("request"); setPickup(""); setDropoff(""); setRideStep(0); }}>
              Request Another Ride
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PassengerHistory({ onBack }) {
  return (
    <div className="page fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button className="btn btn-outline btn-sm" onClick={onBack}>← Back</button>
        <div>
          <div className="page-title" style={{ marginBottom: 0 }}>Ride History</div>
          <div className="page-sub" style={{ marginBottom: 0 }}>Your past rides</div>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th><th>From</th><th>To</th><th>Driver</th><th>Duration</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {RIDES_HISTORY.map(r => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td>{r.from}</td>
                <td>{r.to}</td>
                <td>{r.driver}</td>
                <td>{r.duration}</td>
                <td><Badge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── DRIVER INTERFACE ─────────────────────────────────────────────────────────

function DriverPage() {
  const [online, setOnline] = useState(false);
  const [screen, setScreen] = useState("status"); // status | offer | ride | history
  const [timer, setTimer] = useState(30);
  const [rideStep, setRideStep] = useState(0);
  const timerRef = useRef(null);

  const steps = ["En Route", "Arrived", "Started", "Ended"];

  const goOnline = () => {
    setOnline(true);
    setTimeout(() => setScreen("offer"), 1800);
  };

  const goOffline = () => {
    setOnline(false);
    setScreen("status");
    setTimer(30);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (screen === "offer") {
      setTimer(30);
      timerRef.current = setInterval(() => {
        setTimer(t => {
          if (t <= 1) { clearInterval(timerRef.current); setScreen("status"); setOnline(false); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen]);

  const acceptOffer = () => {
    clearInterval(timerRef.current);
    setRideStep(0);
    setScreen("ride");
  };

  const rejectOffer = () => {
    clearInterval(timerRef.current);
    setScreen("status");
    setOnline(false);
  };

  const advanceRide = () => {
    if (rideStep < 3) setRideStep(s => s + 1);
    else { setScreen("history"); setOnline(false); }
  };

  if (screen === "history") return <DriverHistory onBack={() => setScreen("status")} />;

  return (
    <div className="page fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div className="page-title">Driver</div>
          <div className="page-sub">Hassan Alaoui · Dacia Logan 13 IF 4421</div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => setScreen("history")}>History</button>
      </div>

      {screen === "status" && (
        <div className="stack fade-in">
          <div className="card" style={{ textAlign: "center", padding: "36px 24px" }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: online ? "var(--green)" : "#e5e7eb",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", fontSize: 32,
              transition: "background 0.3s",
              boxShadow: online ? "0 0 0 8px var(--green-pale)" : "none"
            }}>
              {online ? "🟢" : "🚕"}
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginBottom: 8 }}>
              {online ? "You are Online" : "You are Offline"}
            </div>
            <div style={{ fontSize: 14, color: "var(--ink-lt)", marginBottom: 28 }}>
              {online ? "Waiting for a ride offer…" : "Toggle online to start receiving offers"}
            </div>
            <div className="toggle-wrap" style={{ justifyContent: "center", gap: 16 }}>
              <span style={{ fontSize: 13, color: online ? "var(--ink-lt)" : "var(--red)", fontWeight: 500 }}>Offline</span>
              <label className="toggle">
                <input type="checkbox" checked={online} onChange={online ? goOffline : goOnline} />
                <span className="toggle-slider" />
              </label>
              <span style={{ fontSize: 13, color: online ? "var(--green)" : "var(--ink-lt)", fontWeight: 500 }}>Online</span>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Today's Summary</div>
            <div className="grid-3">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "var(--green)" }}>4</div>
                <div style={{ fontSize: 11, color: "var(--ink-lt)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Rides Today</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "var(--green)" }}>6.2</div>
                <div style={{ fontSize: 11, color: "var(--ink-lt)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Fairness Score</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "var(--green)" }}>32</div>
                <div style={{ fontSize: 11, color: "var(--ink-lt)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Min Active</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === "offer" && (
        <div className="stack fade-in">
          <div className="offer-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "var(--ink)" }}>Incoming Offer</div>
              <div className={`timer ${timer <= 8 ? "urgent" : ""}`}>{timer}s</div>
            </div>
            <div className="divider" style={{ marginTop: 0 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "20px 0" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-lt)", marginBottom: 4 }}>Pickup Zone</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--green)" }}>AUI Campus</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-lt)", marginBottom: 4 }}>Dropoff</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>Downtown</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-lt)", marginBottom: 4 }}>Distance</div>
                <div style={{ fontSize: 15, color: "var(--ink-mid)" }}>~1.4 km</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-lt)", marginBottom: 4 }}>Est. Duration</div>
                <div style={{ fontSize: 15, color: "var(--ink-mid)" }}>~8 min</div>
              </div>
            </div>
            <MapBox label="Passenger is at AUI Campus" pins={[{ color: "gold", label: "Passenger" }]} />
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button className="btn btn-danger btn-lg" style={{ flex: 1 }} onClick={rejectOffer}>Decline</button>
              <button className="btn btn-primary btn-lg" style={{ flex: 2 }} onClick={acceptOffer}>Accept Offer</button>
            </div>
          </div>
        </div>
      )}

      {screen === "ride" && (
        <div className="stack fade-in">
          <div className="alert alert-success">✓ Offer accepted — Ride in progress</div>
          <MapBox label="Navigate to passenger" pins={[
            { color: "green", label: "You" },
            { color: "gold", label: "Pickup" },
          ]} />
          <div className="card">
            <div className="card-title">Ride Controls</div>
            <div className="state-flow">
              {steps.map((s, i) => (
                <>
                  {i > 0 && <div key={`l${i}`} className={`state-line ${i <= rideStep ? "done" : ""}`} />}
                  <div key={s} className="state-step">
                    <div className={`state-circle ${i < rideStep ? "done" : i === rideStep ? "active" : ""}`}>
                      {i < rideStep ? "✓" : i + 1}
                    </div>
                    <div className={`state-name ${i <= rideStep ? "active" : ""}`}>{s}</div>
                  </div>
                </>
              ))}
            </div>
            <div className="divider" />
            <div style={{ fontSize: 13, color: "var(--ink-lt)", marginBottom: 16 }}>
              Passenger: <strong style={{ color: "var(--ink)" }}>AUI Student</strong> · AUI Campus → Downtown
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={advanceRide}>
              {rideStep === 3 ? "Complete Ride" : `Mark: ${steps[rideStep]}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DriverHistory({ onBack }) {
  return (
    <div className="page fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button className="btn btn-outline btn-sm" onClick={onBack}>← Back</button>
        <div>
          <div className="page-title" style={{ marginBottom: 0 }}>Ride History</div>
          <div className="page-sub" style={{ marginBottom: 0 }}>Hassan Alaoui</div>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Date</th><th>From</th><th>To</th><th>Duration</th><th>Status</th></tr>
          </thead>
          <tbody>
            {RIDES_HISTORY.filter(r => r.driver === "Hassan Alaoui" || r.driver === "—").map(r => (
              <tr key={r.id}>
                <td>{r.date}</td><td>{r.from}</td><td>{r.to}</td><td>{r.duration}</td>
                <td><Badge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ADMIN INTERFACE ──────────────────────────────────────────────────────────

function AdminPage() {
  const [tab, setTab] = useState("fleet"); // fleet | rides | stats | policy
  const [alpha, setAlpha] = useState("0.5");
  const [beta, setBeta] = useState("0.3");
  const [gamma, setGamma] = useState("0.2");
  const [timeout, setTimeout_] = useState("30");
  const [maxAttempts, setMaxAttempts] = useState("3");
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const adminTabs = [
    { id: "fleet", label: "Fleet Overview" },
    { id: "rides", label: "Ride Monitor" },
    { id: "stats", label: "Statistics" },
    { id: "policy", label: "Policy Config" },
  ];

  return (
    <div className="page fade-in">
      <div className="page-title">Admin Dashboard</div>
      <div className="page-sub">Real-time fleet monitoring and system configuration</div>

      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
        {adminTabs.map(t => (
          <button key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 18px", background: "none", border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
              color: tab === t.id ? "var(--green)" : "var(--ink-lt)",
              borderBottom: `2px solid ${tab === t.id ? "var(--green)" : "transparent"}`,
              marginBottom: -1, transition: "all 0.15s",
              letterSpacing: "0.02em"
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "fleet" && (
        <div className="stack fade-in">
          <div className="grid-4">
            <div className="kpi">
              <div className="kpi-label">Online Drivers</div>
              <div className="kpi-value">3</div>
              <div className="kpi-unit">of 5 registered</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Active Rides</div>
              <div className="kpi-value">1</div>
              <div className="kpi-unit">in progress now</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Rides Today</div>
              <div className="kpi-value">18</div>
              <div className="kpi-unit">since 06:00</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Avg Wait Time</div>
              <div className="kpi-value">4.2</div>
              <div className="kpi-unit">minutes</div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Driver Status</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {DRIVERS.map(d => (
                <div key={d.id} className="driver-card">
                  <div className="driver-avatar">{d.name[0]}</div>
                  <div className="driver-info">
                    <div className="driver-name">{d.name}</div>
                    <div className="driver-vehicle">{d.vehicle}</div>
                  </div>
                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <Badge status={d.status} />
                    <div style={{ fontSize: 11, color: "var(--ink-lt)" }}>{d.rides} rides today · {d.zone}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Live Map</div>
            <MapBox label="Fleet positions — Ifrane" pins={DRIVERS.filter(d => d.status !== "OFFLINE").map(d => ({
              color: d.status === "AVAILABLE" ? "green" : d.status === "BUSY" ? "gold" : "red",
              label: d.name
            }))} />
            <div style={{ display: "flex", gap: 20, marginTop: 14, fontSize: 12, color: "var(--ink-lt)" }}>
              <span><span className="status-dot dot-green" />Available</span>
              <span><span className="status-dot dot-amber" />Busy</span>
              <span><span className="status-dot dot-grey" />Offline</span>
            </div>
          </div>
        </div>
      )}

      {tab === "rides" && (
        <div className="stack fade-in">
          <div className="card">
            <div className="card-title">Live Event Feed</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {EVENTS.map((e, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "12px 0", borderBottom: "1px solid var(--border)"
                }}>
                  <div style={{ fontSize: 11, color: "var(--ink-lt)", width: 38, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>{e.time}</div>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: e.event.includes("COMPLETED") ? "var(--green)" : e.event.includes("EXPIRED") ? "var(--red)" : "var(--amber)", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", color: "var(--ink)" }}>{e.event}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-lt)" }}>{e.driver} · {e.zone}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-lt)", fontFamily: "monospace" }}>{e.id}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">All Rides</div>
            <div className="table-wrap" style={{ border: "none", borderRadius: 0 }}>
              <table>
                <thead><tr><th>ID</th><th>Date</th><th>From</th><th>To</th><th>Driver</th><th>Duration</th><th>Status</th></tr></thead>
                <tbody>
                  {RIDES_HISTORY.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontFamily: "monospace", fontSize: 12 }}>{r.id}</td>
                      <td>{r.date}</td><td>{r.from}</td><td>{r.to}</td>
                      <td>{r.driver}</td><td>{r.duration}</td>
                      <td><Badge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "stats" && (
        <div className="stack fade-in">
          <div className="grid-2">
            <div className="kpi"><div className="kpi-label">Avg Offer Response</div><div className="kpi-value">11.4</div><div className="kpi-unit">seconds</div></div>
            <div className="kpi"><div className="kpi-label">Completion Rate</div><div className="kpi-value">94%</div><div className="kpi-unit">of all requests</div></div>
            <div className="kpi"><div className="kpi-label">Failed Rides</div><div className="kpi-value">3</div><div className="kpi-unit">this week</div></div>
            <div className="kpi"><div className="kpi-label">Avg Idle Time</div><div className="kpi-value">6.8</div><div className="kpi-unit">minutes / driver</div></div>
          </div>

          <div className="card">
            <div className="card-title">Rides per Driver (Today)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {DRIVERS.filter(d => d.rides > 0).map(d => (
                <div key={d.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: "var(--ink-mid)" }}>{d.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--green)" }}>{d.rides} rides</span>
                  </div>
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: `${(d.rides / 8) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Demand Hotspots</div>
            <div className="table-wrap" style={{ border: "none", borderRadius: 0 }}>
              <table>
                <thead><tr><th>Zone</th><th>Requests Today</th><th>Avg Wait</th><th>Coverage</th></tr></thead>
                <tbody>
                  {[
                    ["AUI Campus", 9, "3.2 min", "High"],
                    ["Downtown", 5, "5.8 min", "Medium"],
                    ["Hospital", 2, "7.1 min", "Low"],
                    ["Market", 2, "6.4 min", "Medium"],
                  ].map(([z, r, w, c]) => (
                    <tr key={z}><td>{z}</td><td>{r}</td><td>{w}</td>
                      <td><Badge status={c === "High" ? "AVAILABLE" : c === "Medium" ? "BUSY" : "OFFLINE"} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "policy" && (
        <div className="stack fade-in">
          <div className="card">
            <div className="card-title">Dispatch Algorithm Weights</div>
            <div style={{ fontSize: 13, color: "var(--ink-lt)", marginBottom: 20 }}>
              These weights control the scoring function: <strong style={{ fontFamily: "monospace", color: "var(--green)" }}>score = α·proximity + β·fairness + γ·recency</strong>. Values must sum to 1.0.
            </div>

            <div className="policy-row">
              <div className="policy-label">
                <strong>α — Proximity Weight</strong>
                <span>Higher values prioritise the nearest available driver</span>
              </div>
              <input className="policy-input" type="number" min="0" max="1" step="0.1" value={alpha} onChange={e => setAlpha(e.target.value)} />
            </div>
            <div className="policy-row">
              <div className="policy-label">
                <strong>β — Fairness Weight</strong>
                <span>Higher values counteract ride concentration among top drivers</span>
              </div>
              <input className="policy-input" type="number" min="0" max="1" step="0.1" value={beta} onChange={e => setBeta(e.target.value)} />
            </div>
            <div className="policy-row">
              <div className="policy-label">
                <strong>γ — Recency Weight</strong>
                <span>Reduces score of drivers who completed a ride very recently</span>
              </div>
              <input className="policy-input" type="number" min="0" max="1" step="0.1" value={gamma} onChange={e => setGamma(e.target.value)} />
            </div>
            <div style={{ marginTop: 12, padding: "10px 14px", background: "var(--green-pale)", borderRadius: 8, fontSize: 13, color: "var(--green)", fontWeight: 500 }}>
              Current sum: {(+alpha + +beta + +gamma).toFixed(1)} {(+alpha + +beta + +gamma).toFixed(1) === "1.0" ? "✓ Valid" : "⚠ Should equal 1.0"}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Offer & Reassignment Settings</div>
            <div className="policy-row">
              <div className="policy-label">
                <strong>Offer Timeout (seconds)</strong>
                <span>How long a driver has to accept before the offer expires</span>
              </div>
              <input className="policy-input" type="number" min="10" max="120" value={timeout} onChange={e => setTimeout_(e.target.value)} />
            </div>
            <div className="policy-row" style={{ borderBottom: "none" }}>
              <div className="policy-label">
                <strong>Max Reassignment Attempts</strong>
                <span>How many drivers are tried before a ride is declared FAILED</span>
              </div>
              <input className="policy-input" type="number" min="1" max="10" value={maxAttempts} onChange={e => setMaxAttempts(e.target.value)} />
            </div>
          </div>

          {saved && <div className="alert alert-success">✓ Policy configuration saved successfully</div>}
          <button className="btn btn-primary btn-lg" onClick={handleSave}>Save Configuration</button>
        </div>
      )}
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [role, setRole] = useState("passenger");

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-brand">Ifrane <span>Taxi</span></div>
          {[
            { id: "passenger", label: "Passenger" },
            { id: "driver", label: "Driver" },
            { id: "admin", label: "Admin" },
          ].map(r => (
            <div
              key={r.id}
              className={`nav-tab ${role === r.id ? "active" : ""}`}
              onClick={() => setRole(r.id)}
            >
              {r.label}
            </div>
          ))}
        </nav>

        {role === "passenger" && <PassengerPage />}
        {role === "driver" && <DriverPage />}
        {role === "admin" && <AdminPage />}
      </div>
    </>
  );
}
