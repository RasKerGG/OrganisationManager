import React from 'react';

const EmployeeTable = ({
                           employees,
                           sortBy,
                           order,
                           onSort,
                           onDelete,
                           onEdit
                       }) => {
    const columns = [
        { key: 'fullName', label: 'ФИО' },
        { key: 'branchName', label: 'Филиал' },
        { key: 'joinDate', label: 'Дата приёма' },
        { key: 'salary', label: 'Зарплата' },
        { key: 'positionName', label: 'Должность' }
    ];

    return (
        <table className="employee-table">
            <thead>
            <tr>
                {columns.map(({ key, label }) => (
                    <th key={key}>
                        <button
                            onClick={() => onSort(key)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                            {label}
                            {sortBy === key && (order === 'ASC' ? ' ↑' : ' ↓')}
                        </button>
                    </th>
                ))}
                <th>Действия</th>
            </tr>
            </thead>
            <tbody>
            {employees.map(employee => (
                <tr key={employee.id}>
                    <td>{employee.fullName}</td>
                    <td>{employee.branch?.name || 'N/A'}</td>
                    <td>{new Date(employee.joinDate).toLocaleDateString()}</td>
                    <td>{Number(employee.salary).toLocaleString()} ₽</td>
                    <td>{employee.position?.name || 'N/A'}</td>
                    <td>
                        <button
                            onClick={() => onDelete(employee.id)}
                            style={{ background: '#ac1a1a', padding: '2px 8px' }}
                        >
                            🗑️
                        </button>
                        <button
                            onClick={() => onEdit(employee.id)}
                            style={{ background: '#206fd5', padding: '2px 8px', margin: 'auto' }}
                        >
                            ✏️️
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default EmployeeTable;