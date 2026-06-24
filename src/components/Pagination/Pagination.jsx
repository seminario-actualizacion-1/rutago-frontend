import React from "react";
import "./Pagination.css";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
}) => {
  if (totalItems === 0) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i > 0) pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    onItemsPerPageChange(newLimit);
  };

  return (
    <div className="pagination-container">
      <div className="pagination-items-per-page">
        <label>Mostrando:</label>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="pagination-select"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span>registros por página</span>
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="pagination-button"
            title="Primera página"
          >
            «
          </button>
          
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
            title="Página anterior"
          >
            ‹
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`pagination-button ${currentPage === page ? 'pagination-button-active' : ''}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
            title="Página siguiente"
          >
            ›
          </button>

          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-button"
            title="Última página"
          >
            »
          </button>
        </div>
      )}

      <div className="pagination-info">
        Mostrando <span className="pagination-info-bold">{startItem}</span> - <span className="pagination-info-bold">{endItem}</span> de <span className="pagination-info-bold">{totalItems}</span> registros
      </div>
    </div>
  );
};

export default Pagination;
