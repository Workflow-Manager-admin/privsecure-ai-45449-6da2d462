import React, { useState, useRef, useEffect } from "react";

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

// Revoke Modal implementation
function RevokeModal({ open, app, permissions, onConfirm, onCancel }) {
  const modalRef = useRef(null);

  // Accessibility: Trap focus to modal
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    modalRef.current && modalRef.current.focus();
    return () => prev && prev.focus && prev.focus();
  }, [open]);

  if (!open || !app) return null;
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(12,34,36,0.38)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.18s"
      }}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        ref={modalRef}
        role="document"
        tabIndex={0}
        aria-labelledby="revoke-app-name"
        style={{
          minWidth: 347,
          maxWidth: "96vw",
          background: "var(--background)",
          border: "2.7px solid var(--primary)",
          borderTop: "12px solid var(--primary)",
          borderRadius: "18px",
          boxShadow: "0 4px 32px 0 rgba(19,185,185,0.14), 0 8px 48px 0 rgba(5,92,92,0.19)",
          color: "var(--text-primary)",
          padding: "36px 30px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          outline: "none"
        }}
      >
        <button
          onClick={onCancel}
          aria-label="Close confirmation dialog"
          style={{
            position: "absolute",
            top: 10,
            right: 13,
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 36,
            height: 36,
            fontSize: "1.4rem",
            fontWeight: 800,
            lineHeight: "1",
            boxShadow: "0 0 0 3px var(--surface), 0 4px 14px 2px var(--primary)",
            cursor: "pointer"
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
            fontSize: "1.23em",
            color: "var(--primary)",
            letterSpacing: ".04em",
            marginBottom: 9,
            marginTop: 8,
            textShadow: "0 0 8px var(--accent), 0 0 4px var(--surface)",
            textAlign: "center",
            fontFamily: "'Merriweather','Montserrat','Poppins',serif",
          }}
          id="revoke-app-name"
        >
          Are you sure you want to revoke access for
          <br />
          <span style={{ color: "var(--accent)", fontWeight: 900 }}>
            {app.name}
          </span>
          ?
        </div>

        <div
          style={{
            color: "var(--text-secondary)",
            fontFamily: "'Montserrat','Poppins','Lato',sans-serif",
            fontSize: "1.08em",
            background: "var(--surface)",
            padding: "11px 12px 13px",
            borderRadius: "12px",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: 15,
            marginTop: 3,
            letterSpacing: ".03em",
            border: "1.3px solid var(--accent)",
            boxShadow: "0 2px 12px 0 var(--accent), 0 0 0.5px 1.5px #13b9b934 inset",
          }}
        >
          <span style={{ color: "var(--primary)", fontWeight: 700 }}>
            This will remove the following access:
          </span>
          <ul style={{
            marginTop: 7,
            marginBottom: 5,
            textAlign: "left",
            paddingLeft: 22,
            color: "var(--secondary)",
            fontSize: ".97em",
            listStyle: "disc"
          }}>
            {permissions.map((perm, idx) => (
              <li key={idx}>{perm}</li>
            ))}
          </ul>
        </div>
        <div
          style={{
            display: "flex",
            gap: 19,
            marginTop: 12,
            width: "100%",
            justifyContent: "center"
          }}
        >
          <button
            className="btn btn-large"
            style={{
              background: "linear-gradient(95deg, var(--primary),var(--secondary) 85%)",
              color: "#fff",
              fontWeight: 800,
              borderRadius: 10,
              padding: "12px 37px",
              fontFamily: "'Montserrat','Poppins',sans-serif",
              fontSize: "1.06em",
              border: "none",
              boxShadow: "0 0 12px 2px var(--primary), 0 0 6px 1px var(--accent)",
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
              background: "linear-gradient(90deg, #e7f0fc 10%, var(--accent) 110%)",
              color: "var(--primary)",
              fontWeight: 700,
              border: "1.3px solid var(--accent)",
              borderRadius: 10,
              padding: "12px 37px",
              fontFamily: "'Montserrat','Poppins',sans-serif",
              letterSpacing: ".01em",
              fontSize: "1.06em",
              boxShadow: "0 0 8px 1.5px var(--accent)44 inset"
            }}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

// Notification/Undo bar
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
        fontSize: "1.01em"
      }}
      aria-live="polite"
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
        >
          Undo
        </button>
      )}
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

// PUBLIC_INTERFACE
// ThirdPartyApps with revoke confirmation modal + undo notification + app card update
function ThirdPartyApps() {
  // State: apps, revokedAppIds, modal state, notification (undo) timer, etc.
  const [apps, setApps] = useState(MOCK_APPS.map(a => ({ ...a })));
  const [revokedIds, setRevokedIds] = useState([]); // list of revoked app ids
  const [modal, setModal] = useState({ open: false, app: null });
  const [postRevoke, setPostRevoke] = useState({ app: null, visible: false, undoTimer: null });

  // Handler for clicking Revoke
  const handleRevokeClick = (app) => {
    setModal({ open: true, app });
  };

  // Confirm revoke (fake API), then show notification + update cards
  const handleRevokeConfirm = (appId) => {
    setModal({ open: false, app: null });

    // Find the app
    const app = apps.find(a => a.id === appId);

    // Simulate API + update state
    setRevokedIds(prev => [...prev, appId]);
    // Undo: show notification; store timer to hide after 10s
    if (postRevoke.undoTimer) clearTimeout(postRevoke.undoTimer);
    const undoTimeout = setTimeout(() => {
      setPostRevoke(pr => ({ ...pr, visible: false, app: null, undoTimer: null }));
    }, 10000);
    setPostRevoke({ app, visible: true, undoTimer: undoTimeout });
  };

  // Cancel modal
  const handleModalCancel = () => setModal({ open: false, app: null });

  // Undo logic: remove appId from revoked, cancel notification
  const handleUndo = () => {
    if (!postRevoke.app) return;
    setRevokedIds(ids => ids.filter(id => id !== postRevoke.app.id));
    setPostRevoke((pr) => {
      if (pr.undoTimer) clearTimeout(pr.undoTimer);
      return { app: null, visible: false, undoTimer: null };
    });
  };

  // Cleanup timer (on unmount)
  useEffect(() => {
    return () => {
      if (postRevoke.undoTimer) clearTimeout(postRevoke.undoTimer);
    };
    // eslint-disable-next-line
  }, []);

  // Modal: permission summary for current app (for accessLevel)
  const modalPermissions =
    modal.app && PERMISSIONS_MAP[modal.app.accessLevel]
      ? PERMISSIONS_MAP[modal.app.accessLevel]
      : modal.app
      ? modal.app.accessLevel.split(/\s*,\s*|\s*;\s*/)
      : [];

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
