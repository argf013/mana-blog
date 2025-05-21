import PropTypes from 'prop-types';
import { useState } from 'react';
import ActionMenu from './ActionMenu';
import Badge from './Badge';
import TablePagination from './TablePagination';

const TableData = ({
    columns = [],
    data = [],
    actions = [],
    initialRowsPerPage = 10,
    badgeColumn = null,
    badgeStyles = {
        bgColor: 'blue-100',
        textColor: 'blue-800',
        darkBgColor: 'blue-900',
        darkTextColor: 'blue-300',
    },
    onBulkDelete = () => { }
}) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
    const [selectedRows, setSelectedRows] = useState([]);

    const handleSort = (column) => {
        let direction = 'asc';
        if (sortConfig.key === column && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: column, direction });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(data.map((_, index) => index));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (index) => {
        if (selectedRows.includes(index)) {
            setSelectedRows(selectedRows.filter((i) => i !== index));
        } else {
            setSelectedRows([...selectedRows, index]);
        }
    };

    const handleBulkDelete = () => {
        const selectedData = selectedRows.map(index => data[index]);
        onBulkDelete(selectedData);
        setSelectedRows([]);
    };

    const sortedData = [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const paginatedData = sortedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const totalPages = Math.ceil(data.length / rowsPerPage);

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <div className="flex justify-between p-4">
                <div className="flex items-center">
                    {selectedRows.length > 0 ? (
                        <button
                            onClick={handleBulkDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Delete Selected
                        </button>
                    ) : (
                        <button className='px-4 py-2 rounded bg-white text-white'> Delete Selected</button>
                    )}
                </div>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="p-4">
                            <div className="flex items-center">
                                <input
                                    id="checkbox-all-search"
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    onChange={handleSelectAll}
                                    checked={selectedRows.length === data.length}
                                />
                                <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                            </div>
                        </th>
                        {columns.map((column, index) => (
                            <th key={index} scope="col" className="px-6 py-3">
                                <div className="flex items-center">
                                    {column}
                                    <button onClick={() => handleSort(column)}>
                                        <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                        </svg>
                                    </button>
                                </div>
                            </th>
                        ))}
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="w-4 p-4">
                                <div className="flex items-center">
                                    <input
                                        id={`checkbox-table-search-${rowIndex}`}
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        onChange={() => handleSelectRow(rowIndex)}
                                        checked={selectedRows.includes(rowIndex)}
                                    />
                                    <label htmlFor={`checkbox-table-search-${rowIndex}`} className="sr-only">checkbox</label>
                                </div>
                            </td>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} className="px-6 py-4">
                                    {column === badgeColumn ? (
                                        <Badge
                                            text={row[column]}
                                            bgColor={badgeStyles.bgColor}
                                            textColor={badgeStyles.textColor}
                                            darkBgColor={badgeStyles.darkBgColor}
                                            darkTextColor={badgeStyles.darkTextColor}
                                        />
                                    ) : (
                                        row[column]
                                    )}
                                </td>
                            ))}
                            <td className="px-6 py-4">
                                <ActionMenu actions={actions} row={row} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                setCurrentPage={setCurrentPage}
                dataLength={data.length}
            />
        </div>
    );
};

TableData.propTypes = {
    columns: PropTypes.array,
    data: PropTypes.array,
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            onClick: PropTypes.func
        })
    ),
    initialRowsPerPage: PropTypes.number,
    badgeColumn: PropTypes.string,
    badgeStyles: PropTypes.shape({
        bgColor: PropTypes.string,
        textColor: PropTypes.string,
        darkBgColor: PropTypes.string,
        darkTextColor: PropTypes.string,
    }),
    onBulkDelete: PropTypes.func
};

export default TableData;