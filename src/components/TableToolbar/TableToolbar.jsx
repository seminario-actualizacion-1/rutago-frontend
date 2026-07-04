import { useState, useEffect, useRef } from "react";
import "./TableToolbar.css";

export default function TableToolbar({ searchValue, onSearchChange, filters, onFilterChange, placeholder, sortOptions, sortBy, sortOrder, onSortChange }) {
  const [localSearch, setLocalSearch] = useState(searchValue || "");
  const debounceRef = useRef(null);

  useEffect(() => {
    setLocalSearch(searchValue || "");
  }, [searchValue]);

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChange(value);
    }, 400);
  };

  return (
    <div className="table-toolbar">
      <div className="table-toolbar-search">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder || "Buscar..."}
          value={localSearch}
          onChange={handleSearchInput}
          autoComplete="off"
        />
        {localSearch && (
          <button className="search-clear" onClick={() => { setLocalSearch(""); onSearchChange(""); }}>
            &times;
          </button>
        )}
      </div>
      {filters && filters.length > 0 && (
        <div className="table-toolbar-filters">
          {filters.map((filter) => (
            <select
              key={filter.name}
              className="filter-select"
              value={filter.value || ""}
              onChange={(e) => onFilterChange(filter.name, e.target.value)}
            >
              <option value="">{filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}
      {sortOptions && sortOptions.length > 0 && (
        <div className="table-toolbar-sort">
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value, sortOrder)}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            className="sort-order-btn"
            onClick={() => onSortChange(sortBy, sortOrder === "ASC" ? "DESC" : "ASC")}
            title={sortOrder === "ASC" ? "Ascendente" : "Descendente"}
          >
            {sortOrder === "ASC" ? "↑ ASC" : "↓ DESC"}
          </button>
        </div>
      )}
    </div>
  );
}
