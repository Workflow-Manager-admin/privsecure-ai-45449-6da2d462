import React, { useState, useRef, useEffect } from "react";

/**
 * PUBLIC_INTERFACE
 * DigitalTwin: Digital Twin Scanner page showing detected impersonations (match cards),
 * stylometric text clones, and reporting actions—cyber/corporate themed, responsive, mock data.
 */
const MOCK_MATCHES = [
  {
    id: 1,
    name: "Alice K.",
    avatar:
      "https://randomuser.me/api/portraits/women/62.jpg",
    content:
      "Check out my new privacy tips! Stay secure online. #cybersafety",
    platform: "Twitter",
    time: "2 hours ago",
  },
  {
    id: 2,
    name: "Alice K.",
    avatar:
      "https://randomuser.me/api/portraits/women/62.jpg",
    content:
      "Don’t forget: Use 2FA everywhere. Just updated my blog with security best practices.",
    platform: "Medium",
    time: "1 day ago",
  },
  {
    id: 3,
    name: "Alyce Kay",
    avatar:
      "https://randomuser.me/api/portraits/women/65.jpg",
    content:
      "Avoid public WiFi without VPN! Here’s why privacy matters in 2024.",
    platform: "Facebook",
    time: "3 days ago",
  },
];

const MOCK_CLONES = [
  {
    id: 1,
    source: "My original post: \"The best privacy tool? Awareness.\"",
    detected:
      "\"The best privacy tool? Awareness.\" — posted by Alyce K at cybersecuritytips.com",
    matchScore: 98,
  },
  {
    id: 2,
    source: "Original: \"Enable 2FA to secure all your key accounts.\"",
    detected:
      "\"2FA should be enabled on every major account.\" — found on privacy-watch.net",
    matchScore: 87,
  },
  {
    id: 3,
    source: "Original: \"Never overshare on social media.\"",
    detected:
      "\"Limit what you share—social media is not private.\" (source: fakeAlice123, Twitter)",
    matchScore: 85,
  },
];

// Modal component consistent with cyber theme
function ReportModal({ open, onClose }) {
  const modalRef = useRef();

  // Close modal when clicking outside the modal content
  useEffect(() => {
    function handleClick(e) {
      if (open && modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  // Trap focus when modal is open
  useEffect(() => {
    if (open) {
      const prev = document.activeElement;
      modalRef.current && modalRef.current.focus();
      return () => prev && prev.focus && prev.focus();
    }
  }, [open]);

  if (!open) return null;
  return (
    <div
      className="cyber-modal-backdrop"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      style={{
        position: "fixed",
        zIndex: 9999,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(20,34,36,0.67)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.18s",
      }}
    >
      <div
        className="cyber-modal"
        ref={modalRef}
        role="document"
        tabIndex={0}
        style={{
          minWidth: 320,
          maxWidth: "91vw",
          background: "linear-gradient(113deg, #191a2e 87%, #0d0f1e 100%)",
          border: "2px solid var(--primary)",
          borderRadius: 18,
          boxShadow: "0 0 44px 16px #0ff6, 0 0 18px 5px #f0f8 inset",
          color: "#fff",
          fontFamily: "'Montserrat',Poppins,sans-serif",
          padding: "38px 25px 28px",
          zIndex: 10001,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          outline: "none",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close report dialog"
          style={{
            position: "absolute",
            top: 16,
            right: 19,
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            color: "var(--accent)",
            cursor: "pointer",
            fontWeight: 700,
            textShadow: "0 0 10px var(--primary),0 0 4px var(--secondary)",
            transition: "color 0.17s",
          }}
        >
          ×
        </button>
        <div
          style={{
            fontWeight: 700,
            fontSize: "1.32em",
            color: "var(--primary)",
            letterSpacing: ".04em",
            marginBottom: 12,
            textShadow: "0 0 12px var(--accent), 0 0 8px var(--surface)",
            textAlign: "center",
          }}
        >
          Report Submitted
        </div>
        <div
          style={{
            color: "var(--accent)",
            fontFamily: "'Montserrat',Poppins,sans-serif",
            fontSize: "1.12em",
            background:
              "linear-gradient(89deg, var(--surface) 70%, #0ff2 100%)",
            padding: "15px 12px",
            borderRadius: 8,
            fontWeight: 600,
            textAlign: "center",
            marginBottom: 8,
            letterSpacing: ".02em",
            boxShadow:
              "0 0 10px 1.5px #0ff, 0 0 3px 1.5px #191a2e inset",
          }}
        >
          reported necessary action will be taken
        </div>
        <button
          className="btn"
          style={{
            marginTop: 18,
            padding: "10px 28px",
            background: "linear-gradient(90deg, #0ff, #f0f 94%)",
            color: "#181a2e",
            fontWeight: 700,
            borderRadius: 9,
            fontFamily: "'Montserrat',Poppins,sans-serif",
            fontSize: "1.1em",
            border: "none",
            boxShadow: "0 0 11px var(--secondary)",
            letterSpacing: ".02em",
            cursor: "pointer",
            outline: "none",
            transition: "background 0.18s",
          }}
          onClick={onClose}
          autoFocus
        >
          Close
        </button>
      </div>
      {/* Minimal modal animation style */}
      <style>
        {`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        `}
      </style>
    </div>
  );
}

function DigitalTwin() {
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);

  // PUBLIC_INTERFACE
  // Show modal when any report action is triggered
  const handleAction = (type, item) => {
    if (type === "report") {
      setModalOpen(true);
    }
    // Ignore/other actions would go here in production
  };

  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="container" style={{
      marginTop: 48,
      maxWidth: 880,
      padding: "38px 12px 46px 12px",
      background: "var(--surface)",
      borderRadius: "var(--border-radius)",
      boxShadow: "var(--box-shadow)",
      minHeight: 510,
      color: "var(--text-primary)"
    }}>
      {/* Report Modal */}
      <ReportModal open={modalOpen} onClose={handleCloseModal} />

      {/* Page Title */}
      <h1
        className="title"
        style={{
          color: "var(--primary)",
          textShadow:
            "0 0 18px var(--secondary), 0 0 2px var(--primary)",
          fontWeight: 900,
          fontSize: "2.14rem",
          marginBottom: 18,
          letterSpacing: ".05em"
        }}
      >
        Digital Twin Scanner
      </h1>
      <div
        className="subtitle"
        style={{
          color: "var(--accent)",
          fontWeight: 600,
          fontSize: "1.09rem",
          marginBottom: 19,
          letterSpacing: ".02em"
        }}
      >
        Detect impersonations and AI-cloned content. Take action to protect your identity and reputation.
      </div>

      {/* Match Cards Section */}
      <section aria-label="Detected Impersonations/Matches">
        <div style={{
          fontWeight: 700,
          color: "var(--primary)",
          letterSpacing: ".025em",
          fontSize: "1.05em",
          marginBottom: 13,
          textShadow: "0 0 13px var(--accent)"
        }}>Potential Impersonation Matches</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "28px 20px",
            marginBottom: 24
          }}
        >
          {MOCK_MATCHES.map((m) => (
            <div
              key={m.id}
              className="card card-glow"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                background: "linear-gradient(111deg, #191b2e 78%, #0d0f1e 100%)",
                border: "1.8px solid var(--primary)",
                borderRadius: 13,
                boxShadow:
                  "0 0 13px 3px var(--accent), 0 0 10px 1.5px #0ff8 inset",
                padding: "19px 17px",
                gap: 17,
                position: "relative"
              }}
            >
              {/* Avatar */}
              <img
                src={m.avatar}
                alt={m.name}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "2.5px solid var(--accent)",
                  boxShadow: "0 0 10px var(--accent)",
                  background: "#11efe2",
                  objectFit: "cover",
                  marginRight: 11
                }}
              />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: "1.05em",
                  color: "var(--accent)",
                  textShadow: "0 0 4px #0ff",
                  letterSpacing: ".01em"
                }}>
                  {m.name}
                </div>
                <div style={{
                  color: "var(--secondary)",
                  fontSize: "0.94em",
                  opacity: 0.74,
                  letterSpacing: ".01em",
                  marginBottom: 2
                }}>
                  {m.platform} • <span style={{ color: "var(--text-secondary)" }}>{m.time}</span>
                </div>
                <div style={{
                  color: "var(--text-primary)",
                  fontSize: ".99em",
                  lineHeight: 1.45,
                  margin: "7px 0 9px 0",
                  fontWeight: 500,
                  fontFamily: "'Poppins', sans-serif",
                  maxHeight: "3.7em",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {m.content}
                </div>
                {/* Actions Row: Only Report button (centered where appropriate) */}
                <div style={{ display: "flex", gap: 0 }}>
                  <button
                    className="btn"
                    style={{
                      background: "linear-gradient(90deg, #0ff, #f0f 95%)",
                      color: "#fff",
                      fontWeight: 700,
                      borderRadius: 8,
                      padding: "7.5px 18px",
                      boxShadow: "0 0 8px 2px var(--primary)",
                      letterSpacing: ".03em",
                      marginLeft: 0,
                      marginRight: 0,
                      minWidth: 92,
                    }}
                    onClick={() => handleAction("report", m)}
                    aria-label={`Report impersonation of ${m.name}`}
                  >
                    Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stylometric Analysis Section */}
      <section aria-label="AI Stylometric Analysis" style={{
        marginTop: 19
      }}>
        <div style={{
          fontWeight: 700,
          color: "var(--primary)",
          letterSpacing: ".022em",
          fontSize: "1.03em",
          marginBottom: 12,
          textShadow: "0 0 11px #0ff8"
        }}>AI Stylometric Text Clone Detection</div>
        <div className="card"
          style={{
            background: "#f9fcff",
            border: "1.5px solid var(--border-color)",
            borderRadius: 15,
            boxShadow: "0 0 8px 1.3px var(--accent)",
            padding: "22px 18px",
            marginBottom: 12,
            display: "flex",
            flexDirection: "column",
            gap: 18
          }}
        >
          {MOCK_CLONES.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                background: "linear-gradient(90deg, #e6fafe 70%, #f6f6fc 100%)",
                borderRadius: 9,
                boxShadow: "0 0 6px 1.5px #0ff3",
                padding: "12px 18px 11px 14px",
                marginBottom: 1,
                gap: 14,
                flexWrap: "wrap"
              }}
            >
              <div style={{ flex: 1, minWidth: 190 }}>
                <div style={{
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  fontSize: "1em",
                  letterSpacing: ".01em",
                  fontFamily: "'Montserrat',sans-serif",
                  marginBottom: "4px"
                }}>Suspected Clone</div>
                <div style={{
                  fontSize: ".98em",
                  lineHeight: 1.5,
                  color: "#1A1A1A",
                  background: "#eefafd",
                  borderRadius: 7,
                  padding: "5px 10px",
                  fontFamily: "'Lato',sans-serif",
                  marginBottom: 5
                }}>{c.detected}</div>
                <div style={{
                  fontSize: ".89em",
                  color: "var(--secondary)",
                  marginTop: 4,
                  letterSpacing: ".01em",
                  opacity: 0.7
                }}>Source: <span style={{ color: "#0C2223" }}>{c.source}</span></div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  minWidth: 118
                }}
              >
                <div style={{
                  fontWeight: 700,
                  fontSize: "1.06em",
                  color: "#189bb9",
                  letterSpacing: ".02em",
                  textShadow: "0 0 10px #13B9B9",
                  marginBottom: 7
                }}>
                  Match Score: <span style={{
                    color: c.matchScore > 92 ? "#0ff" : "#E87A41",
                    fontWeight: 800,
                    fontSize: "1.13em"
                  }}>{c.matchScore}%</span>
                </div>
                <div style={{ display: "flex", gap: 0 }}>
                  <button
                    className="btn"
                    style={{
                      padding: "6.5px 17px",
                      fontWeight: 700,
                      color: "#fff",
                      background: "linear-gradient(90deg, #0ff, #f0f 95%)",
                      borderRadius: 8,
                      boxShadow: "0 0 7px 2px var(--primary)",
                      letterSpacing: ".03em",
                      minWidth: 85,
                      marginLeft: 0,
                      marginRight: 0,
                    }}
                    onClick={() => handleAction("report", c)}
                    aria-label={`Report clone: ${c.source}`}
                  >
                    Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{
          color: "var(--text-secondary)",
          fontSize: ".95em",
          marginTop: 8,
          opacity: 0.64,
          fontStyle: "italic"
        }}>
          Powered by stylometric AI — detects text similarity, phrase re-use, and paraphrased matches.
        </div>
      </section>

      {/* Custom Modal Styling */}
      <style>
        {`
        @media (max-width: 900px) {
          .container {
            padding: 20px 2vw;
            max-width: 98vw;
          }
        }
        @media (max-width: 640px) {
          .container {
            padding: 12px 0vw;
          }
        }
        .cyber-modal-backdrop {
          animation: fadeIn 0.2s;
        }
        .cyber-modal:focus {
          outline: 2.5px solid var(--primary);
          box-shadow: 0 0 0 2px var(--accent);
        }
        `}
      </style>
    </div>
  );
}

export default DigitalTwin;
