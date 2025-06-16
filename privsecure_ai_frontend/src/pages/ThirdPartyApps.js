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
 * ThirdPartyApps: Responsive grid view showing connected third-party apps' logos, name, access, trust rating & themed Revoke/Replace buttons.
 * Layout: Clean, modern, consistent with App theme. Uses mock app data. No backend.
 */
const MOCK_APPS = [
  {
    id: 1,
    logo: "https://cdn-icons-png.flaticon.com/512/732/732200.png", // Google
    name: "Google Drive",
    accessLevel: "Full Drive Access",
    trust: 89, // 0-100 trust
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
 * RevokeModal: Accessible, themed confirmation modal for app revoke flow.
 * Props:
 *   - open: If true, modal is shown
 *   - app: App object (with .name)
 *   - permissions: permission summary array
 *   - onConfirm: function (id) to call when confirmed
 *   - onCancel: function to close/cancel
 *
 * Theme: app's white, deep teal, light teal; rounded corners, drop shadow, focus trap, accessible close
 */
function RevokeModal({ open, app, permissions, onConfirm, onCancel }) {
  const modalRef = useRef(null);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onCancel]);

  // Focus trap: focus modal on open, restore after
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    modalRef.current && modalRef.current.focus();
    return () => prev && prev.focus && prev.focus();
  }, [open]);

  if (!open || !app) return null;
  return (
    <div
      className="themed-confirm-modal-backdrop"
      aria-modal="true"
      aria-labelledby="revoke-modal-title"
      role="dialog"
      tabIndex={-1}
      style={{
        position: "fixed",
        zIndex: 12000,
        top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(12,34,36,0.36)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.18s",
        animation: "fadeModalIn .19s"
      }}
      onClick={onCancel}
    >
      {/* "Portal" modal inner – prevents propagation of outer click */}
      <div
        ref={modalRef}
        role="document"
        tabIndex={0}
        aria-modal="true"
        aria-labelledby="revoke-modal-title"
        onClick={e => e.stopPropagation()}
        style={{
          minWidth: 345,
          maxWidth: "96vw",
          background: "var(--background)",
          border: "2.7px solid var(--primary)",
          borderTop: "12px solid var(--primary)",
          borderRadius: 17,
          boxShadow: "0 4px 32px 0 rgba(19,185,185,0.16), 0 8px 52px 0 rgba(5,92,92,0.17)",
          color: "var(--text-primary)",
          padding: "36px 28px 31px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          outline: "none",
          fontFamily: "'Poppins','Montserrat','Lato',sans-serif",
        }}
      >
        <button
          onClick={onCancel}
          aria-label="Close confirmation dialog"
          style={{
            position: "absolute",
            top: 12,
            right: 13,
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 36,
            height: 36,
            fontSize: "1.44rem",
            fontWeight: 900,
            lineHeight: "1",
            boxShadow: "0 0 0 3px var(--surface), 0 4px 16px 2px var(--primary)",
            cursor: "pointer",
            zIndex: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.18s, color 0.14s, box-shadow 0.18s",
            outline: "none"
          }}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onCancel();
            }
          }}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <div
          style={{
            fontWeight: 900,
            fontSize: "1.22em",
            color: "var(--primary)",
            letterSpacing: ".04em",
            marginBottom: 9,
            marginTop: 7,
            textShadow: "0 0 10px var(--accent), 0 0 4px var(--surface)",
            textAlign: "center",
            fontFamily: "'Merriweather','Montserrat','Poppins',serif",
          }}
          id="revoke-modal-title"
        >
          Confirm revoke access for <br />
          <span style={{ color: "var(--accent)", fontWeight: 900 }}>{app.name}</span>?
        </div>
        <div
          style={{
            color: "var(--text-secondary)",
            fontFamily: "'Montserrat','Poppins','Lato',sans-serif",
            fontSize: "1.08em",
            background: "var(--surface)",
            padding: "12px 12px 11px",
            borderRadius: "13px",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: 16,
            marginTop: 6,
            letterSpacing: ".03em",
            border: "1.35px solid var(--accent)",
            boxShadow: "0 2.5px 13px 0 var(--accent), 0 0 1px 1.5px #13b9b934 inset",
          }}
        >
          <span style={{ color: "var(--primary)", fontWeight: 700 }}>
            You are about to remove these permissions:
          </span>
          <ul style={{
            marginTop: 7, marginBottom: 6, textAlign: "left",
            paddingLeft: 23, color: "var(--secondary)",
            fontSize: ".97em", listStyle: "disc"
          }}>
            {permissions.map((perm, idx) => (
              <li key={idx}>{perm}</li>
            ))}
          </ul>
        </div>
        <div
          style={{
            display: "flex",
            gap: 21,
            marginTop: 12,
            width: "100%",
            justifyContent: "center"
          }}
        >
          <button
            className="btn btn-large"
            style={{
              background: "linear-gradient(95deg, var(--primary),var(--secondary) 90%)",
              color: "#fff",
              fontWeight: 800,
              borderRadius: 10,
              padding: "12px 37px",
              fontFamily: "'Montserrat','Poppins',sans-serif",
              fontSize: "1.08em",
              border: "none",
              boxShadow: "0 0 15px 2px var(--primary), 0 0 7px 1.5px var(--accent)",
              letterSpacing: ".04em"
            }}
            autoFocus
            onClick={() => onConfirm(app && app.id)}
          >
            Confirm
          </button>
          <button
            className="btn"
            style={{
              background: "linear-gradient(94deg, #e7f2fc 9%, var(--accent) 111%)",
              color: "var(--primary)",
              fontWeight: 700,
              border: "1.3px solid var(--accent)",
              borderRadius: 10,
              padding: "12px 37px",
              fontFamily: "'Montserrat','Poppins',sans-serif",
              fontSize: "1.08em",
              boxShadow: "0 0 8px 1.7px var(--accent)44 inset"
            }}
            onClick={onCancel}
            tabIndex={0}
          >
            Cancel
          </button>
        </div>
      </div>
      {/* Modal accessibility & animation */}
      <style>
        {`
          @keyframes fadeModalIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .themed-confirm-modal-backdrop:focus {
            outline: 2.5px solid var(--primary);
          }
          .themed-confirm-modal-backdrop button[aria-label="Close confirmation dialog"]:focus {
            box-shadow: 0 0 0 4px var(--primary), 0 0 16px 4px var(--accent);
            outline: 3px solid var(--accent);
          }
          .themed-confirm-modal-backdrop button:focus, .themed-confirm-modal-backdrop .btn:focus {
            box-shadow: 0 0 0 2.2px var(--accent), 0 0 12px 2.7px var(--primary);
            outline: 2.1px solid var(--accent);
          }
        `}
      </style>
    </div>
  );
}

/**
 * PostRevokeNotification: Themed notification bar with Undo button, visible for 10s, dismissed by Undo or after timeout.
 * Accessibility: aria-live polite. Undo disables if timeout reached.
 */
function PostRevokeNotification({ app, onUndo, visible }) {
  if (!visible || !app) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: 26,
        transform: "translateX(-50%)",
        background: "linear-gradient(99deg, var(--surface) 82%, #e3fbfb 100%)",
        color: "var(--primary)",
        boxShadow: "0 6px 32px 4px var(--accent), 0 0 8px 1px var(--primary)",
        border: "1.7px solid var(--primary)",
        borderRadius: 13,
        padding: "19px 34px 18px 30px",
        zIndex: 2000,
        minWidth: 238,
        maxWidth: "95vw",
        display: "flex",
        alignItems: "center",
        fontWeight: 700,
        fontSize: "1.01em",
        animation: "fadeInUndoBar .21s cubic-bezier(.84,0,.22,1.11)"
      }}
      aria-live="polite"
      role="status"
      tabIndex={0}
    >
      <span style={{ marginRight: 11 }}>
        ✔️ Access successfully revoked for <span style={{ color: "var(--accent)" }}>{app.name}</span>
      </span>
      {onUndo && (
        <button
          className="btn"
          style={{
            marginLeft: 20,
            background: "linear-gradient(90deg, #FFF6, var(--accent) 109%)",
            color: "var(--primary)",
            border: "1.2px solid var(--accent)",
            borderRadius: 9,
            padding: "6px 22px",
            fontWeight: 800,
            fontFamily: "'Montserrat','Poppins',sans-serif",
            boxShadow: "0 0 9px 2px var(--accent)66 inset",
            fontSize: "1em",
            cursor: "pointer"
          }}
          onClick={onUndo}
          autoFocus
        >
          Undo
        </button>
      )}
      {/* Style for notification animation */}
      <style>{`
        @keyframes fadeInUndoBar {
          from { opacity: 0; transform: translateX(-50%) translateY(25px);}
          to { opacity: 1; transform: translateX(-50%) translateY(0);}
        }
      `}</style>
    </div>
  );
}

// App card UI
function AppCard({ app, onRevokeClick, revoked, disabled }) {
  // Grey out if revoked, otherwise normal
  return (
    <div
      className="card"
      style={{
        height: "100%",
        border: revoked
          ? "1.6px solid #dbe8eb"
          : "1.6px solid var(--border-color)",
        borderRadius: 15,
        boxShadow: revoked
          ? "0 0 18px 2px #d7dfdf, 0 0 11px 3px #e8e8e899"
          : "0 0 18px 2px var(--surface), 0 0 11px 3px var(--accent) inset",
        background: revoked
          ? "linear-gradient(99deg,#f7f9fa 90%, #e2edef 100%)"
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
        opacity: revoked ? 0.64 : 1,
        pointerEvents: disabled ? "none" : "auto"
      }}
      tabIndex={revoked ? -1 : 0}
      aria-label={app.name + (revoked ? " (revoked)" : "")}
      aria-disabled={revoked}
    >
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
            opacity: revoked ? 0.5 : 1,
            pointerEvents: revoked ? "none" : "auto"
          }}
          tabIndex={revoked ? -1 : 0}
          aria-label={`Replace or reconnect ${app.name}`}
          disabled={revoked || disabled}
        >
          Replace
        </button>
      </div>
    </div>
  );
}

/*
  Subtask extended workflow: On confirm revoke:
    - Simulate async API delay.
    - Remove or grey out the app card (choose behavior: REMOVE = card gone; GREY = disables + greys).
    - Update privacy score/risk UI indicator.
    - Persist new state locally.
    - Show notification: 'Access successfully revoked for [App Name].' with Undo (10 sec).
    - Undo must restore previous app list/state and risk.
*/
function ThirdPartyApps() {
  // Try to initialize from localStorage or fallback to defaults
  const [apps, setApps] = useState(() =>
    loadAppsState("psai-apps-list", MOCK_APPS.map(a => ({ ...a })))
  );
  const [revokedIds, setRevokedIds] = useState(() =>
    loadAppsState("psai-revoked-ids", [])
  );
  // Persist simplistic privacy score/risk; real product would fetch/calculate dynamic per profile
  const [score, setScore] = useState(() =>
    loadAppsState("psai-privacy-score", calculatePrivacyScore(MOCK_APPS, [])
  ));

  const [modal, setModal] = useState({ open: false, app: null });
  const [postRevoke, setPostRevoke] = useState({ app: null, visible: false, undoTimer: null, prevApps: null, prevScore: null });

  // PUBLIC_INTERFACE
  // Calculate pseudo "privacy score": just average unrevoked app trust for demo
  function calculatePrivacyScore(appList, revokedList) {
    const unrevoked = appList.filter(a => !revokedList.includes(a.id));
    if (unrevoked.length === 0) return 0;
    return Math.round(
      unrevoked.reduce((sum, app) => sum + (app.trust || 0), 0) / unrevoked.length
    );
  }

  // Handler for clicking Revoke (open modal)
  const handleRevokeClick = (app) => {
    setModal({ open: true, app });
  };

  // Async "API" revoke simulation
  async function handleRevokeConfirm(appId) {
    setModal({ open: false, app: null });
    // Store current state for potential undo
    const prevApps = [...apps];
    const prevRevoked = [...revokedIds];
    const prevScore = score;
    // Option 1: Remove the card
    // Option 2: Grey out (we choose "grey out and disable" here for clarity)
    // Simulate "API" progress (UI could show spinner, but keep simple)
    await new Promise(res => setTimeout(res, 1200)); // 1.2s fake delay

    // Apply revoke: add to revoked array
    const nextRevoked = [...revokedIds, appId];
    setRevokedIds(nextRevoked);
    // Privacy score: decrease as risky apps are removed (simply recalc)
    const newScore = calculatePrivacyScore(apps, nextRevoked);
    setScore(newScore);
    // Persist both
    saveAppsState("psai-revoked-ids", nextRevoked);
    saveAppsState("psai-privacy-score", newScore);

    // Undo (store full snapshot so undo is robust)
    if (postRevoke.undoTimer) clearTimeout(postRevoke.undoTimer);
    const app = apps.find(a => a.id === appId);
    // Setup undo timeout to hide notification after 10 seconds
    const undoTimeout = setTimeout(() => {
      setPostRevoke(pr => ({
        ...pr,
        visible: false,
        app: null,
        undoTimer: null,
        prevApps: null,
        prevScore: null
      }));
    }, 10000);
    setPostRevoke({
      app,
      visible: true,
      undoTimer: undoTimeout,
      prevApps: prevApps,
      prevScore: prevScore
    });
  }

  // Cancel modal
  const handleModalCancel = () => setModal({ open: false, app: null });

  // Undo logic: restore previous apps list, revokedIds, and score
  const handleUndo = () => {
    if (!postRevoke.app || !postRevoke.prevApps) return;
    // Restore everything to before-revoke state
    setApps(postRevoke.prevApps);
    // Remove appId from revoked
    const restoredRevoked = revokedIds.filter(id => id !== postRevoke.app.id);
    setRevokedIds(restoredRevoked);
    setScore(postRevoke.prevScore ?? calculatePrivacyScore(postRevoke.prevApps, restoredRevoked));
    saveAppsState("psai-apps-list", postRevoke.prevApps);
    saveAppsState("psai-revoked-ids", restoredRevoked);
    saveAppsState("psai-privacy-score", postRevoke.prevScore ?? calculatePrivacyScore(postRevoke.prevApps, restoredRevoked));
    // Hide notification and clean timer immediately
    setPostRevoke((pr) => {
      if (pr.undoTimer) clearTimeout(pr.undoTimer);
      return { app: null, visible: false, undoTimer: null, prevApps: null, prevScore: null };
    });
  };

  // Persist revokedIds + apps whenever change (for page reload resilience)
  useEffect(() => {
    saveAppsState("psai-apps-list", apps);
  }, [apps]);
  useEffect(() => {
    saveAppsState("psai-revoked-ids", revokedIds);
  }, [revokedIds]);
  useEffect(() => {
    saveAppsState("psai-privacy-score", score);
  }, [score]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (postRevoke.undoTimer) clearTimeout(postRevoke.undoTimer);
    };
  }, [postRevoke.undoTimer]);


  // Modal: permission summary for current app (for accessLevel)
  const modalPermissions =
    modal.app && PERMISSIONS_MAP[modal.app.accessLevel]
      ? PERMISSIONS_MAP[modal.app.accessLevel]
      : modal.app
      ? modal.app.accessLevel.split(/\s*,\s*|\s*;\s*/)
      : [];

  // PRIVACY SCORE BADGE/BAR at top (simulate effect of revoking)
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

      {/* Updated Privacy Score/Risk Indicator */}
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
      {/* Responsive app grid */}
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
            onRevokeClick={handleRevokeClick}
            disabled={!!modal.open}
          />
        ))}
      </div>
      {/* Modal for confirmation */}
      <RevokeModal
        open={modal.open}
        app={modal.app}
        permissions={modalPermissions}
        onConfirm={handleRevokeConfirm}
        onCancel={handleModalCancel}
      />
      {/* Notification (Undo) */}
      <PostRevokeNotification
        app={postRevoke.app}
        onUndo={handleUndo}
        visible={postRevoke.visible}
      />
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
