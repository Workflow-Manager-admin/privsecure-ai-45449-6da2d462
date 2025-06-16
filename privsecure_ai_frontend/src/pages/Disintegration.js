import React, { useState } from "react";

/**
 * Data Disintegration Manager Page.
 * Features:
 * - Timeline/scheduler of content (mock data, 1-day granularity)
 * - Redaction suggestion "cards" shown along the timeline
 * - Each card has Edit (inline editable) and Delete controls
 * - Theme and spacing follows App.css variables and container/card classes
 */

// PUBLIC_INTERFACE
function Disintegration() {
  // Mock timeline slots and suggestion data
  const mockTimeline = [
    {
      id: 1,
      time: "09:00",
      label: "Email: Subject 'Receipts from Online Purchase'",
      suggestions: [
        {
          id: 101,
          title: "Redact Credit Card Number",
          detail: "Card ending in 8321 detected. Redact before archiving.",
        },
      ],
    },
    {
      id: 2,
      time: "13:10",
      label: "Chat: 'Office Group'",
      suggestions: [
        {
          id: 102,
          title: "Remove Address",
          detail: "Detected home address disclosure in chat.",
        },
        {
          id: 103,
          title: "Blur Personal Photos",
          detail: "Private images uploaded, recommend obfuscation.",
        },
      ],
    },
    {
      id: 3,
      time: "17:45",
      label: "Social Post",
      suggestions: [
        {
          id: 104,
          title: "Delete Tag",
          detail: "Sensitive tag identified ('workplace'). Remove for privacy.",
        },
      ],
    },
  ];

  // Flatten suggestions onto timeline slots with slot/time data for rendering
  const buildInitialList = () =>
    mockTimeline.flatMap((slot) =>
      slot.suggestions.map((s) => ({
        ...s,
        slotId: slot.id,
        slotLabel: slot.label,
        slotTime: slot.time,
      }))
    );
  const [cardList, setCardList] = useState(buildInitialList());
  const [editCardId, setEditCardId] = useState(null);
  const [editVals, setEditVals] = useState({});

  // Handle inline edit initiation and value changes
  function handleEditStart(card) {
    setEditCardId(card.id);
    setEditVals({ title: card.title, detail: card.detail });
  }
  function handleEditChange(e) {
    setEditVals((v) => ({ ...v, [e.target.name]: e.target.value }));
  }
  function handleEditSave(cardId) {
    setCardList((cards) =>
      cards.map((c) =>
        c.id === cardId ? { ...c, ...editVals } : c
      )
    );
    setEditCardId(null);
    setEditVals({});
  }
  function handleEditCancel() {
    setEditCardId(null);
    setEditVals({});
  }
  function handleDelete(cardId) {
    setCardList((cards) => cards.filter((c) => c.id !== cardId));
    if (editCardId === cardId) handleEditCancel();
  }

  // Sort by slot time for consistent visual arrangement
  const slotCompare = (a, b) => {
    // 09:00, 13:10, etc
    const [ha, ma] = a.slotTime.split(":").map(Number);
    const [hb, mb] = b.slotTime.split(":").map(Number);
    return ha !== hb ? ha - hb : ma - mb;
  };

  // Card rendering helper
  function SuggestionCard({ card }) {
    const isEditing = editCardId === card.id;
    return (
      <div
        className="card"
        style={{
          marginBottom: 18,
          borderLeft: "5.5px solid var(--accent)",
          background: "var(--surface)",
          transition: "background 0.24s, box-shadow 0.14s",
          boxShadow:
            editCardId === card.id
              ? "var(--box-shadow), 0 0 0 3px var(--secondary)"
              : "var(--box-shadow)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: "1.09rem",
              color: "var(--primary)",
              letterSpacing: "0.01em",
              marginRight: 18,
              flex: "1 1 auto",
            }}
          >
            {card.slotTime} &middot; {card.slotLabel}
          </span>
          {/* Delete Button */}
          <button
            className="btn"
            style={{
              minWidth: 38,
              padding: "8px 14px",
              marginRight: 6,
              background: "var(--kavia-orange)",
              color: "#fff",
              borderRadius: 7,
            }}
            aria-label="Delete suggestion"
            onClick={() => handleDelete(card.id)}
          >
            &#x2716;
          </button>
          {/* Edit Button */}
          {isEditing ? null : (
            <button
              className="btn"
              style={{
                minWidth: 38,
                padding: "8px 14px",
                background: "var(--primary)",
                color: "#fff",
                borderRadius: 7,
              }}
              aria-label="Edit suggestion"
              onClick={() => handleEditStart(card)}
            >
              &#9998;
            </button>
          )}
        </div>
        {/* Card Content */}
        {isEditing ? (
          <form
            style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}
            onSubmit={e => {
              e.preventDefault();
              handleEditSave(card.id);
            }}
          >
            <input
              type="text"
              name="title"
              value={editVals.title}
              onChange={handleEditChange}
              style={{
                fontWeight: 600,
                color: "var(--primary)",
                fontSize: "1.12rem",
                marginBottom: 6,
                border: "1.4px solid var(--border-color)",
              }}
              required
              maxLength={68}
              autoFocus
            />
            <textarea
              name="detail"
              value={editVals.detail}
              onChange={handleEditChange}
              rows={2}
              style={{
                color: "var(--text-primary)",
                fontSize: "1rem",
                border: "1.3px solid var(--border-color)",
                borderRadius: 5,
                minHeight: 36,
                resize: "vertical",
              }}
              maxLength={480}
              required
            />
            <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
              <button
                className="btn"
                style={{
                  background: "var(--primary)",
                  color: "#fff",
                  borderRadius: 6,
                  padding: "9px 24px"
                }}
                type="submit"
              >
                Save
              </button>
              <button
                className="btn"
                style={{
                  background: "#e0e7e8",
                  color: "var(--text-secondary)",
                  borderRadius: 6,
                  padding: "9px 18px"
                }}
                type="button"
                onClick={handleEditCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div style={{ marginTop: 10 }}>
            <div
              className="subtitle"
              style={{
                fontWeight: 600,
                fontSize: "1.13rem",
                marginBottom: 4,
                color: "var(--secondary)"
              }}
            >
              {card.title}
            </div>
            <div className="description" style={{ color: "var(--text-secondary)" }}>
              {card.detail}
            </div>
          </div>
        )}
      </div>
    );
  }

  /**
   * Timeline rendering: Render timeline/time slots as a vertical stack with
   * suggestion cards assigned to each slot. Cards are sorted by slot (time).
   */
  function renderTimeline() {
    // Group by slot (time, label)
    const slots = {};
    cardList.forEach((card) => {
      const key = `${card.slotId}-${card.slotTime}`;
      if (!slots[key]) {
        slots[key] = {
          slotId: card.slotId,
          slotTime: card.slotTime,
          slotLabel: card.slotLabel,
          cards: [],
        };
      }
      slots[key].cards.push(card);
    });
    // Sort by time
    const slotArr = Object.values(slots).sort((a, b) => {
      const [ha, ma] = a.slotTime.split(":").map(Number);
      const [hb, mb] = b.slotTime.split(":").map(Number);
      return ha !== hb ? ha - hb : ma - mb;
    });

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {slotArr.map((slot, idx) => (
          <div key={slot.slotId} style={{ marginBottom: 2 }}>
            <div
              style={{
                color: "var(--secondary)",
                fontWeight: 600,
                fontSize: "1.08rem",
                marginBottom: 2,
                marginLeft: 2,
              }}
            >
              {slot.slotTime} &middot; {slot.slotLabel}
            </div>
            {slot.cards
              .sort(slotCompare)
              .map((c) => (
                <SuggestionCard key={c.id} card={c} />
              ))}
          </div>
        ))}
        {cardList.length === 0 && (
          <div
            className="card"
            style={{
              marginTop: 22,
              textAlign: "center",
              color: "var(--text-secondary)",
              background: "#fcfdfd",
              fontSize: "1.15rem",
            }}
          >
            All redaction suggestions handled 🎉
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container" style={{ minHeight: "65vh" }}>
      <h1 className="page-title">Data Disintegration Manager</h1>
      <p className="description" style={{ maxWidth: 700 }}>
        Your scheduled content and privacy redaction suggestions are shown below.
        Review, edit, or delete redaction suggestions for each item before the
        scheduled disintegration.
      </p>
      <div
        className="card"
        style={{
          marginBottom: 30,
          background: "var(--surface)",
          border: "1.7px solid var(--border-color)",
          boxShadow: "var(--box-shadow)",
        }}
      >
        <span
          style={{
            fontWeight: 700,
            color: "var(--primary)",
            fontSize: "1.16rem",
            textShadow: "0 0 6px var(--accent)",
          }}
        >
          Content Timeline (Today)
        </span>
        <div
          style={{
            marginTop: 18,
            marginBottom: 2,
            borderLeft: "3.5px solid var(--accent)",
            paddingLeft: 12,
            minHeight: 48,
            background: "rgba(19,185,185,0.05)",
          }}
        >
          {renderTimeline()}
        </div>
      </div>
    </div>
  );
}

export default Disintegration;
