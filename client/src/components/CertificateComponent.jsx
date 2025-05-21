import {useState, useCallback } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";

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


export default function CertificateComponent() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [colDefs] = useState([
        {
            field: "fullName",
            headerName: "Полное имя",
            filter: "agTextColumnFilter",
            floatingFilter: true
        },
        {
            field: "joinDate",
            headerName: "Дата найма",
            filter: "agDateColumnFilter",
            valueFormatter: (params) =>
                new Date(params.value).toLocaleDateString("ru-RU"),
            floatingFilter: true
        },
        {
            field: "salary",
            headerName: "Зарплата",
            filter: "agNumberColumnFilter",
            floatingFilter: true
        },
        {
            field: "branchName",
            headerName: "Филиал",
            filter: "agTextColumnFilter",
            floatingFilter: true
        },
        {
            field: "positionName",
            headerName: "Должность",
            filter: "agTextColumnFilter",
            floatingFilter: true
        }
    ]);


    const dataSource = {
        getRows: async (params) => {
            try {
                setLoading(true);
                setError(null);

                const request = {
                    startRow: params.request.startRow,
                    endRow: params.request.endRow,
                    sortModel: params.request.sortModel,
                    filterModel: createFilterConditions(params.request.filterModel)
                };

                const response = await axios.post("https://wantonly-sublime-raccoon.cloudpub.ru/certificate",
                    request
                );

                params.success({
                    rowData: response.data.rows,
                    rowCount: response.data.lastRow
                });
            } catch (err) {
                setError(err.message);
                params.fail();
            } finally {
                setLoading(false);
            }
        }
    };

    const gridOptions = useCallback(() => ({
        rowModelType: "serverSide",
        serverSideDatasource: dataSource,
        pagination: true,
        paginationPageSize: 10,
        cacheBlockSize: 10,
        animateRows: true,
        suppressDragLeaveHidesColumns: true,
        defaultColDef: {
            flex: 1,
            sortable: true,
            resizable: true,
            filter: true,
            floatingFilter: true,
            menuTabs: ["filterMenuTab"]
        }
    }), []);

    return (
        <div className="ag-theme-alpine" style={{ height: "80vh", width: "100%" }}>
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            )}

            {error && (
                <div className="error-message">
                    Ошибка загрузки данных: {error}
                </div>
            )}

            <AgGridReact
                columnDefs={colDefs}
                gridOptions={gridOptions()}
                onGridReady={(params) => params.api.sizeColumnsToFit()}
            />
        </div>
    );
}