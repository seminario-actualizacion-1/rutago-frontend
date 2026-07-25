import { useState, useCallback, useMemo } from "react";

export function usePaginacion(defaultItemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [pagination, setPagination] = useState(null);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  }, []);

  const actualizarPaginacion = useCallback((data) => {
    setPagination(data || null);
  }, []);

  const resetPaginacion = useCallback(() => {
    setCurrentPage(1);
    setItemsPerPage(defaultItemsPerPage);
    setPagination(null);
  }, [defaultItemsPerPage]);

  const queryParams = useMemo(
    () => ({ paginaActual: currentPage, registrosPorPagina: itemsPerPage }),
    [currentPage, itemsPerPage],
  );

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    pagination,
    handlePageChange,
    handleItemsPerPageChange,
    actualizarPaginacion,
    resetPaginacion,
    queryParams,
  };
}
