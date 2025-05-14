import React, { useState } from 'react';
import { AgGridReact } from "ag-grid-react";


const EmployeeButtons = (params) => {
    return (
        <>
            <button
                onClick={() => params.onEdit(params.data)}
                style={{ background: '#206fd5', padding: '4px 6px' }}
            >
                ✏️️
            </button>
            <button
                onClick={() => params.onDelete(params.data.id)}
                style={{ background: '#ac1a1a', padding: '4px 6px', marginLeft: '10px' }}
            >
                🗑️
            </button>
        </>
    );
};

const EmployeeTable = ({ employees, onDelete, onEdit }) => {
    const [colDefs] = useState([
        { field: "fullName", headerName: "Полное имя" },
        {
            headerName: "Дата найма",
            valueGetter: (params) => new Date(params.data.joinDate).toLocaleDateString()
        },
        { field: "salary", headerName: "Зарплата" },
        { field: "branch.name", headerName: "Филиал" },
        { field: "position.name", headerName: "Должность" },
        {
            headerName: "Действия",
            cellRenderer: EmployeeButtons,
            cellRendererParams: (params) => ({
                data: params.data,
                onDelete: onDelete,
                onEdit: onEdit
            }),
        }
    ]);

    return (
        <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
            <AgGridReact
                rowData={employees}
                columnDefs={colDefs}
                animateRows={true}
                pagination={true}
                paginationPageSize={10}
            />
        </div>
    );
};

export default EmployeeTable;