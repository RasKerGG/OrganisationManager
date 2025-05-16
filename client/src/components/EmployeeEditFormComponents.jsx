import { useState } from "react";
import axios from "axios";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from "@mui/material";

export default function EmployeeEditForm({

                                             employee,
                                             branches,
                                             positions,
                                             onSave,
                                             onCancel
                                         }) {
    const [formData, setFormData] = useState({
        id: employee.id,
        fullName: employee.fullName,
        joinDate: employee.joinDate.split("T")[0],
        salary: employee.salary,
        branchId: employee.branchId,
        positionId: employee.positionId
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            await axios.patch(
                `https://wantonly-sublime-raccoon.cloudpub.ru/api/employees/${formData.id}`,
                formData
            );
            onSave();
        } catch (error) {
            console.error("Error updating employee:", error);
        }
    };

    return (
      <Dialog open={true} onClose={onCancel} maxWidth="sm">
            <form onSubmit={handleSubmit}>
                <DialogTitle>Редактировать сотрудника</DialogTitle>

                <DialogContent>
                    <TextField
                    margin="normal"
                    fullWidth
                    label="Имя"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}/>

                <TextField
                    margin="normal"
                    fullWidth
                    label="Дата приёма"
                    type="date"
                    value={formData.joinDate}
                    onChange={e => setFormData({...formData, joinDate: e.target.value})}
                />

                <TextField
                    margin="normal"
                    fullWidth
                    label="Зарплата"
                    type="number"
                    value={formData.salary}
                    onChange={e => setFormData({...formData, salary: e.target.value})}
                />


                <FormControl fullWidth margin="normal">
                    <InputLabel>Филиал</InputLabel>
                    <Select
                        value={formData.branchId}
                        label="Филиал"
                        onChange={e => setFormData({...formData, branchId: e.target.value})}
                    >
                        {branches.map(branch => (
                            <MenuItem key={branch.id} value={branch.id}>
                                {branch.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Должность</InputLabel>
                    <Select
                        value={formData.positionId}
                        label="Должность"
                        onChange={e => setFormData({...formData, positionId: e.target.value})}
                    >
                        {positions.map(position => (
                            <MenuItem key={position.id} value={position.id}>
                                {position.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onCancel}>Отмена</Button>
                    <Button type="submit" variant="contained" color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </form>
      </Dialog>
    );
}