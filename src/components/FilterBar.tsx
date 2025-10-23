import React, { useRef } from "react";
import "../styles/FilterBar.css";

interface FilterBarProps {
    showOnlyFavorites: boolean;
    onToggleFavorites: (value: boolean) => void;
    onSearch: (query: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
                                                 showOnlyFavorites,
                                                 onToggleFavorites,
                                                 onSearch
                                             }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = () => {
        const query = inputRef.current?.value || "";
        onSearch(query);
    };

    return (
        <div className="filter-bar">
            <div className="buttons">
                <button
                    className={!showOnlyFavorites ? "active" : ""}
                    onClick={() => onToggleFavorites(false)}
                >
                    Все
                </button>
                <button
                    className={showOnlyFavorites ? "active" : ""}
                    onClick={() => onToggleFavorites(true)}
                >
                    Только избранные
                </button>
            </div>

            <input
                ref={inputRef}
                type="text"
                placeholder="Поиск по названию..."
                onChange={handleSearch}
            />
        </div>
    );
};

export default FilterBar;
