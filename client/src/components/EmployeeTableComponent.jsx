import React, { useState } from 'react';
import { AgGridReact } from "ag-grid-react";

import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableSortLabel
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


const EmployeeButtons = (params) => {
    return (
        <>
            <IconButton
                onClick={() => params.onEdit(params.data)} color="primary"
            >
                <EditIcon/>
            </IconButton>
            <IconButton
                onClick={() => params.onDelete(params.data.id)} color="error"
            >
                <DeleteIcon/>
            </IconButton>
        </>
    );
};

const EmployeeTable = ({ employees, onDelete, onEdit }) => {
    const [colDefs] = useState([
        { field: "fullName", headerName: "ФИО" },
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