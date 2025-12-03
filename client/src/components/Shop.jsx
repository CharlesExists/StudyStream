import React, { useState } from "react";
import "./Shop.css";

const sailItems = [
  { name: "Red", xp: "100 XP" },
  { name: "Orange", xp: "150 XP" },
  { name: "Yellow", xp: "175 XP" },
  { name: "Blue", xp: "300 XP" },
  { name: "NYU", xp: "9999 XP" },
];

const baseItems = [
  { name: "Wood", xp: "100 XP" },
  { name: "Oak", xp: "200 XP" },
  { name: "Maple", xp: "250 XP" },
  { name: "Walnut", xp: "350 XP" },
  { name: "NYU Base", xp: "9999 XP" },
];

export default function SailShop() {
  const [activeTab, setActiveTab] = useState("sail");

  const items = activeTab === "sail" ? sailItems : baseItems;

  return (
    <div className="sail-shop-page">
      <div className="sail-shop-card">
        {/* Tabs */}
        <div className="sail-shop-tabs">
          <button
            className={
              "sail-tab " + (activeTab === "sail" ? "sail-tab-active" : "")
            }
            onClick={() => setActiveTab("sail")}
          >
            Sail
          </button>
          <button
            className={
              "sail-tab " + (activeTab === "base" ? "sail-tab-active" : "")
            }
            onClick={() => setActiveTab("base")}
          >
            Base
          </button>
        </div>

        {/* Item row – layout stays the same, data changes */}
        <div className="sail-items-wrapper">
          {items.map((item) => (
            <div className="sail-item" key={item.name}>
              <div className="sail-item-placeholder" />
              <div className="sail-item-label">
                <div className="sail-item-name">{item.name}</div>
                <div className="sail-item-xp">{item.xp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase modal */}
      <div className="sail-purchase-panel">
        <p className="purchase-line">
          Purchase <span className="purchase-accent">NYU</span> for
        </p>
        <p className="purchase-xp-line">9999 XP?</p>

        <div className="purchase-actions">
          <button className="purchase-btn primary">Yes</button>
          <button className="purchase-btn secondary">No</button>
        </div>
      </div>
    </div>
  );
}
