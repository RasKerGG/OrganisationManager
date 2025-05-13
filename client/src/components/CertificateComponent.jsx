import { useEffect, useState } from "react";
import axios from "axios";

export default function CertificateComponent() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchEmployees() {
            try {
                const response = await axios.get(`http://localhost:3000/certificate`);
                setEmployees(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }

        fetchEmployees();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-9 col-lg-10 p-4">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>ФИО</th>
                            <th>Должность</th>
                            <th>Оклад</th>
                            <th>Дата приема</th>
                        </tr>
                        </thead>
                        <tbody>
                        {employees.map(employee => (
                            <tr key={employee.id}>
                                <td>{employee.fullName}</td>
                                <td>{employee.positionName}</td>
                                <td>{employee.salary}</td>
                                <td>{formatDate(employee.joinDate)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}