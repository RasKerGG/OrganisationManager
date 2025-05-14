import { useEffect, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";

export default function CertificateComponent() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [colDefs] = useState([
        { field: "fullName", headerName: "Полное имя" },
        { headerName: "Дата найма", valueGetter: (params) => {
                return new Date(params.data.joinDate).toLocaleDateString();
            } },
        { field: "salary", headerName: "Зарплата" },
        { field: "branch.name", headerName: "Филиал" },
        { field: "position.name", headerName: "Должность" },
    ]);

    useEffect(() => {
        async function fetchEmployees() {
            try {
                const response = await axios.get(`https://wantonly-sublime-raccoon.cloudpub.ru/api/employees`);
                setEmployees(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchEmployees();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

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
}