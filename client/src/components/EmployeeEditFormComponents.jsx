import { useState } from "react";
import axios from "axios";

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
        <div className="edit-form-overlay">
            <form onSubmit={handleSubmit} className="edit-form">
                <h3>Редактировать сотрудника</h3>

                <label>
                    Имя:
                    <input
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                    >
                    </input>
                </label>

                <label>
                    Дата приёма:
                    <input
                        type="date"
                        value={formData.joinDate}
                        onChange={e => setFormData({...formData, joinDate: e.target.value})}
                        required
                    />
                </label>

                <label>
                    Зарплата:
                    <input
                        type="number"
                        step="0.01"
                        value={formData.salary}
                        onChange={e => setFormData({...formData, salary: e.target.value})}
                        required
                    />
                </label>

                <label>
                    Филиал:
                    <select
                        value={formData.branchId}
                        onChange={e => setFormData({...formData, branchId: e.target.value})}
                    >
                        {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>
                                {branch.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Должность:
                    <select
                        value={formData.positionId}
                        onChange={e => setFormData({...formData, positionId: e.target.value})}
                    >
                        {positions.map(position => (
                            <option key={position.id} value={position.id}>
                                {position.name}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="form-buttons">
                    <button type="submit">Сохранить</button>
                    <button type="button" onClick={onCancel}>Отмена</button>
                </div>
            </form>
        </div>
    );
}