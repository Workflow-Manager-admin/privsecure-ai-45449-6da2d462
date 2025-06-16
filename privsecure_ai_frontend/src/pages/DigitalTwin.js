import React from "react";

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

function DigitalTwin() {
  // Action handlers: (Stubbed for demo - add integration as needed)
  const handleAction = (type, item) => {
    // Add more logic as needed (toast, backend, etc.)
    alert(
      `${type === "report" ? "Reported" : "Ignored"}: ${item.name || item.source}`
    );
  };

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
                {/* Actions Row */}
                <div style={{ display: "flex", gap: 11 }}>
                  <button
                    className="btn"
                    style={{
                      background: "linear-gradient(90deg, #0ff, #f0f 95%)",
                      color: "#fff",
                      fontWeight: 700,
                      borderRadius: 8,
                      padding: "7.5px 18px",
                      boxShadow: "0 0 8px 2px var(--primary)",
                      letterSpacing: ".03em"
                    }}
                    onClick={() => handleAction("report", m)}
                    aria-label={`Report impersonation of ${m.name}`}
                  >
                    Report
                  </button>
                  <button
                    className="btn"
                    style={{
                      background: "linear-gradient(90deg, #23232b 80%, #0ff1 99%)",
                      color: "var(--primary)",
                      fontWeight: 600,
                      border: "1.5px solid var(--accent)",
                      borderRadius: 8,
                      padding: "7.5px 18px",
                      opacity: 0.74,
                      letterSpacing: ".03em"
                    }}
                    onClick={() => handleAction("ignore", m)}
                    aria-label={`Ignore impersonation of ${m.name}`}
                  >
                    Ignore
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
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn"
                    style={{
                      padding: "6.5px 17px",
                      fontWeight: 700,
                      color: "#fff",
                      background: "linear-gradient(90deg, #0ff, #f0f 95%)",
                      borderRadius: 8,
                      boxShadow: "0 0 7px 2px var(--primary)",
                      letterSpacing: ".03em"
                    }}
                    onClick={() => handleAction("report", c)}
                    aria-label={`Report clone: ${c.source}`}
                  >
                    Report
                  </button>
                  <button
                    className="btn"
                    style={{
                      background: "linear-gradient(90deg, #31354a 40%, #0ff1 100%)",
                      color: "var(--primary)",
                      fontWeight: 600,
                      border: "1.5px solid var(--accent)",
                      borderRadius: 8,
                      padding: "6.5px 17px",
                      opacity: 0.72,
                      letterSpacing: ".03em"
                    }}
                    onClick={() => handleAction("ignore", c)}
                    aria-label={`Ignore clone: ${c.source}`}
                  >
                    Ignore
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

      {/* Responsive grid tweaks */}
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
        `}
      </style>
    </div>
  );
}

export default DigitalTwin;
