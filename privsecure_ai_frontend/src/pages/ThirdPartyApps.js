import React, { useState, useRef, useEffect } from "react";

// PUBLIC_INTERFACE
// Utility: Local storage persistence helpers
function saveAppsState(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

function loadAppsState(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

// Permissions mapping for readable summary by accessLevel mock (extensible)
const PERMISSIONS_MAP = {
  "Full Drive Access": ["Read/write", "All files (Drive)", "Profile", "Email"],
  "Basic Profile, Messages": ["Profile", "Read messages", "Send messages"],
  "Friends List, Posts": ["Profile", "Friends List", "Post access", "Read posts"],
  "Files (write), Email": ["Read/write", "Files", "Email"],
  "Read Tweets, Profile, Analytics": ["Read tweets", "Profile", "Analytics"],
  "Full Account, Messages": ["Read/write", "All account access", "Messages"]
};

/** 
 * PUBLIC_INTERFACE
 * Categories used for app recommendations (based on app name/accessLevel for mock)
 */
const APP_CATEGORIES = {
  "Google Drive": "cloud",
  "Dropbox Integrate": "cloud",
  "Slack ChatGen": "messaging",
  "SmartConnect AI": "messaging",
  "FaceBook Syncer": "social",
  "QuickTweetbot": "social",
};

/** 
 * Mock alternative apps for each category
 */
const ALTERNATIVE_APPS = {
  cloud: [
    {
      id: 'alt-dropbox',
      logo: "https://cdn-icons-png.flaticon.com/512/732/732221.png",
      name: "Dropbox",
      privacyScore: 97,
      trustLabel: "High",
      permissions: ["Read/write", "Files", "Email"],
      features: ["Cloud sync", "File sharing", "Secure backups"],
      link: "https://www.dropbox.com/",
    },
    {
      id: 'alt-box',
      logo: "https://cdn.icon-icons.com/icons2/2107/PNG/512/file_type_box_logo_icon_130579.png",
      name: "Box Drive",
      privacyScore: 94,
      trustLabel: "High",
      permissions: ["Read/write", "Files only"],
      features: ["Cloud sync", "Team collaboration", "GDPR compliance"],
      link: "https://www.box.com/",
    },
    {
      id: 'alt-nextcloud',
      logo: "https://cdn-icons-png.flaticon.com/512/873/873107.png",
      name: "Nextcloud",
      privacyScore: 91,
      trustLabel: "Very High",
      permissions: ["Self-hosted", "Open-source", "File sync"],
      features: ["Private cloud", "End-to-end encryption"],
      link: "https://nextcloud.com/",
    }
  ],
  messaging: [
    {
      id: 'alt-signal',
      logo: "https://cdn-icons-png.flaticon.com/512/2111/2111624.png",
      name: "Signal",
      privacyScore: 98,
      trustLabel: "Very High",
      permissions: ["Profile", "End-to-end encrypted messages"],
      features: ["Zero-knowledge", "Open source", "No ads"],
      link: "https://signal.org/",
    },
    {
      id: 'alt-discord',
      logo: "https://cdn-icons-png.flaticon.com/512/5968/5968756.png",
      name: "Discord Secure",
      privacyScore: 79,
      trustLabel: "Medium",
      permissions: ["Profile", "Group chats"],
      features: ["Voice/video", "Encrypted DMs"],
      link: "https://discord.com/",
    },
    {
      id: 'alt-matrix',
      logo: "https://matrix.org/_matrix/static/favicon.png",
      name: "Matrix",
      privacyScore: 92,
      trustLabel: "High",
      permissions: ["Federated identity", "E2EE Chats"],
      features: ["Decentralized", "Bridges for Slack/Discord"],
      link: "https://matrix.org/",
    }
  ],
  social: [
    {
      id: 'alt-mastodon',
      logo: "https://cdn-icons-png.flaticon.com/512/5968/5968759.png",
      name: "Mastodon",
      privacyScore: 95,
      trustLabel: "High",
      permissions: ["Profile", "Posts"],
      features: ["Decentralized", "Federated timeline"],
      link: "https://joinmastodon.org/",
    },
    {
      id: 'alt-mewe',
      logo: "https://cdn-icons-png.flaticon.com/512/1250/1250689.png",
      name: "MeWe",
      privacyScore: 90,
      trustLabel: "High",
      permissions: ["Profile", "Posts"],
      features: ["No ads", "No tracking", "Groups"],
      link: "https://mewe.com/",
    },
    {
      id: 'alt-diaspora',
      logo: "https://cdn-icons-png.flaticon.com/512/726/726807.png",
      name: "Diaspora",
      privacyScore: 88,
      trustLabel: "Good",
      permissions: ["Profile only"],
      features: ["Open source", "No central ownership"],
      link: "https://diasporafoundation.org/",
    }
  ]
};

// Helper for trust bar (score + text/icon)
function TrustScore({ score, label, color }) {
  let icon = "🔒";
  if (score > 85) icon = "🟢";
  else if (score > 70) icon = "🟡";
  else if (score > 50) icon = "🟠";
  else icon = "🔴";
  return (
    <div
      title={`Trust: ${label} (${score}/100)`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        fontWeight: 600,
        fontSize: ".99em",
        letterSpacing: ".03em",
        color: color,
        opacity: .99,
        fontFamily: "'Montserrat', 'Poppins', sans-serif"
      }}
    >
      <span aria-hidden="true" style={{ fontSize: "1.29em" }}>{icon}</span>
      <span style={{ marginRight: 4 }}>{label}</span>
      <span style={{
        minWidth: 31,
        fontSize: ".88em",
        color: "#6d7f98",
        opacity: 0.69
      }}>{score}/100</span>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Themed modal for the "Replace" flow: opens with a curated list of mock alternative apps for the selected app's category.
 * Shows name, logo, privacy score, core features, and download/integrate link.
 */
function ReplaceAlternativeModal({ open, onClose, app, alternatives, onChooseAlternative }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  if (!open || !app) return null;

  // Fallback category if not in APP_CATEGORIES
  const category = APP_CATEGORIES[app.name] || "cloud";
  const altList = (alternatives && alternatives.length > 0) ? alternatives : (ALTERNATIVE_APPS[category] || []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className="replace-alt-modal-backdrop"
      style={{
        position: "fixed",
        zIndex: 9000,
        top: 0, left: 0, width: "100vw", height: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(12,34,36,0.51)",
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        tabIndex={0}
        className="replace-alt-modal"
        role="document"
        style={{
          minWidth: 380,
          maxWidth: "98vw",
          background: "var(--background)",
          border: "2.7px solid var(--primary)",
          borderTop: "18px solid var(--accent)",
          borderRadius: "22px",
          boxShadow: "0 8px 45px 0 rgba(19,185,185,0.12), 0 8px 44px 0 rgba(5,92,92,0.24)",
          color: "var(--text-primary)",
          fontFamily: "'Poppins','Montserrat','Lato','Raleway','Arial',sans-serif",
          padding: "36px 38px 32px",
          zIndex: 10001,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          position: "relative",
          outline: "none",
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          aria-label="Close alternatives dialog"
          onClick={onClose}
          style={{
            position: "absolute", top: 13, right: 16,
            width: 39, height: 39, background: "var(--accent)",
            color: "#fff", border: "none", borderRadius: "50%",
            fontSize: "1.67rem", fontWeight: 900, cursor: "pointer",
            boxShadow: "0 0 0 4px var(--surface), 0 4px 18px 2px var(--primary)"
          }}
        ><span aria-hidden="true">&times;</span></button>
        <div style={{
          fontWeight: 800,
          fontSize: "1.36em",
          color: "var(--primary)",
          letterSpacing: ".05em",
          marginBottom: 11,
          marginTop: 2,
          textShadow: "0 0 10px var(--accent), 0 0 4px var(--surface)",
          fontFamily: "'Merriweather','Montserrat','Poppins',serif"
        }}>{`Recommended Alternatives for "${app.name}"`}</div>
        <div style={{
          color: "var(--secondary)",
          fontFamily: "'Montserrat',sans-serif",
          fontSize: "1.05em",
          marginBottom: 14,
          letterSpacing: ".02em"
        }}>
          Select a trusted alternative below to replace your current app. All options meet high privacy standards.
        </div>
        <div className="alt-modal-list" style={{
          width: "100%",
          display: "flex", flexDirection: "column", gap: 18,
          marginBottom: 10,
        }}>
          {altList.map((alt, idx) => (
            <div
              key={alt.id || alt.name || idx}
              className="card"
              style={{
                background: "#f9fcff",
                border: "1.5px solid var(--border-color)",
                borderRadius: 13,
                boxShadow: "0 0 7px 2px var(--accent)55",
                display: "flex", alignItems: "center",
                padding: "14px 13px", gap: 15,
                marginBottom: 2, width: "100%", maxWidth: 540
              }}
            >
              <img src={alt.logo} alt={alt.name + " logo"} style={{
                width: 48, height: 48, borderRadius: 9,
                border: "2px solid var(--primary)",
                boxShadow: "0 0 9px 2px var(--accent)22",
                background: "#f7f6ff", marginRight: 2
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 700, color: "var(--primary)",
                  fontFamily: "'Montserrat',sans-serif", fontSize: "1.1em"
                }}>{alt.name}</div>
                <div style={{
                  color: "var(--secondary)",
                  fontSize: ".96em",
                  marginBottom: 2, marginTop: 0
                }}>
                  Privacy Score: <strong>{alt.privacyScore}</strong> / 100
                  <span style={{
                    marginLeft: 11,
                    background: "var(--accent)",
                    color: "#fff",
                    fontWeight: 700, borderRadius: 5,
                    padding: "2.7px 9px",
                    fontSize: ".91em",
                  }}>{alt.trustLabel}</span>
                </div>
                <div style={{
                  fontSize: ".94em", color: "#247", marginBottom: 2
                }}>
                  Features: {alt.features.slice(0, 3).join(", ")}
                </div>
                <div style={{
                  fontSize: ".93em",
                  color: "#36ab5b",
                  opacity: .77,
                }}>
                  Permissions: <span style={{ color: "#267" }}>{(alt.permissions || []).join(", ")}</span>
                </div>
              </div>
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, minWidth: 110
              }}>
                <a
                  href={alt.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{
                    background: "linear-gradient(93deg, var(--primary) 62%, var(--secondary) 100%)",
                    color: "#fff",
                    borderRadius: 8, fontSize: '.98em',
                    fontWeight: 700,
                    padding: "8px 14px", boxShadow: "0 0 9px 2px var(--primary)",
                    marginBottom: 4, textAlign: "center", outline: "none", display: "block"
                  }}
                >
                  Download / Learn More
                </a>
                <button
                  className="btn"
                  style={{
                    background: "linear-gradient(98deg, #e4fff0, var(--accent))",
                    color: "var(--primary)", border: "1.2px solid var(--primary)",
                    borderRadius: 8, fontWeight: 700,
                    padding: "8px 14px", outline: "none",
                  }}
                  onClick={() => onChooseAlternative && onChooseAlternative(alt)}
                >
                  Replace with {alt.name}
                </button>
              </div>
            </div>
          ))}
        </div>
        <span style={{
          marginTop: 3, color: "var(--secondary)", fontWeight: 500, fontSize: ".99em"
        }}>
          Swapping to a higher-trust app grants you privacy points and a badge!
        </span>
      </div>
      <style>
        {`
        .replace-alt-modal-backdrop { animation: fadeIn 0.14s; }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        .replace-alt-modal:focus {
          outline: 2px solid var(--accent);
          box-shadow: 0 0 0 2px var(--primary), 0 0 18px 3px var(--accent);
        }
        .replace-alt-modal button[aria-label="Close alternatives dialog"]:focus {
          box-shadow: 0 0 0 5px var(--primary), 0 0 18px 4px var(--accent);
          outline: 3px solid var(--accent);
        }
        `}
      </style>
    </div>
  );
}

// --- REPLACE AppCard Replace logic to open modal ---
function AppCard({ app, onRevokeClick, onReplaceClick, revoked, replaced, replacedBy, disabled }) {
  return (
    <div
      className="card"
      style={{
        height: "100%",
        border: revoked
          ? "1.6px solid #dbe8eb"
          : replaced
          ? "1.9px solid #0fdbae"
          : "1.6px solid var(--border-color)",
        borderRadius: 15,
        boxShadow: revoked
          ? "0 0 18px 2px #d7dfdf, 0 0 11px 3px #e8e8e899"
          : replaced
          ? "0 0 17px 5px #0fdbae77, 0 0 8px 2px #13b9b9 inset"
          : "0 0 18px 2px var(--surface), 0 0 11px 3px var(--accent) inset",
        background: revoked
          ? "linear-gradient(99deg,#f7f9fa 90%, #e2edef 100%)"
          : replaced
          ? "linear-gradient(99deg,#f6fffb 90%, #e6fff6 100%)"
          : "linear-gradient(99deg,var(--surface) 90%, #e4fdfd 100%)",
        padding: "26px 22px 22px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        minWidth: 0,
        maxWidth: 320,
        margin: "auto",
        transition: "box-shadow 0.18s, background 0.19s, border 0.18s",
        filter: revoked ? "grayscale(0.84)" : "none",
        opacity: revoked ? 0.64 : replaced ? 0.93 : 1,
        pointerEvents: disabled ? "none" : "auto",
        position: "relative",
      }}
      tabIndex={revoked ? -1 : 0}
      aria-label={app.name + (revoked ? " (revoked)" : replaced ? " (replaced)" : "")}
      aria-disabled={revoked}
    >
      {(replaced && replacedBy) && (
        <div style={{
          position: "absolute",
          top: 3, right: 7,
          background: "linear-gradient(92deg,#0fdbae 60%,var(--accent) 100%)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.92em",
          borderRadius: 8,
          boxShadow: "0 0 6px 1.7px #13b9b9cc",
          padding: "3.5px 13px 3px",
          zIndex: 3,
          letterSpacing: ".02em",
          fontFamily: "'Montserrat',sans-serif"
        }}>
          Replaced by {replacedBy.name}
        </div>
      )}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 9,
        width: "100%"
      }}>
        {/* Logo */}
        <img
          src={app.logo}
          alt={`${app.name} logo`}
          style={{
            width: 48,
            height: 48,
            borderRadius: 11,
            border: `2.2px solid ${app.trustColor}`,
            boxShadow: `0 0 9px 1.5px ${app.trustColor}`,
            background: "#fff",
            objectFit: "cover",
            marginRight: 2,
            marginLeft: 2
          }}
        />
        {/* Name & Access */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 800,
            color: "var(--primary)",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "1.13em",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            marginBottom: 2
          }}>{app.name}</div>
          <div style={{
            color: "var(--text-secondary)",
            fontFamily: "'Lato','Montserrat',sans-serif",
            fontSize: ".97em",
            fontWeight: 600,
            opacity: .67
          }}>
            {app.accessLevel}
          </div>
        </div>
      </div>
      {/* Trust rating */}
      <div style={{
        margin: "10px 0 13px 2px",
        width: "100%",
        display: "flex",
        alignItems: "center"
      }}>
        <TrustScore score={app.trust} label={app.trustLabel} color={app.trustColor} />
      </div>
      {/* Actions Row */}
      <div style={{
        display: "flex",
        gap: 11,
        marginTop: "auto",
        width: "100%",
        justifyContent: "flex-end"
      }}>
        <button
          className="btn"
          style={{
            background: `linear-gradient(90deg,${app.trustColor} 50%,var(--primary) 95%)`,
            color: "#fff",
            fontWeight: 700,
            fontFamily: "'Montserrat', 'Poppins', sans-serif",
            border: "none",
            borderRadius: 8,
            padding: "9.5px 18px",
            boxShadow: `0 0 15px 2px ${app.trustColor}44`,
            letterSpacing: ".02em",
            fontSize: "1.03em",
            opacity: revoked ? 0.6 : 1,
            pointerEvents: revoked ? "none" : "auto"
          }}
          tabIndex={revoked ? -1 : 0}
          aria-label={`Revoke access for ${app.name}`}
          disabled={revoked || disabled}
          onClick={() => !revoked && !disabled && onRevokeClick(app)}
        >
          Revoke
        </button>
        <button
          className="btn"
          style={{
            background: "linear-gradient(90deg,#e6f3fc 10%, var(--accent) 110%)",
            color: "var(--primary)",
            fontWeight: 700,
            border: "1.3px solid var(--accent)",
            borderRadius: 8,
            padding: "9.5px 18px",
            marginLeft: "-1px",
            fontFamily: "'Montserrat', 'Poppins', sans-serif",
            boxShadow: "0 0 5px 1px var(--accent)55 inset",
            letterSpacing: ".01em",
            fontSize: "1.03em",
            opacity: revoked || replaced ? 0.5 : 1,
            pointerEvents: revoked || replaced ? "none" : "auto"
          }}
          tabIndex={revoked ? -1 : 0}
          aria-label={`Replace or reconnect ${app.name}`}
          disabled={revoked || replaced || disabled}
          onClick={() => !revoked && !replaced && !disabled && onReplaceClick && onReplaceClick(app)}
        >
          Replace
        </button>
      </div>
    </div>
  );
}

/*
  Enhanced AlternativeAppsModal: 
  - Implements three key Replace flow actions: 
    1) Install [App] (simulate, UI change) 
    2) View detailed comparison (in-place sub-modal dialog) 
    3) Revoke old & Install new (simulate both, update UI, reward points)
*/

function AlternativeAppsModal({ open, onClose, app, onReplace, alternatives, onReplaceAdvanced }) {
  const containerRef = useRef(null);

  // State for advanced actions
  const [installingId, setInstallingId] = useState(null); // alt.id that's currently "installing"
  const [showComparisonId, setShowComparisonId] = useState(null); // alt.id that's being compared
  const [revokeInstallId, setRevokeInstallId] = useState(null); // alt.id doing both
  const [simStep, setSimStep] = useState(""); // step state

  // Accessible close on Esc
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Focus trap on open
  useEffect(() => {
    if (open && containerRef.current) {
      containerRef.current.focus();
    }
  }, [open]);

  if (!open || !app) return null;
  const category = APP_CATEGORIES[app.name] || "cloud";
  const appAlternatives = alternatives || ALTERNATIVE_APPS[category] || [];

  // Mock detailed features for demo (expandable for each alt)
  const MOCK_FEATURE_COMPARISON = (alt) => [
    { label: 'End-to-End Encryption', alt: alt.features.includes("End-to-end encryption") || alt.features.includes("Zero-knowledge") ? "✔️" : "—", orig: app.trust > 70 ? "✔️" : "—" },
    { label: 'Open Source', alt: alt.features.join(' ').toLowerCase().includes("open") ? "✔️" : "—", orig: app.trustLabel === "High" ? "✔️" : "—" },
    { label: 'Ads/Tracking', alt: alt.features.some(f => /ad|tracking/i.test(f)) ? "Yes" : "No", orig: "Yes" },
    { label: 'Federated/Decentralized', alt: alt.features.find(f => /decentralized|federated/i.test(f)) ? "✔️" : "—", orig: "—" },
    { label: 'Cloud sync', alt: alt.features.includes("Cloud sync") ? "✔️" : "—", orig: "✔️" },
  ];

  // Simulate install by UI step
  function handleInstallClick(alt) {
    setInstallingId(alt.id);
    setSimStep("install");
    setTimeout(() => setSimStep("installed"), 870);
    setTimeout(() => {
      setInstallingId(null);
      setSimStep("");
    }, 1850);
  }

  // Simulate revoke & install
  function handleRevokeInstall(alt) {
    setRevokeInstallId(alt.id);
    setSimStep("revoke");
    setTimeout(() => setSimStep("install"), 700);
    setTimeout(() => setSimStep("installed"), 1720);
    setTimeout(() => {
      setRevokeInstallId(null);
      setSimStep("");
      // Actually call parent to update replaced
      onReplaceAdvanced && onReplaceAdvanced(alt);
    }, 2200);
  }

  // Show submodal/pane with feature comparison
  function handleCompareOpen(alt) {
    setShowComparisonId(alt.id);
  }
  function handleCompareClose() {
    setShowComparisonId(null);
  }

  // For submodal overlay for feature comparison
  function ComparisonModal({ alt, open, onClose }) {
    if (!open || !alt) return null;
    const comparisonRows = MOCK_FEATURE_COMPARISON(alt);
    return (
      <div
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        style={{
          position: "fixed",
          zIndex: 30100,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(12,34,36,0.57)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "fadeIn 0.13s",
        }}
        onClick={onClose}
      >
        <div
          tabIndex={0}
          style={{
            minWidth: 333,
            maxWidth: "90vw",
            background: "var(--background)",
            border: "2.2px solid var(--accent)",
            borderTop: "14px solid var(--primary)",
            borderRadius: "19px",
            boxShadow: "0 4px 34px 0 rgba(19,185,185,0.23), 0 9px 36px 0 rgba(5,92,92,0.15)",
            color: "var(--text-primary)",
            padding: "28px 30px 24px 30px",
            zIndex: 30501,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            transition: "box-shadow 0.15s",
            outline: "none",
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label="Close comparison"
            style={{
              position: "absolute", top: 9, right: 13,
              background: "var(--accent)", color: "#fff",
              border: "none", borderRadius: "50%",
              width: 35, height: 35, fontWeight: 800,
              fontSize: "1.34em", cursor: "pointer",
              boxShadow: "0 0 0 2px var(--background), 0 0 18px 1.5px var(--primary)"
            }}
          >
            ×
          </button>
          <div style={{
            fontWeight: 600, fontSize: "1.18em",
            color: "var(--primary)", letterSpacing: ".04em",
            marginBottom: 11, marginTop: 1,
            textShadow: "0 0 8px var(--accent), 0 0 4px var(--surface)",
            fontFamily: "'Montserrat', 'Poppins', serif"
          }}>
            Feature Comparison: {alt.name} vs {app.name}
          </div>
          <table style={{
            borderCollapse: "collapse", width: "100%",
            fontSize: ".98em",
            marginBottom: 6,
          }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "3px 9px 3px 0", color: "var(--secondary)", borderBottom: "1.2px solid var(--border-color)" }}>Feature</th>
                <th style={{ textAlign: "center", color: "var(--primary)" }}>{alt.name}</th>
                <th style={{ textAlign: "center", color: "var(--primary)" }}>{app.name}</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr key={row.label}>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)", padding: "5px 9px 5px 0" }}>{row.label}</td>
                  <td style={{ textAlign: "center", color: "var(--accent)" }}>{row.alt}</td>
                  <td style={{ textAlign: "center", color: "#888" }}>{row.orig}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: ".96em", marginTop: 12, color: "var(--text-secondary)", letterSpacing: ".02em" }}>
            Choose a privacy-forward alternative for enhanced protection and bonus points!
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Alternative apps for ${app.name}`}
      tabIndex={-1}
      className="alt-modal-backdrop"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(12,34,36,0.45)",
        zIndex: 23000,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}
      onClick={onClose}
    >
      <div
        className="alt-modal"
        ref={containerRef}
        role="document"
        tabIndex={0}
        style={{
          background: "var(--background)",
          border: "2.7px solid var(--primary)",
          borderTop: "17px solid var(--accent)",
          borderRadius: "19px",
          boxShadow: "0 4px 35px 0 rgba(19,185,185,0.21), 0 9px 54px 0 rgba(5,92,92,0.16)",
          padding: "37px 28px 28px",
          color: "var(--text-primary)",
          minWidth: 380,
          maxWidth: "98vw",
          outline: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          transition: "box-shadow 0.2s",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close alternatives dialog"
          onClick={onClose}
          style={{
            position: "absolute", top: 13, right: 14,
            width: 36, height: 36, background: "var(--accent)",
            color: "#fff", border: "none", borderRadius: "50%",
            fontSize: "1.5rem", fontWeight: 900, cursor: "pointer",
            boxShadow: "0 0 0 4px var(--surface), 0 4px 18px 2px var(--primary)"
          }}
        ><span aria-hidden="true">&times;</span></button>
        <div style={{
          fontWeight: 800,
          fontSize: "1.31em",
          color: "var(--primary)",
          letterSpacing: ".04em",
          marginBottom: 13,
          marginTop: 2,
          textShadow: "0 0 10px var(--accent), 0 0 5px var(--surface)",
          fontFamily: "'Merriweather','Montserrat','Poppins',serif"
        }}>{`Recommended Alternatives: ${app.name}`}</div>
        <div className="alt-modal-list" style={{
          width: "100%",
          display: "flex", flexDirection: "column", gap: 18,
          marginBottom: 7,
        }}>
          {appAlternatives.map((alt) => (
            <div key={alt.id} className="card"
              style={{
                background: "#f9fcff",
                border: "1.5px solid var(--border-color)",
                borderRadius: 13,
                boxShadow: "0 0 7px 2px var(--accent)55",
                display: "flex", alignItems: "center",
                padding: "14px 13px", gap: 15,
                marginBottom: 2,
                width: "100%",
                maxWidth: 540,
                position: "relative"
              }}
            >
              {/* Comparison Sub-modal */}
              {showComparisonId === alt.id && (
                <ComparisonModal
                  alt={alt}
                  open={showComparisonId === alt.id}
                  onClose={handleCompareClose}
                />
              )}

              <img src={alt.logo} alt={alt.name + " logo"} style={{
                width: 48, height: 48, borderRadius: 9,
                border: "2px solid var(--primary)",
                boxShadow: "0 0 9px 2px var(--accent)22",
                background: "#f7f6ff", marginRight: 2
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 700, color: "var(--primary)",
                  fontFamily: "'Montserrat',sans-serif", fontSize: "1.1em"
                }}>{alt.name}</div>
                <div style={{
                  color: "var(--secondary)",
                  fontSize: ".96em",
                  marginBottom: 2, marginTop: 0
                }}>
                  Privacy Score: <strong>{alt.privacyScore}</strong> / 100
                  <span style={{
                    marginLeft: 11,
                    background: "var(--accent)",
                    color: "#fff",
                    fontWeight: 700, borderRadius: 5,
                    padding: "2.7px 9px",
                    fontSize: ".91em",
                  }}>{alt.trustLabel}</span>
                </div>
                <div style={{
                  fontSize: ".94em", color: "#247", marginBottom: 2
                }}>
                  Features: {alt.features.slice(0, 3).join(", ")}
                </div>
                <div style={{
                  fontSize: ".93em",
                  color: "#36ab5b",
                  opacity: .77,
                }}>
                  Permissions: <span style={{ color: "#267" }}>{(alt.permissions || []).join(", ")}</span>
                </div>
              </div>
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 7, minWidth: 135
              }}>
                {/* 1. Install only */}
                <button
                  className="btn"
                  style={{
                    background: installingId === alt.id
                      ? "linear-gradient(94deg, #baffee 62%, #c6f5ea 98%)"
                      : "linear-gradient(93deg, var(--primary) 62%, var(--secondary) 100%)",
                    color: installingId === alt.id ? "var(--primary)" : "#fff",
                    borderRadius: 8,
                    fontSize: '.98em',
                    fontWeight: 700,
                    padding: "8px 16px",
                    marginBottom: 3,
                    outline: "none",
                    display: "block",
                    opacity: revokeInstallId === alt.id ? 0.64 : 1,
                    pointerEvents: revokeInstallId === alt.id ? "none" : "auto",
                  }}
                  disabled={!!installingId || !!revokeInstallId}
                  onClick={() => !installingId && handleInstallClick(alt)}
                  aria-label={`Install ${alt.name} (simulate)`}
                >
                  {installingId === alt.id
                    ? simStep === "installed" ? "Installed!" : "Installing…"
                    : `Install ${alt.name}`}
                </button>

                {/* 2. Show comparison */}
                <button
                  className="btn"
                  style={{
                    background: "linear-gradient(100deg, #f1fff4 10%, #eaf7fc 95%)",
                    color: "var(--primary)",
                    border: "1.2px solid var(--primary)",
                    borderRadius: 8,
                    fontWeight: 700,
                    padding: "7px 14px",
                    outline: "none",
                    display: "block",
                    fontSize: ".97em",
                  }}
                  onClick={() => handleCompareOpen(alt)}
                  aria-label={`Show comparison for ${alt.name}`}
                  disabled={!!installingId || !!revokeInstallId}
                >
                  View detailed comparison
                </button>

                {/* 3. Revoke & Install */}
                <button
                  className="btn"
                  style={{
                    background:
                      revokeInstallId === alt.id
                        ? "linear-gradient(86deg, #e0fcfa 70%, #d4ffe6 99%)"
                        : "linear-gradient(91deg, #e3fcea 12%, #b0fff1 95%)",
                    color: "var(--primary)",
                    filter: revokeInstallId === alt.id ? "brightness(1.13)" : "none",
                    fontWeight: 900,
                    border: "1.5px solid var(--accent)",
                    borderRadius: 8,
                    marginTop: 3,
                    padding: "9px 14px",
                    outline: "none",
                    fontSize: "1.01em",
                  }}
                  onClick={() => !revokeInstallId && handleRevokeInstall(alt)}
                  disabled={!!installingId || !!revokeInstallId}
                  aria-label={`Revoke & install ${alt.name} (simulate)`}
                >
                  {revokeInstallId === alt.id
                    ? simStep === "installed"
                      ? "Replaced!"
                      : simStep === "revoke"
                        ? "Revoking old app…"
                        : "Installing new app…"
                    : `Revoke old app & Install new one`}
                </button>
              </div>
            </div>
          ))}
        </div>
        <span style={{
          marginTop: 3, color: "var(--secondary)", fontWeight: 500, fontSize: ".99em"
        }}>
          Upgrading to a more private or trusted alternative can award you privacy points or badges!
        </span>
      </div>
    </div>
  );
}

/* 
Mock Apps (unchanged from original)
*/
const MOCK_APPS = [
  {
    id: 1,
    logo: "https://cdn-icons-png.flaticon.com/512/732/732200.png", // Google
    name: "Google Drive",
    accessLevel: "Full Drive Access",
    trust: 89,
    trustLabel: "High",
    trustColor: "#0fdbae",
  },
  {
    id: 2,
    logo: "https://cdn-icons-png.flaticon.com/512/220/220236.png", // Slack
    name: "Slack ChatGen",
    accessLevel: "Basic Profile, Messages",
    trust: 76,
    trustLabel: "Medium",
    trustColor: "#13b9b9",
  },
  {
    id: 3,
    logo: "https://cdn-icons-png.flaticon.com/512/174/174857.png", // Facebook
    name: "FaceBook Syncer",
    accessLevel: "Friends List, Posts",
    trust: 58,
    trustLabel: "Low",
    trustColor: "#E87A41",
  },
  {
    id: 4,
    logo: "https://cdn-icons-png.flaticon.com/512/732/732221.png", // Dropbox
    name: "Dropbox Integrate",
    accessLevel: "Files (write), Email",
    trust: 91,
    trustLabel: "High",
    trustColor: "#0fdbae",
  },
  {
    id: 5,
    logo: "https://cdn-icons-png.flaticon.com/512/270/270798.png", // Twitter
    name: "QuickTweetbot",
    accessLevel: "Read Tweets, Profile, Analytics",
    trust: 61,
    trustLabel: "Medium",
    trustColor: "#13b9b9",
  },
  {
    id: 6,
    logo: "https://cdn-icons-png.flaticon.com/512/888/888879.png", // ChatGPT mock
    name: "SmartConnect AI",
    accessLevel: "Full Account, Messages",
    trust: 34,
    trustLabel: "Critical",
    trustColor: "#ff4e8a",
  },
];

// Main ThirdPartyApps component
function ThirdPartyApps() {
  // Try to initialize from localStorage or fallback to defaults
  const [apps, setApps] = useState(() =>
    loadAppsState("psai-apps-list", MOCK_APPS.map(a => ({ ...a })))
  );
  const [revokedIds, setRevokedIds] = useState(() =>
    loadAppsState("psai-revoked-ids", [])
  );
  const [score, setScore] = useState(() =>
    loadAppsState("psai-privacy-score", calculatePrivacyScore(MOCK_APPS, []))
  );
  // For replaced apps
  const [replacedIds, setReplacedIds] = useState({});
  const [replacedMap, setReplacedMap] = useState({});
  const [modal, setModal] = useState({ open: false, app: null, type: null });
  const [alternatives, setAlternatives] = useState([]);
  const [replaceSuccess, setReplaceSuccess] = useState({ show: false, altApp: null, origApp: null });

  // Handler for clicking Revoke (open modal)
  const handleRevokeClick = (app) => {
    setModal({ open: true, app, type: "revoke" });
  };

  // Handler for Replace click (open alternative modal)
  const handleReplaceClick = (app) => {
    const cat = APP_CATEGORIES[app.name] || "cloud";
    setAlternatives(ALTERNATIVE_APPS[cat] || []);
    setModal({ open: true, app, type: "replace" });
  };

  // Handler: on basic replacement (not advanced flow), fallback
  const handleReplaceWith = (altApp) => {
    // fallback: legacy, single click replace, not used in new modal
    handleReplaceWithAdvanced(altApp);
  };

  // Advanced replace: triggered by "Revoke old & Install new" button
  const handleReplaceWithAdvanced = (altApp) => {
    const origId = modal.app.id;
    setModal({ open: false, app: null, type: null });
    setReplacedIds(prev => ({ ...prev, [origId]: true }));
    setReplacedMap(prev => ({ ...prev, [origId]: altApp }));
    setReplaceSuccess({ show: true, altApp, origApp: modal.app });
    setTimeout(() => setReplaceSuccess({ show: false, altApp: null, origApp: null }), 6000);
    // Award privacy point(s)
    setScore(prev => Math.min(100, prev + 7)); // Give slightly more for the full flow
  };

  // Handler: close any modal
  const handleModalCancel = () => setModal({ open: false, app: null, type: null });

  // Calculate privacy score (demo only)
  function calculatePrivacyScore(appList, revokedList) {
    const unrevoked = appList.filter(a => !revokedList.includes(a.id));
    if (unrevoked.length === 0) return 0;
    return Math.round(
      unrevoked.reduce((sum, app) => sum + (app.trust || 0), 0) / unrevoked.length
    );
  }

  // PRIVACY SCORE BADGE/BAR at top
  function PrivacyScoreRiskIndicator() {
    let label = "High";
    let color = "#0fdbae";
    let bgGradient = "linear-gradient(90deg,#f2fcff 80%,#e3fbfb 100%)";
    if (score <= 70 && score > 50) {
      label = "Medium"; color = "#13b9b9";
      bgGradient = "linear-gradient(90deg,#f7fdfc 60%,#e6fbea 100%)";
    } else if (score <= 50 && score > 30) {
      label = "Low"; color = "#E87A41";
      bgGradient = "linear-gradient(90deg,#f8f5f9 75%,#ffe7ec 100%)";
    } else if (score <= 30) {
      label = "Critical"; color = "#ff4e8a";
      bgGradient = "linear-gradient(90deg,#fcf3fb 80%,#ffe1f3 100%)";
    }
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 12, marginBottom: 37,
        background: bgGradient, borderRadius: 14, boxShadow: "0 6px 24px 1px " + color + "13",
        padding: "16px 32px 15px 22px", border: "1.7px solid " + color, width: 330, maxWidth: "99vw"
      }} aria-label={`Privacy exposure score: ${score}. Risk: ${label}`}>
        <span style={{
          fontWeight: 700, fontFamily: "'Montserrat',sans-serif", letterSpacing: ".03em",
          color: color, fontSize: "1.08em"
        }}>
          <span style={{ fontSize: "1.3em", marginRight: 8 }}>🛡️</span>
          Privacy Risk:
        </span>
        <span style={{
          marginLeft: 6, color, fontWeight: 900, fontSize: "1.23em",
          letterSpacing: ".03em"
        }}>
          {label}
        </span>
        <span style={{
          borderRadius: 7, background: color + "16", color: color, marginLeft: 9,
          fontWeight: 600, fontSize: "1.04em", padding: "2px 12px"
        }}>
          {score}/100
        </span>
      </div>
    );
  }

  // Modal rendering logic
  const renderModal = () => {
    if (!modal.open) return null;
    if (modal.type === "replace" && modal.app) {
      return (
        <AlternativeAppsModal
          open={true}
          app={modal.app}
          onClose={handleModalCancel}
          onReplace={handleReplaceWith}
          onReplaceAdvanced={handleReplaceWithAdvanced}
          alternatives={alternatives}
        />
      );
    }
    // Add Revoke modal if needed (omitted for brevity)
    return null;
  };

  return (
    <div className="container" style={{
      marginTop: 56,
      background: "var(--surface)",
      borderRadius: "var(--border-radius)",
      boxShadow: "var(--box-shadow)",
      maxWidth: 1120,
      minHeight: 440,
      width: "100%",
      color: "var(--text-primary)",
      padding: "44px 30px 35px",
      position: "relative"
    }}>
      <h1
        className="title"
        style={{
          fontFamily: "'Merriweather','Montserrat',serif",
          color: "var(--primary)",
          fontSize: "2.13rem",
          fontWeight: 900,
          marginBottom: 7,
          textShadow: "0 0 14px var(--accent), 0 0 6px var(--surface), 0 0 18px var(--primary)",
          letterSpacing: ".04em"
        }}
      >
        Third-Party App Scanner
      </h1>
      <PrivacyScoreRiskIndicator />

      <div
        className="subtitle"
        style={{
          color: "var(--accent)",
          fontWeight: 600,
          fontSize: "1.11rem",
          marginBottom: 30
        }}
      >
        Review your connected apps. Revoke risky access and replace trusted services instantly.
      </div>

      <div
        className="dashboard-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(275px, 1fr))",
          gap: "32px",
          alignItems: "stretch",
          marginBottom: 0,
          width: "100%",
          maxWidth: 1390,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {apps.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            revoked={revokedIds.includes(app.id)}
            replaced={!!replacedIds[app.id]}
            replacedBy={replacedMap[app.id]}
            onRevokeClick={handleRevokeClick}
            onReplaceClick={handleReplaceClick}
            disabled={!!modal.open || replacedIds[app.id]}
          />
        ))}
      </div>
      {renderModal()}

      {replaceSuccess.show && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: 32,
            transform: "translateX(-50%)",
            background: "linear-gradient(90deg, #e0faf7 65%, #e1f7e4 100%)",
            color: "var(--primary)",
            boxShadow: "0 8px 25px 5px var(--accent), 0 0 8px 1px var(--primary)",
            border: "1.9px solid var(--primary)",
            borderRadius: 13,
            padding: "19px 34px 18px 30px",
            zIndex: 9999,
            minWidth: 258,
            maxWidth: "90vw",
            display: "flex",
            alignItems: "center",
            fontWeight: 700,
            fontSize: "1.07em"
          }}
          aria-live="polite"
          role="status"
          tabIndex={0}
        >
          🎉 Switched from {replaceSuccess.origApp && replaceSuccess.origApp.name} 
          to <span style={{ color: "var(--accent)", marginLeft: 5 }}>{replaceSuccess.altApp && replaceSuccess.altApp.name}</span>!
          &nbsp; <span role="img" aria-label="badge" style={{marginLeft:7}}>🏅</span>
          <span style={{
            color: "#36b975",
            background: "#e8fcf1",
            borderRadius: 7,
            padding: "2.5px 8px",
            fontWeight: 700,
            marginLeft: 10,
            fontSize: ".95em",
            border: "1px solid #43b99299"
          }}>
            Privacy Points Awarded
          </span>
        </div>
      )}
      {/* Style overrides for mobile grid */}
      <style>
        {`
        @media (max-width: 1050px) {
          .dashboard-grid {
            grid-template-columns: 1fr 1fr;
            gap: 18px;
            padding-left: 0;
            padding-right: 0;
          }
        }
        @media (max-width: 700px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 10px;
            padding: 0 1vw;
          }
          .dashboard-grid > * {
            min-width: 0 !important;
            max-width: 97vw !important;
            margin-left: 0 !important;
          }
        }
        `}
      </style>
    </div>
  );
}

export default ThirdPartyApps;
