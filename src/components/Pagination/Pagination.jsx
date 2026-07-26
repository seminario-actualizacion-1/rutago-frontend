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

  const maxVisiblePages = 5;
  const mostrarEllipsisInicio = currentPage > 3 && totalPages > maxVisiblePages;
  const mostrarEllipsisFin =
    currentPage < totalPages - 2 && totalPages > maxVisiblePages;

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
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

          {mostrarEllipsisInicio && (
            <>
              <button
                className="pagination-button"
                onClick={() => onPageChange(1)}
              >
                1
              </button>
              <span className="pagination-button pagination-ellipsis">…</span>
            </>
          )}
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`pagination-button ${currentPage === page ? "pagination-button-active" : ""}`}
            >
              {page}
            </button>
          ))}
          {mostrarEllipsisFin && (
            <>
              <span className="pagination-button pagination-ellipsis">…</span>
              <button
                className="pagination-button"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}

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
        Mostrando <span className="pagination-info-bold">{startItem}</span> -{" "}
        <span className="pagination-info-bold">{endItem}</span> de{" "}
        <span className="pagination-info-bold">{totalItems}</span> registros
      </div>
    </div>
  );
};

export default Pagination;
