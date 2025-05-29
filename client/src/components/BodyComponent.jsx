import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import EmployeeEditForm from "./EmployeeEditFormComponents.jsx";
import {BranchTree} from "./BranchTreeComponent.jsx";
import EmployeeTable from "./EmployeeTableComponent.jsx";

import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

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
    const [positions, setPositions] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState();
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [isTourActive, setIsTourActive] = useState(false);
    const driverRef = useRef();


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
    }, [selectedBranch]);

    const startTour = () => {
        if (driverRef.current) {
            driverRef.current.destroy();
        }

        driverRef.current = driver({
            showProgress: true,
            popoverClass: 'driverjs-theme',
            steps: [
                {
                    element: '#tour-title',
                    popover: {
                        title: 'Организационная структура',
                        description: 'Это главная страница управления организационной структурой компании.',
                        side: 'bottom',
                    }
                },
                {
                    element: '#add-branch-form',
                    popover: {
                        title: 'Добавление филиала',
                        description: 'Здесь вы можете создать новый филиал, указав его название и родительский филиал.',
                        side: 'bottom',
                    }
                },
                {
                    element: '#branch-tree',
                    popover: {
                        title: 'Дерево филиалов',
                        description: 'Иерархическое представление всех филиалов. Вы можете выбирать филиалы и управлять ими.',
                        side: 'right',
                    }
                },
                {
                    element: '#add-employee-form',
                    popover: {
                        title: 'Добавление сотрудника',
                        description: 'Заполните форму, чтобы добавить нового сотрудника в выбранный филиал.',
                        side: 'left',
                    }
                },
                {
                    element: '#employee-table-section',
                    popover: {
                        title: 'Таблица сотрудников',
                        description: 'Здесь отображаются все сотрудники. Вы можете редактировать или удалять записи.',
                        side: 'top',
                    }
                }
            ]
        });

        driverRef.current.drive();
        setIsTourActive(true);
    };


    const fetchData = async () => {
        try {
            const [branchesRes, positionsRes] = await Promise.all([
                axios.get('https://wantonly-sublime-raccoon.cloudpub.ru/api/branches'),
                axios.get('https://wantonly-sublime-raccoon.cloudpub.ru/api/positions')
            ]);

            setBranches(branchesRes.data);
            setAllBranches(branchesRes.data);
            setPositions(positionsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
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
                    <Typography variant="h4" gutterBottom id="tour-title">
                        Организационная структура
                    </Typography>

                    <div className="form-section" id="add-branch-form">
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
                    <div id="branch-tree">
                    <BranchTree
                        branches={branches}
                        onBranchSelect={(id) => setSelectedBranch(Number(id))}
                        onBranchDelete={handleDeleteBranch}
                     />
                    </div>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={startTour}
                        >
                            Помощь
                        </Button>
                    </Box>
                </div>

                <Grid item xs={12} md={6}>


                    <div className="form-section" id="add-employee-form">
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
                    <div id="employee-table-section">
                        <EmployeeTable
                            onDelete={handleDeleteEmployee}
                            onEdit={handleEditEmployee}
                            branchId={selectedBranch}
                        />
                    </div>
                </Grid>
            </div>
        </div>
    );
};

export default OrganizationalStructure;