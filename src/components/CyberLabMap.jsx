import React, { useState } from "react";
import "./cyberlab-map.css"; // see CSS section below

const currentZones = [
  {
    id: "mgmt",
    name: "Management / Infrastructure",
    purpose: "Core Infrastructure",
    color: "green",
    role: "Core compute and platform management.",
    items: [
      { name: "Proxmox Node 1", desc: "HP ML350 G10" },
      { name: "Proxmox Node 2", desc: "HP ML350 G10" },
    ],
  },
  {
    id: "acs",
    name: "Alpha Centauri Sandbox",
    purpose: "Development & Testing",
    color: "blue",
    role: "ACS services, development, and lab workstations.",
    items: [
      { name: "ACS Services", desc: "APIs, services" },
      { name: "Guacamole", desc: "Remote Access Jump Host" },
      { name: "Windows Lab VMs", desc: "Dev / Test Workstations" },
    ],
  },
  {
    id: "lms",
    name: "LMS",
    purpose: "Learning Management System",
    color: "cyan",
    role: "Learning Management System and course delivery.",
    items: [
      { name: "LMS App Server", desc: "Moodle" },
      { name: "LMS Database", desc: "MariaDB/Postgres" },
    ],
  },
  {
    id: "prod",
    name: "Production",
    purpose: "Client Delivery / Lab Operations",
    color: "pink",
    role: "Client delivery and lab operations environment.",
    items: [
      { name: "Active Directory", desc: "& DNS" },
      { name: "File / App Server", desc: "" },
      { name: "Security Tools", desc: "Wazuh, Syslog, Monitoring" },
    ],
  },
  {
    id: "vpn",
    name: "VPN Access",
    purpose: "Remote Access",
    color: "red",
    role: "Remote access into the lab via WireGuard.",
    items: [
      { name: "WireGuard VPN", desc: "Running on Dream Wall" },
    ],
  },
  {
    id: "range",
    name: "OpenStack Cyber Range",
    purpose: "Cyber Range Environment",
    color: "orange",
    role: "OpenStack-backed ephemeral cyber ranges.",
    items: [
      { name: "OpenStack Cyber Range", desc: "" },
    ],
  },
];

const futureZones = [
  {
    id: "mgmt",
    name: "Management / Infrastructure",
    purpose: "Core Infrastructure",
    color: "green",
    role: "Core compute, shared storage, and platform management.",
    items: [
      { name: "Proxmox Node 1", desc: "HP ML350 G10" },
      { name: "Proxmox Node 2", desc: "HP ML350 G10" },
      { name: "Synology DS1621+", desc: "24 TB NAS", planned: true },
      { name: "Additional Nodes", desc: "Proxmox/OpenStack", planned: true },
    ],
  },
  {
    id: "acs",
    name: "Alpha Centauri Sandbox",
    purpose: "Development & Testing",
    color: "blue",
    role: "ACS services, development, and pre-production testing.",
    items: [
      { name: "ACS Services", desc: "APIs, services" },
      { name: "Guacamole", desc: "Remote Access Jump Host" },
      { name: "Windows Lab VMs", desc: "Dev / Test Workstations" },
    ],
  },
  {
    id: "lms",
    name: "LMS",
    purpose: "Learning Management System",
    color: "cyan",
    role: "Learning Management System and course content delivery.",
    items: [
      { name: "LMS App Server", desc: "Moodle" },
      { name: "LMS Database", desc: "MariaDB/Postgres" },
      { name: "Course Content", desc: "Synology NAS", planned: true },
    ],
  },
  {
    id: "prod",
    name: "Production",
    purpose: "Client Delivery / Lab Operations",
    color: "pink",
    role: "Client delivery and lab operations environment.",
    items: [
      { name: "Active Directory", desc: "& DNS" },
      { name: "File / App Server", desc: "" },
      { name: "Security Tools", desc: "Wazuh, Syslog, Monitoring" },
      { name: "Simulation VMs", desc: "Line-of-Business", planned: true },
    ],
  },
  {
    id: "vpn",
    name: "VPN Access",
    purpose: "Remote Access",
    color: "red",
    role: "High-capacity secure remote access into the lab.",
    items: [
      { name: "WireGuard VPN", desc: "Legacy / Fallback" },
      { name: "VPN Appliance 1", desc: "HP EliteDesk", planned: true },
      { name: "VPN Appliance 2", desc: "HP EliteDesk", planned: true },
    ],
  },
  {
    id: "range",
    name: "OpenStack Cyber Range",
    purpose: "Cyber Range Environment",
    color: "orange",
    role: "Isolated, disposable cyber ranges for Red/Blue, malware, and advanced labs.",
    items: [
      { name: "OpenStack Controller", desc: "", planned: true },
      { name: "Compute Nodes", desc: "", planned: true },
      { name: "2nd UniFi Switch", desc: "Cyber Range Fabric", planned: true },
    ],
  },
];

const topologyCurrent = [
  "Internet",
  "Ubiquiti Dream Wall – Router / Firewall / Switch / UniFi Controller",
];

const topologyFuture = [
  "Internet",
  "Ubiquiti Dream Wall – Router / Firewall / UniFi Controller",
  "UniFi Enterprise 24 PoE – 10 Gb Core Switch (Planned)",
];

export default function CyberLabMap() {
  const [view, setView] = useState("current"); // "current" | "future"
  const [activeZone, setActiveZone] = useState(null);

  const zones = view === "current" ? currentZones : futureZones;
  const topology = view === "current" ? topologyCurrent : topologyFuture;

  const handleZoneClick = (zone) => {
    setActiveZone(zone);
  };

  const closeModal = () => setActiveZone(null);

  return (
    <div className="cl-map-root">
      <div className="cl-map-header">
        <div>
          <h2 className="cl-map-title">TCEcure Cyber Lab Network</h2>
          <p className="cl-map-subtitle">
            Modern, data-center-inspired architecture with segmented zones for Alpha Centauri Sandbox, LMS, Production, VPN, and Cyber Range.
          </p>
        </div>
        <div className="cl-map-toggle">
          <button
            className={`cl-toggle-btn ${view === "current" ? "active" : ""}`}
            onClick={() => setView("current")}
          >
            Current State
          </button>
          <button
            className={`cl-toggle-btn ${view === "future" ? "active" : ""}`}
            onClick={() => setView("future")}
          >
            Future / Planned
          </button>
        </div>
      </div>

      {/* Network Diagram */}
      <div className="cl-diagram">
        <svg className="cl-diagram-lines" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
            </marker>
          </defs>
          <line x1="600" y1="45" x2="600" y2="95" className="cl-connector" markerEnd="url(#arrowhead)" />
          <line x1="600" y1="155" x2="150" y2="245" className="cl-connector" markerEnd="url(#arrowhead)" />
          <line x1="600" y1="155" x2="400" y2="245" className="cl-connector" markerEnd="url(#arrowhead)" />
          <line x1="600" y1="155" x2="650" y2="245" className="cl-connector" markerEnd="url(#arrowhead)" />
          <line x1="600" y1="155" x2="900" y2="245" className="cl-connector" markerEnd="url(#arrowhead)" />
          <line x1="600" y1="155" x2="1050" y2="245" className="cl-connector" markerEnd="url(#arrowhead)" />
          <line x1="600" y1="155" x2="300" y2="545" className="cl-connector" markerEnd="url(#arrowhead)" />
          <line x1="600" y1="155" x2="750" y2="545" className="cl-connector" markerEnd="url(#arrowhead)" />
        </svg>

        <div className="cl-diagram-nodes">
          <div className="cl-node cl-node-internet">
            <span className="cl-node-icon">🌐</span>
            <span>Internet</span>
          </div>

          <div className="cl-node cl-node-router">
            <span className="cl-node-icon">📡</span>
            <span>Ubiquiti Dream Wall</span>
            <span className="cl-node-desc">Router / Firewall / UniFi Controller</span>
          </div>

          <div className="cl-zones-row cl-zones-top">
            {zones.slice(0, 4).map((zone) => (
              <div
                key={zone.id}
                className={`cl-zone-group cl-zone-${zone.color}`}
                onClick={() => handleZoneClick(zone)}
              >
                <div className="cl-zone-label">
                  <span className="cl-zone-name">{zone.name}</span>
                  <span className="cl-zone-vlan-tag">{zone.purpose}</span>
                </div>
                <div className="cl-zone-nodes">
                  {zone.items.map((item, idx) => (
                    <div key={idx} className={`cl-node-box ${item.planned ? 'cl-planned' : ''}`}>
                      <span className="cl-node-box-name">{item.name}</span>
                      {item.desc && <span className="cl-node-box-desc">{item.desc}</span>}
                      {item.planned && <span className="cl-badge-planned">Planned</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="cl-zones-row cl-zones-bottom">
            {zones.slice(4).map((zone) => (
              <div
                key={zone.id}
                className={`cl-zone-group cl-zone-${zone.color}`}
                onClick={() => handleZoneClick(zone)}
              >
                <div className="cl-zone-label">
                  <span className="cl-zone-name">{zone.name}</span>
                  <span className="cl-zone-vlan-tag">{zone.purpose}</span>
                </div>
                <div className="cl-zone-nodes">
                  {zone.items.map((item, idx) => (
                    <div key={idx} className={`cl-node-box ${item.planned ? 'cl-planned' : ''}`}>
                      <span className="cl-node-box-name">{item.name}</span>
                      {item.desc && <span className="cl-node-box-desc">{item.desc}</span>}
                      {item.planned && <span className="cl-badge-planned">Planned</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="cl-info-box glass">
              <h4 className="cl-info-title">{view === "current" ? "Current State" : "Future / Planned"}</h4>
              <p className="cl-info-text">
                {view === "current"
                  ? "The current lab infrastructure with 2 Proxmox nodes, segmented VLANs, and WireGuard VPN access."
                  : "Planned expansion includes NAS storage, additional compute nodes, dedicated VPN appliances, and OpenStack-based cyber range."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {activeZone && (
        <div className="cl-modal-backdrop" onClick={closeModal}>
          <div
            className="cl-modal glass"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cl-modal-header">
              <div>
                <span className="cl-zone-vlan">{activeZone.name}</span>
                <h3 className="cl-zone-title">{activeZone.name}</h3>
              </div>
              <button className="cl-modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            <p className="cl-zone-role">{activeZone.role}</p>
            <h4 className="cl-modal-section-title">Resources in this zone</h4>
            <ul className="cl-zone-items cl-modal-items">
              {activeZone.items.map((item, idx) => (
                <li key={idx} className="cl-zone-item">
                  <span>{item.name}{item.desc ? ` – ${item.desc}` : ''}</span>
                  {item.planned && (
                    <span className="cl-badge-planned">Planned</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
