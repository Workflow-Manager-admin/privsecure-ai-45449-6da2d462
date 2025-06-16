import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "../App.css";

/**
 * Color legend for link risks.
 */
const RISK_COLORS = {
  low: "#13B9B9",           // theme secondary
  medium: "#E87A41",        // kavia orange
  high: "#de2346",          // vivid risk red
  unknown: "#C5E7E7",       // muted light for uncertainty
};

const RISK_LABELS = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
  unknown: "Unknown"
};

// Mock data for demonstration.
// Each node is a person/contact, links contain a risk property.
const MOCK_NODES = [
  { id: "You", main: true, group: 1 },
  { id: "Alice", group: 2 },
  { id: "Bob", group: 2 },
  { id: "Charlie", group: 3 },
  { id: "Diana", group: 3 },
  { id: "Eve", group: 2 },
  { id: "Frank", group: 3 }
];

const MOCK_LINKS = [
  { source: "You", target: "Alice", risk: "low" },
  { source: "You", target: "Bob", risk: "medium" },
  { source: "You", target: "Charlie", risk: "high" },
  { source: "Alice", target: "Diana", risk: "low" },
  { source: "Bob", target: "Diana", risk: "medium" },
  { source: "Charlie", target: "Eve", risk: "high" },
  { source: "You", target: "Eve", risk: "medium" },
  { source: "Bob", target: "Frank", risk: "low" },
  { source: "Frank", target: "Diana", risk: "unknown" }
];

// Tooltip component (floating, follows mouse).
function Tooltip({ show, x, y, info }) {
  if (!show) return null;
  return (
    <div
      style={{
        left: x,
        top: y,
        position: "fixed",
        background: "var(--surface)",
        color: "var(--text-primary)",
        border: `1.5px solid ${RISK_COLORS[info?.risk] || "#aaa"}`,
        borderRadius: 9,
        padding: "10px 16px",
        boxShadow: "0 4px 16px #0003",
        fontSize: "1.08em",
        pointerEvents: "none",
        zIndex: 2000,
        minWidth: 130,
        maxWidth: 280
      }}
      className="card"
    >
      {info.type === "link" ? (
        <div>
          <b>
            {info.source} <span style={{
              color: RISK_COLORS[info.risk], fontWeight: 700
            }}>⇄</span> {info.target}
          </b>
          <div style={{
            color: RISK_COLORS[info.risk], fontWeight: 700,
            margin: "5px 0"
          }}>
            {RISK_LABELS[info.risk] || "Unrated Risk"}
          </div>
          <div>
            <span style={{ color: "var(--text-secondary)" }}>
              Data Sharing Risk: <b>{info.risk ? info.risk.toUpperCase() : "-"}</b>
            </span>
          </div>
        </div>
      ) : (
        <div>
          <b>{info.id}</b>
          {info.main && <span style={{
            marginLeft: 8, color: "var(--secondary)", fontWeight: 700
          }}>(You)</span>}
          <br />
          <span style={{ color: "var(--text-secondary)" }}>
            Connections: <b>{info.connections}</b>
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * SocialGraph: D3-based contact web with risk visualization.
 */
// PUBLIC_INTERFACE
function SocialGraph() {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 640, height: 420 });
  const [tooltip, setTooltip] = useState({
    show: false, x: 0, y: 0, info: null
  });

  // Responsive SVG sizing.
  useEffect(() => {
    function updateDims() {
      let w = Math.min(window.innerWidth - 60, 800);
      let h = w * 0.62;
      if (window.innerWidth < 520) {
        w = window.innerWidth - 18;
        h = w * 1;
      }
      setDimensions({
        width: Math.max(320, w),
        height: Math.max(300, Math.round(h))
      });
    }
    updateDims();
    window.addEventListener("resize", updateDims);
    return () => window.removeEventListener("resize", updateDims);
  }, []);

  // D3 force simulation, nodes/links draw.
  useEffect(() => {
    const width = dimensions.width;
    const height = dimensions.height;

    // D3 setup
    const nodes = MOCK_NODES.map(n => ({ ...n }));
    // Add connections count for tooltip and extra styling.
    nodes.forEach(node => {
      node.connections = MOCK_LINKS.filter(
        l => l.source === node.id || l.target === node.id
      ).length;
    });
    const links = MOCK_LINKS.map(l => ({ ...l }));

    // Remove previous SVG content.
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Markers for arrowheads/color legend
    svg.append("defs").selectAll("marker").data(
      Object.keys(RISK_COLORS)
    ).enter().append("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 24)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .attr("fill", d => RISK_COLORS[d])
      .attr("stroke", d => RISK_COLORS[d])
      .append("path")
      .attr("d", "M0,-5L10,0L0,5");

    // Simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links)
        .id(d => d.id)
        .distance(l => l.risk === "high" ? 160 : l.risk === "medium" ? 120 : 90)
        .strength(0.91)
      )
      .force("charge", d3.forceManyBody().strength(-350))
      .force("center", d3.forceCenter(width/2, height/2 + 15))
      .force("collide", d3.forceCollide(36))
      .stop();

    // Simulation steps for layout stability.
    for (let i = 0; i < 120; ++i) simulation.tick();

    // Draw links.
    svg.append("g").selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("class", "sg-link")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .attr("stroke-width", d => d.risk === "high" ? 4.5 : d.risk === "medium" ? 3.5 : 2.5)
      .attr("stroke", d => RISK_COLORS[d.risk] || RISK_COLORS.unknown)
      .attr("marker-end", d => `url(#arrow-${d.risk})`)
      .attr("opacity", 0.93)
      .on("mousemove pointermove", function (event, d) {
        setTooltip({
          show: true,
          x: event.clientX + 16,
          y: event.clientY + 6,
          info: {
            type: "link",
            risk: d.risk,
            source: typeof d.source === "object" ? d.source.id : d.source,
            target: typeof d.target === "object" ? d.target.id : d.target
          }
        });
        d3.select(this).attr("stroke-width", 7.5).attr("opacity", 1.0);
      })
      .on("mouseleave pointerleave", function () {
        setTooltip(t => ({...t, show: false }));
        d3.select(this).attr("stroke-width", function(d) {
            return d.risk === "high" ? 4.5 : d.risk === "medium" ? 3.5 : 2.5;
          }).attr("opacity", 0.93);
      });

    // Draw nodes (circles).
    const node = svg.append("g").selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => d.main ? 32 : 22)
      .attr("fill", d => d.main ? "var(--primary)" : "var(--secondary)")
      .attr("stroke", d => d.main ? "var(--accent)" : "#13B9B9")
      .attr("stroke-width", d => d.main ? 4.5 : 2.5)
      .attr("opacity", d => d.main ? 1 : 0.93)
      .attr("filter", d => d.main ? "url(#glow-main)" : null)
      .style("cursor", "pointer")
      .on("mousemove pointermove", function(event, d) {
        setTooltip({
          show: true,
          x: event.clientX + 14,
          y: event.clientY - 4,
          info: {
            type: "node",
            ...d
          }
        });
        d3.select(this).attr("stroke-width", d.main ? 7.5 : 4.2)
          .attr("opacity", 1);
      })
      .on("mouseleave pointerleave", function(event, d) {
        setTooltip(t => ({...t, show: false }));
        d3.select(this).attr("stroke-width", d.main ? 4.5 : 2.5)
          .attr("opacity", d.main ? 1 : 0.93);
      });

    // Glowing filter for "You"
    svg.append("defs")
      .append("filter")
      .attr("id", "glow-main")
      .append("feDropShadow")
      .attr("dx", 0).attr("dy", 0)
      .attr("stdDeviation", 6)
      .attr("flood-color", "var(--primary)")
      .attr("flood-opacity", 0.44);

    // Draw node labels.
    svg.append("g").selectAll("text")
      .data(nodes)
      .enter().append("text")
      .attr("x", d => d.x)
      .attr("y", d => d.y + (d.main ? 47 : 32))
      .attr("text-anchor", "middle")
      .attr("font-size", d => d.main ? "1.13em" : "1em")
      .attr("font-weight", d => d.main ? 700 : 500)
      .attr("fill", d => d.main ? "var(--primary)" : "var(--text-secondary)")
      .attr("style", "pointer-events: none; text-shadow: 0 0 7px #fff8, 0 0 3px #13B9B9;")
      .text(d => d.id);

    // Clean up on unmount.
    return () => {
      svg.selectAll("*").remove();
    };
  }, [dimensions]);

  // Responsive card container, legend
  return (
    <div className="container" style={{maxWidth: 990, minWidth: 0, width: "100%"}}>
      <h1 className="page-title" style={{marginBottom: 7}}>Social Graph Risk Map</h1>
      <div className="card" style={{marginTop: 0, padding: "16px 8vw 10px 2vw"}}>
        <div className="subtitle" style={{
          marginBottom: 12,
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <span>Interactive Contact Map</span>
        </div>
        <p style={{marginBottom:10, maxWidth: 720}}>
          Your digital footprint is mapped below.<br />
          Each connection is color-coded by data sharing risk
          (<span style={{color: RISK_COLORS.high}}>high risk</span>,
           <span style={{color: RISK_COLORS.medium, marginLeft: 7}}>medium</span>,
           <span style={{color: RISK_COLORS.low, marginLeft: 7}}>low</span>).
          Hover over lines or circles to explore details.
        </p>
        <div
          style={{
            overflowX: "auto", overflowY: "visible",
            margin: "0 -18px", padding: 0,
          }}
        >
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            style={{
              display: "block",
              margin: "0 auto",
              background: "linear-gradient(110deg, #f8fcfc 78%, #fff 100%)",
              borderRadius: "18px",
              boxShadow: "0 1px 16px #13b9b934",
              border: "1.5px solid var(--border-color)",
              marginBottom: 0,
            }}
            aria-label="Social contacts network graph"
          />
          <Tooltip {...tooltip} />
        </div>
        {/* Legend for link risk */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginTop: 16,
            fontSize: "1em"
          }}
        >
          <b style={{letterSpacing: "0.07em"}}>Risk Key:</b>
          {Object.entries(RISK_COLORS).map(([risk, color]) => (
            <span key={risk} style={{
              display:"inline-flex",
              alignItems:"center",
              gap:5
            }}>
              <svg width={22} height={8} style={{verticalAlign:"middle"}}>
                <line x1={2} y1={6} x2={18} y2={6}
                      stroke={color}
                      strokeWidth={risk==="high"?6: risk==="medium"?4.5: 3.2 }
                      strokeLinecap="round"
                />
              </svg>
              <span style={{color, fontWeight: 600, marginRight:7}}>
                {RISK_LABELS[risk]}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SocialGraph;
