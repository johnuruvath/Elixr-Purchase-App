import React, { useEffect, useState } from 'react';
import './index.scss';

interface TableProps {
    columns: {
        label: string;
        accessor: string;
        render?: (row: any, index: number) => {

        },
        sortable?: boolean,
        basecolumn?: boolean
    }[];
    data: any[]
}
const Table = ({ columns, data }: TableProps) => { 
 
    const [sortType, setsortType] = useState<string>("asc"); // Setting the sortType initially to ascending order
    const [sortColumn, setSortColumn] = useState<string>("");

    useEffect(() => {
        const basecolumn = columns.find(item => {
            return item.basecolumn;  
        })?.accessor || ""; // finding the accessor of the basecolumn
        setSortColumn(basecolumn) // Setting the basecolumn as the sort column 
    }, [columns])

    const toggleSortType = (column: any) => {
        if (sortColumn === column.accessor) { 
            setsortType(sortType === 'asc' ? 'desc' : 'asc');
        } else {
            setsortType('asc');
            setSortColumn(column.accessor);
        }
    }

    const renderTableColGroup = () => {
        return <colgroup>
            {columns.map(column => {
                return <col className={`col col-${column.accessor}`} key={column.label} /> // For styling 
            })}
        </colgroup>

    }

    const renderTableHeader = () => {
        return <thead >
            <tr>
                {columns.map(column => {
                    return <th className={`th th-${column.accessor}`} key={column.label}>
                        <div className='th-div'>
                            {column.sortable && sortColumn ? sortColumn === column.accessor ? (<span className="material-symbols-outlined" onClick={() => toggleSortType(column)}> {sortType === 'asc' ? "arrow_upward" : "arrow_downward"} </span>) :
                                <span className="material-symbols-outlined" style={{ color: "grey" }} onClick={() => toggleSortType(column)} > swap_vert  </span> : null}
                            <span> {column.label} </span>
                        </div>
                    </th>
                })}
            </tr>
        </thead>

    }


    const sortFunction = (a: any, b: any) => {

         
        if (sortType === 'asc') {
            return a[sortColumn]?.toLowerCase() > b[sortColumn]?.toLowerCase() ? 1 : -1 // Sort in ascending order
        } else {
            return b[sortColumn]?.toLowerCase() > a[sortColumn]?.toLowerCase() ? 1 : -1 // Sort in descending order
        }
    }

    const renderTableBody = () => {

        return <tbody className='table-body'>
            {
                [...data]?.sort(sortFunction).map((row, index) => {
                    return <tr key={index}>
                        {columns.map(column => {
                            return <td className={`td td-${column.accessor}`} key={column.label}> {column.render ? column.render(row, index) : row[column.accessor]} </td>
                        })}

                    </tr>
                }
                )}
        </tbody>
    }

    return (
        <div className='table-wrap'>
            <table>
                {renderTableColGroup()}
                {renderTableHeader()}
                {renderTableBody()}
            </table>
        </div>
    );
};

export default Table;