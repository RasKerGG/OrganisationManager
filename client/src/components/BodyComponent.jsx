import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeEditForm from "./EmployeeEditFormComponents.jsx";
import {BranchTree} from "./BranchTreeComponent.jsx";
import EmployeeTable from "./EmployeeTableComponent.jsx";


import {
    Grid,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box
} from "@mui/material";

const OrganizationalStructure = () => {
    const [branches, setBranches] = useState([]);
    const [allBranches, setAllBranches] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [positions, setPositions] = useState([]);
    const [sortBy, setSortBy] = useState('fullName');
    const [order, setOrder] = useState('ASC');
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
    }, [sortBy, order, selectedBranch]);



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


    const handleEditEmployee = (employee) => {
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
                    <Typography variant="h4" gutterBottom>
                        Организационная структура
                    </Typography>

                    <div className="form-section">
                        <Typography variant="h6" gutterBottom>
                            Добавить филиал
                        </Typography>
                        <form onSubmit={handleAddBranch}>
                            <TextField
                                fullWidth
                                label="Название филиала"
                                value={newBranch.name}
                                onChange={e => setNewBranch({ ...newBranch, name: e.target.value })}
                                margin="normal"
                            />

                            <FormControl fullWidth margin="normal">
                                <InputLabel>Родительский филиал</InputLabel>
                                <Select
                                    value={newBranch.parent_id}
                                    onChange={e => setNewBranch({ ...newBranch, parent_id: e.target.value })}
                                >
                                    <MenuItem value="">Без родителя</MenuItem>
                                    {allBranches.map(branch => (
                                        <MenuItem key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                                Добавить филиал
                            </Button>
                        </form>

                    </div>

                    <BranchTree
                        branches={branches}
                        onBranchSelect={(id) => setSelectedBranch(id)}
                        onBranchDelete={handleDeleteBranch}
                    />
                </div>

                <Grid item xs={12} md={6}>


                    <div className="form-section">
                        <Typography variant="h4" gutterBottom>
                            Добавить сотрудника
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Добавить сотрудника
                        </Typography>
                        <form onSubmit={handleAddEmployee}>
                            <TextField
                                fullWidth
                                label="Полное имя"
                                value={newEmployee.fullName}
                                onChange={e => setNewEmployee({...newEmployee, fullName: e.target.value})}
                                margin="normal"
                            />

                            <TextField
                                fullWidth
                                label="Дата приёма"
                                type="date"
                                InputLabelProps={{shrink: true}}
                                value={newEmployee.joinDate}
                                onChange={e => setNewEmployee({...newEmployee, joinDate: e.target.value})}
                                margin="normal"
                            />

                            <TextField
                                fullWidth
                                label="Зарплата"
                                type="number"
                                inputProps={{step: "0.01"}}
                                value={newEmployee.salary}
                                onChange={e => setNewEmployee({...newEmployee, salary: e.target.value})}
                                margin="normal"
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Филиал</InputLabel>
                                <Select
                                    value={newEmployee.branchId || ''}
                                    onChange={e => setNewEmployee({...newEmployee, branchId: e.target.value})}
                                >
                                    <MenuItem value="">Выберите филиал</MenuItem>
                                    {allBranches.map(branch => (
                                        <MenuItem key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Должность</InputLabel>
                                <Select
                                    value={newEmployee.positionId || ''}
                                    onChange={e => setNewEmployee({...newEmployee, positionId: e.target.value})}
                                >
                                    <MenuItem value="">Выберите должность</MenuItem>
                                    {positions.map(position => (
                                        <MenuItem key={position.id} value={position.id}>
                                            {position.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box sx={{display: 'flex', gap: 2, mt: 2}}>
                                <Button type="submit" variant="contained">
                                    Добавить сотрудника
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleBranchSelectRemove}
                                >
                                    Показать всех
                                </Button>
                            </Box>
                        </form>
                    </div>

                    <EmployeeTable
                        employees={employees}
                        sortBy={sortBy}
                        order={order}
                        onSort={handleSort}
                        onDelete={handleDeleteEmployee}
                        onEdit={handleEditEmployee}
                    />
                </Grid>
            </div>
        </div>
    );
};

export default OrganizationalStructure;