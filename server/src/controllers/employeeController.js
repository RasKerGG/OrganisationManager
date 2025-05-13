const { Employee, Branch, Position} = require("../models");
const {Op, Sequelize} = require("sequelize");

exports.getEmployees = async (req, res) => {
    try {

        const { sortBy = 'id', order = 'ASC', branchId} = req.query;
        const validFields = ['id', 'fullName', 'joinDate', 'salary', 'branchId', 'positionId'];

        if (!validFields.includes(sortBy)) {
            return res.status(400).json({ error: 'Invalid sort field' });
        }

        const whereCondition = {};
        if (branchId) {
            whereCondition.branchId = {
                [Op.in]: Array.isArray(branchId) ? branchId : [branchId]
            };
        }

        const employees = await Employee.findAll({
            include: [
                {
                    model: Branch,
                    as: 'branch',
                    attributes: ['name'],
                    where: branchId ? {} : undefined
                },

                {
                    model: Position,
                    as: 'position',
                    attributes: ['name']
                }
            ],
            where: whereCondition,
            order: [[sortBy, order]],
            raw: true,
            nest: true
        });

        res.json(employees);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.addEmployee = async (req, res) => {
    try {
        const employee = await Employee.create({
            fullName: req.body.fullName,
            joinDate: req.body.joinDate,
            branchId: req.body.branchId,
            positionId: req.body.positionId,
            salary: req.body.salary,
        });
        res.status(200).json(employee);
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

exports.deleteEmployee = async (req, res) => {
    try {
        await Employee.destroy({
            where: {
                id: req.params.id
            }
        })
        res.send('Сотрудник удален успешно')
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

exports.getCertificate = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            where: {
                salary: {
                    [Op.lt]: 30000
                },
                join_date: {
                    [Op.lt]: Sequelize.literal(`CURRENT_DATE - INTERVAL '3 years'`)
                }
            },
            include: [
                { model: Position, as: 'position', attributes: ['name'] }
            ],
            raw: true
        });

        const formattedEmployees = employees.map(e => ({
            ...e,
            positionName: e['position.name']
        }));

        res.json(formattedEmployees);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.editEmployee = async (req, res) => {
    try {
        const { id, fullName, joinDate, branchId, positionId, salary } = req.body;

        if (!id) {
            return res.status(400).send({ message: "ID сотрудника обязателен" });
        }

        const employee = await Employee.findOne({ where: { id } });

        if (!employee) {
            return res.status(404).send({ message: "Сотрудник не найден" });
        }

        const updatedEmployee = await employee.update({
            fullName,
            joinDate,
            branchId,
            positionId,
            salary
        });

        res.status(200).send(updatedEmployee);
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error", error: err.message });
    }
};

// exports.renderEmployee = async (req, res) => {
//     try {
//         const { sortBy = 'id', order = 'ASC' } = req.query;
//         const validFields = ['id', 'fullName', 'joinDate', 'salary', 'branchName', 'positionName'];
//
//         if (!validFields.includes(sortBy)) {
//             return res.status(400).send('Некорректное поле');
//         }
//
//         let orderOption;
//         if (sortBy === 'branchName') {
//             orderOption = [[{ model: Branch, as: 'branch' }, 'name', order]];
//         } else if (sortBy === 'positionName') {
//             orderOption = [[{ model: Position, as: 'position' }, 'name', order]];
//         } else {
//             orderOption = [[sortBy, order]];
//         }
//
//         const employees = await Employee.findAll({
//             order: orderOption,
//             include: [
//                 { model: Branch, as: 'branch', attributes: ['name'] },
//                 { model: Position, as: 'position', attributes: ['name'] }
//             ],
//             raw: true
//         });
//
//         const formattedEmployees = employees.map(e => ({
//             ...e,
//             branchName: e['branch.name'],
//             positionName: e['position.name']
//         }));
//
//         res.render('employees', {
//             employees: formattedEmployees,
//             sortBy,
//             order
//         });
//
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// };
