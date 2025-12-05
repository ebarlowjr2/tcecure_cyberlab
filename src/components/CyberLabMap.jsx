import React, { useState } from "react";
import "./cyberlab-map.css"; // see CSS section below

const currentZones = [
  {
    id: "mgmt",
    name: "Management / Infrastructure",
    vlan: "VLAN 10",
    role: "Core compute and platform management.",
    items: [
      "Proxmox Node 1 – HP ML350 G10",
      "Proxmox Node 2 – HP ML350 G10",
    ],
  },
  {
    id: "dev",
    name: "Dev / ACS Zone",
    vlan: "VLAN 20",
    role: "Development, ACS services, and lab workstations.",
    items: [
      "ACS Services (APIs, services)",
      "Guacamole – Remote Access Jump Host",
      "Windows Lab VMs (Dev / Test Workstations)",
    ],
  },
  {
    id: "lms",
    name: "LMS Zone",
    vlan: "VLAN 30",
    role: "Learning Management System and course delivery.",
    items: [
      "LMS App Server (Moodle)",
      "LMS Database (MariaDB / Postgres)",
    ],
  },
  {
    id: "prod",
    name: "Production Zone",
    vlan: "VLAN 40",
    role: "Production-like environment for customer / enterprise simulation.",
    items: [
      "Active Directory & DNS",
      "File / Application Server",
      "Security Tools – Wazuh, Syslog, Monitoring",
    ],
  },
  {
    id: "vpn",
    name: "VPN Access Zone",
    vlan: "VLAN 60",
    role: "Remote access into the lab via WireGuard.",
    items: [
      "WireGuard VPN (running on Dream Wall)",
    ],
  },
  {
    id: "range",
    name: "Cyber Range (Planned)",
    vlan: "VLAN 50",
    role: "Future OpenStack-backed ephemeral cyber ranges.",
    items: [
      "OpenStack-based Cyber Range (Planned)",
    ],
  },
];

const futureZones = [
  {
    id: "mgmt",
    name: "Management / Infrastructure",
    vlan: "VLAN 10",
    role: "Core compute, shared storage, and platform management.",
    items: [
      "Proxmox Node 1 – HP ML350 G10",
      "Proxmox Node 2 – HP ML350 G10",
      "Synology DS1621+ – 24 TB NAS (Planned)",
      "Additional Proxmox / OpenStack Nodes (Planned)",
    ],
  },
  {
    id: "dev",
    name: "Dev / ACS Zone",
    vlan: "VLAN 20",
    role: "Development, ACS services, and pre-production testing.",
    items: [
      "ACS Services (APIs, services)",
      "Guacamole – Remote Access Jump Host",
      "Windows Lab VMs (Dev / Test Workstations)",
    ],
  },
  {
    id: "lms",
    name: "LMS Zone",
    vlan: "VLAN 30",
    role: "Learning Management System and course content delivery.",
    items: [
      "LMS App Server (Moodle)",
      "LMS Database (MariaDB / Postgres)",
      "Course Content on Synology NAS (Planned)",
    ],
  },
  {
    id: "prod",
    name: "Production Zone",
    vlan: "VLAN 40",
    role: "Production-like environment for simulations and compliance labs.",
    items: [
      "Active Directory & DNS",
      "File / Application Server",
      "Security Tools – Wazuh, Syslog, Monitoring",
      "Additional Line-of-Business / Simulation VMs (Planned)",
    ],
  },
  {
    id: "vpn",
    name: "VPN Access Zone",
    vlan: "VLAN 60",
    role: "High-capacity secure remote access into the lab.",
    items: [
      "WireGuard VPN (Legacy / Fallback)",
      "VPN Appliance 1 – HP EliteDesk (Netmaker / WireGuard) (Planned)",
      "VPN Appliance 2 – HP EliteDesk (Netmaker / WireGuard) (Planned)",
      "Additional VPN Capacity for >1000 Users (Planned)",
    ],
  },
  {
    id: "range",
    name: "Cyber Range (OpenStack)",
    vlan: "VLAN 50",
    role: "Isolated, disposable cyber ranges for Red/Blue, malware, and advanced labs.",
    items: [
      "OpenStack Controller Node (Planned)",
      "OpenStack Compute Nodes (Planned)",
      "Optional 2nd UniFi Switch for Cyber Range Fabric (Planned)",
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
            Modern, data-center-inspired architecture with segmented zones for Dev, LMS, Production, VPN, and Cyber Range.
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

      {/* Topology strip */}
      <div className="cl-topology">
        {topology.map((node, index) => (
          <React.Fragment key={node}>
            <div className="cl-topology-node glass">
              <span>{node}</span>
              {view === "future" && node.includes("(Planned)") && (
                <span className="cl-badge-planned">Planned</span>
              )}
            </div>
            {index < topology.length - 1 && (
              <div className="cl-topology-link">
                <span className="cl-link-line" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Zones */}
      <div className="cl-zones-grid">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="cl-zone-card glass"
            onClick={() => handleZoneClick(zone)}
          >
            <div className="cl-zone-header">
              <span className="cl-zone-vlan">{zone.name}</span>
              <h3 className="cl-zone-title">{zone.name}</h3>
            </div>
            <p className="cl-zone-role">{zone.role}</p>
            <ul className="cl-zone-items">
              {zone.items.map((item) => {
                const isPlanned = item.toLowerCase().includes("planned");
                return (
                  <li key={item} className="cl-zone-item">
                    <span>{item.replace(" (Planned)", "")}</span>
                    {isPlanned && (
                      <span className="cl-badge-planned">Planned</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
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
              {activeZone.items.map((item) => {
                const isPlanned = item.toLowerCase().includes("planned");
                return (
                  <li key={item} className="cl-zone-item">
                    <span>{item.replace(" (Planned)", "")}</span>
                    {isPlanned && (
                      <span className="cl-badge-planned">Planned</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
