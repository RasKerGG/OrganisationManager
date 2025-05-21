import React, { useCallback } from 'react';
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const operatorMap = {
    equals: 'eq',
    notEqual: 'ne',
    lessThan: 'lt',
    lessThanOrEqual: 'lte',
    greaterThan: 'gt',
    greaterThanOrEqual: 'gte',
    inRange: 'between',
    contains: 'iLike',
    notContains: 'notLike',
    startsWith: 'startsWith',
    endsWith: 'endsWith'
};

const createFilterConditions = (filterModel) => {
    return Object.entries(filterModel).reduce((acc, [field, filter]) => {
        if (!filter) return acc;

        if (field === 'branchId') {
            acc[field] = { [operatorMap[filter.type]]: filter.filter };
            return acc;
        }
        const condition = {};
        const operator = operatorMap[filter.type] || filter.type;

        const fieldName = field === 'branchName' ? '$branch.name$' :
            field === 'positionName' ? '$position.name$' :
                field;

        switch (filter.filterType) {
            case "number":
                if (filter.type === 'inRange') {
                    condition[operator] = [filter.filter, filter.filterTo];
                } else {
                    condition[operator] = filter.filter;
                }
                break;

            case "date":
                if (filter.type === 'inRange') {
                    condition[operator] = [
                        new Date(filter.dateFrom).toISOString(),
                        new Date(filter.dateTo).toISOString()
                    ];
                } else {
                    condition[operator] = new Date(filter.dateFrom).toISOString();
                }
                break;

            case "text":
                condition[operator] = `%${filter.filter}%`;
                break;
        }

        if (Object.keys(condition).length > 0) {
            acc[fieldName] = condition;
        }

        return acc;
    }, {});
};

const EmployeeButtons = (params) => {
    return (
        <>
            <IconButton
                onClick={() => params.onEdit(params.data)} color="primary"
            >
                <EditIcon />
            </IconButton>
            <IconButton
                onClick={() => params.onDelete(params.data.id)} color="error"
            >
                <DeleteIcon />
            </IconButton>
        </>
    );
};

const EmployeeTable = ({ onDelete, onEdit, branchId }) => {
    const [columnDefs] = React.useState([
        { field: "fullName", headerName: "ФИО", filter: 'agTextColumnFilter' },
        {
            field: "joinDate",
            headerName: "Дата найма",
            filter: 'agDateColumnFilter',
            valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString("ru-RU") : ''
        },
        { field: "salary", headerName: "Зарплата", filter: 'agNumberColumnFilter' },
        { field: "branchName", headerName: "Филиал", filter: 'agTextColumnFilter' },
        { field: "positionName", headerName: "Должность", filter: 'agTextColumnFilter' },
        {
            headerName: "Действия",
            cellRenderer: EmployeeButtons,
            cellRendererParams: (params) => ({
                data: params.data,
                onDelete: onDelete,
                onEdit: onEdit
            }),
            sortable: false,
            filter: false
        }
    ]);

    const dataSource = {
        getRows: async (params) => {
            try {
                const filterModel = { ...params.request.filterModel };

                if (branchId) {
                    filterModel.branchId = {
                        type: 'equals',
                        filter: branchId,
                        filterType: 'number'
                    };
                }

                const request = {
                    startRow: params.request.startRow,
                    endRow: params.request.endRow,
                    sortModel: params.request.sortModel,
                    filterModel: createFilterConditions(filterModel)
                };

                const response = await axios.post(
                    "https://wantonly-sublime-raccoon.cloudpub.ru/api/employees/view",
                    request
                );

                params.success({
                    rowData: response.data.rows,
                    rowCount: response.data.lastRow
                });
            } catch (error) {
                params.fail();
            }
        }
    };

    const gridOptions = {
        rowModelType: "serverSide",
        serverSideDatasource: dataSource,
        pagination: true,
        paginationPageSize: 10,
        cacheBlockSize: 10,
        defaultColDef: {
            flex: 1,
            sortable: true,
            filter: true,
            floatingFilter: true
        }
    };

    return (
        <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
            <AgGridReact
                columnDefs={columnDefs}
                gridOptions={gridOptions}
                onGridReady={(params) => params.api.sizeColumnsToFit()}
            />
        </div>
    );
};

export default EmployeeTable;