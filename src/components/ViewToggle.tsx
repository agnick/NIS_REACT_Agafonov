import React from "react";
import "../styles/ViewToggle.css";

interface ViewToggleProps {
    viewMode: "grid" | "list";
    onChange: (mode: "grid" | "list") => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onChange }) => {
    return (
        <div className="view-toggle">
            <button
                onClick={() => onChange("grid")}
                className={viewMode === "grid" ? "active" : ""}
            >
                Плитка
            </button>
            <button
                onClick={() => onChange("list")}
                className={viewMode === "list" ? "active" : ""}
            >
                Список
            </button>
        </div>
    );
};

export default ViewToggle;
