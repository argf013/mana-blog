import PropTypes from 'prop-types';

const TablePagination = ({ currentPage, totalPages, rowsPerPage, setRowsPerPage, setCurrentPage, dataLength }) => {
    return (
        <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between px-6 py-5" aria-label="Table navigation">
            <div className="flex items-center mb-4 md:mb-0">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mr-2">Rows per page:</span>
                <select
                    value={rowsPerPage}
                    onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="text-sm text-gray-500 dark:text-gray-400 bg-white border border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-700"
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, dataLength)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{dataLength}</span>
            </span>
            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                <li>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="flex items-center justify-center px-3 h-8 ms-0 rounded-left rounded-l-lg leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                        Previous
                    </button>
                </li>
                {Array.from({ length: totalPages }, (_, index) => (
                    <li key={index}>
                        <button
                            onClick={() => setCurrentPage(index + 1)}
                            className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === index + 1 ? 'text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}`}
                        >
                            {index + 1}
                        </button>
                    </li>
                ))}
                <li>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className="flex items-center justify-center px-3 h-8 rounded-r-lg leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

TablePagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    setRowsPerPage: PropTypes.func.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
    dataLength: PropTypes.number.isRequired,
};

export default TablePagination;