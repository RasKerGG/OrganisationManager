import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeEditForm from "./EmployeeEditFormComponents.jsx";
import {BranchTree} from "./BranchTreeComponent.jsx";
import EmployeeTable from "./EmployeeTableComponent.jsx";

const OrganizationalStructure = () => {
    const [branches, setBranches] = useState([]);
    const [allBranches, setAllBranches] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [positions, setPositions] = useState([]);
    const [sortBy, setSortBy] = useState('fullName');
    const [order, setOrder] = useState('ASC');
    const [currentTheme, setTheme] = useState('light');
    const [selectedBranch, setSelectedBranch] = useState();
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);

    const [newBranch, setNewBranch] = useState({ name: '', parent_id: '' });
    const [newEmployee, setNewEmployee] = useState({
        fullName: '',
        joinDate: '',
        salary: '',
        branchId: '',
        positionId: ''
    });

    useEffect(() => {
        fetchData();
        fetchTheme();
    }, [sortBy, order, selectedBranch]);


    const fetchTheme = () => {
        let currentTheme = localStorage.getItem('theme')
        setTheme(currentTheme);
        document.body.className = currentTheme === 'dark' ? 'dark-theme' : '';
    }

    const fetchData = async () => {
        if (selectedBranch !== undefined) {
            try {
                const [branchesRes, employeesRes, positionsRes] = await Promise.all([

                    axios.get('https://wantonly-sublime-raccoon.cloudpub.ru/api/branches'),
                    axios.get(`https://wantonly-sublime-raccoon.cloudpub.ru/api/employees?sortBy=${sortBy}&order=${order}&branchId=${selectedBranch}`),
                    axios.get('https://wantonly-sublime-raccoon.cloudpub.ru/api/positions')
                ]);

                setBranches(branchesRes.data);
                setAllBranches(branchesRes.data);
                setEmployees(employeesRes.data);
                setPositions(positionsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        } else {
            try {
                const [branchesRes, employeesRes, positionsRes] = await Promise.all([

                    axios.get('https://wantonly-sublime-raccoon.cloudpub.ru/api/branches'),
                    axios.get(`https://wantonly-sublime-raccoon.cloudpub.ru/api/employees?sortBy=${sortBy}&order=${order}`),
                    axios.get('https://wantonly-sublime-raccoon.cloudpub.ru/api/positions')
                ]);

                setBranches(branchesRes.data);
                setAllBranches(branchesRes.data);
                setEmployees(employeesRes.data);
                setPositions(positionsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    const handleBranchSelectRemove = async () => {
        setSelectedBranch(undefined);
        await fetchData();
    }

    const handleDeleteBranch = async (id) => {
        try {
            await axios.delete(`https://wantonly-sublime-raccoon.cloudpub.ru/api/branches/${id}`, {})
        }
        catch (err) {
            console.log(err)
        }
    }


    const handleEditEmployee = (employeeId) => {
        const employee = employees.find(e => e.id === employeeId);
        setEditingEmployee(employee);
        setShowEditForm(true);
    };



    const handleAddBranch = async e => {
        e.preventDefault();
        try {
            await axios.post('https://wantonly-sublime-raccoon.cloudpub.ru/api/branches', newBranch);
            setNewBranch({ name: '', parent_id: '' });
            await fetchData();
        } catch (error) {
            console.error('Error adding branch:', error);
        }
    };

    const handleAddEmployee = async e => {
        e.preventDefault();
        try {
            await axios.post('https://wantonly-sublime-raccoon.cloudpub.ru/api/employees', newEmployee);
            setNewEmployee({
                fullName: '',
                joinDate: '',
                salary: '',
                branchId: '',
                positionId: ''
            });
            await fetchData();
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    };

    const handleDeleteEmployee = async id => {
        try {
            await axios.delete(`https://wantonly-sublime-raccoon.cloudpub.ru/employees/${id}`);
            await fetchData();
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const handleSort = (column) => {
        const backendSortFieldMap = {
            fullName: 'fullName',
            branchName: 'branchId',
            joinDate: 'joinDate',
            salary: 'salary',
            positionName: 'positionId'
        };

        const backendField = backendSortFieldMap[column] || column;
        const newOrder = sortBy === backendField && order === 'ASC' ? 'DESC' : 'ASC';

        setSortBy(backendField);
        setOrder(newOrder);
    };

    return (
        <div>
            {showEditForm && (
                <EmployeeEditForm
                    employee={editingEmployee}
                    branches={allBranches}
                    positions={positions}
                    onSave={() => {
                        setShowEditForm(false);
                        fetchData();
                    }}
                    onCancel={() => setShowEditForm(false)}
                />
            )}
            <div className="container mt-3">
                <div className="tree-container">
                    <h2>Организационная структура</h2>

                    <div className="form-section">
                        <h3>Добавить филиал</h3>
                        <form onSubmit={handleAddBranch}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Название филиала"
                                    value={newBranch.name}
                                    onChange={e => setNewBranch({ ...newBranch, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <select
                                    value={newBranch.parent_id}
                                    onChange={e => setNewBranch({ ...newBranch, parent_id: e.target.value })}
                                >
                                    <option value="">Без родителя</option>
                                    {allBranches.map(branch => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit">Добавить филиал</button>
                        </form>

                    </div>

                    <BranchTree
                        branches={branches}
                        onBranchSelect={(id) => setSelectedBranch(id)}
                        onBranchDelete={handleDeleteBranch}
                    />
                </div>

                <div className="employees-container">
                    <h2>Сотрудники филиала</h2>

                    <div className="form-section">
                        <h3>Добавить сотрудника</h3>
                        <form onSubmit={handleAddEmployee}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Полное имя"
                                    value={newEmployee.fullName}
                                    onChange={e => setNewEmployee({...newEmployee, fullName: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="date"
                                    value={newEmployee.joinDate}
                                    onChange={e => setNewEmployee({...newEmployee, joinDate: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Зарплата"
                                    value={newEmployee.salary}
                                    onChange={e => setNewEmployee({...newEmployee, salary: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <select
                                    value={newEmployee.branchId || ''}
                                    onChange={e => setNewEmployee({
                                        ...newEmployee,
                                        branchId: e.target.value ? Number(e.target.value) : null
                                    })}
                                    required
                                >
                                    <option value="">Выберите филиал</option>
                                    {allBranches.map(branch => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <select
                                    value={newEmployee.positionId || ''}
                                    onChange={e => setNewEmployee({
                                        ...newEmployee,
                                        positionId: e.target.value ? Number(e.target.value) : null
                                    })}
                                    required
                                >
                                    <option value="">Выберите должность</option>
                                    {positions.map(position => (
                                        <option key={position.id} value={position.id}>
                                            {position.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit">Добавить сотрудника</button>
                        </form>
                        <button onClick={handleBranchSelectRemove} style={{marginTop: '10px'}}>Показать всех сотрудников</button>
                    </div>

                    <EmployeeTable
                        employees={employees}
                        sortBy={sortBy}
                        order={order}
                        onSort={handleSort}
                        onDelete={handleDeleteEmployee}
                        onEdit={handleEditEmployee}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrganizationalStructure;