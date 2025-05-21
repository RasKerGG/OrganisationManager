const { Employee, Branch, Position} = require("../models");
const {Op, Sequelize} = require("sequelize");

const operatorMap = {
    eq: Op.eq,
    ne: Op.ne,
    lt: Op.lt,
    lte: Op.lte,
    gt: Op.gt,
    gte: Op.gte,
    between: Op.between,
    iLike: Op.iLike,
    notLike: Op.notLike,
    startsWith: Op.startsWith,
    endsWith: Op.endsWith
};


exports.getEmployees = async (req, res) => {
    try {
        const { startRow = 0, endRow = 10, sortModel = [], filterModel = {} } = req.body;

        const whereCondition = {};
        if (filterModel.branchId) {
            filterModel.branchId = {
                [Op.eq]: parseInt(filterModel.branchId)
            };
        }
        Object.entries(filterModel).forEach(([field, conditions]) => {
            const fieldConditions = {};
            for (const [operator, value] of Object.entries(conditions)) {
                const sequelizeOp = operatorMap[operator];
                if (sequelizeOp) {
                    fieldConditions[sequelizeOp] = value;
                }
            }
            whereCondition[field] = fieldConditions;
        });

        const order = sortModel.map(sort => {
            if (sort.colId === 'branchName') {
                return [{ model: Branch, as: 'branch' }, 'name', sort.sort.toUpperCase()];
            }
            if (sort.colId === 'positionName') {
                return [{ model: Position, as: 'position' }, 'name', sort.sort.toUpperCase()];
            }
            return [sort.colId, sort.sort.toUpperCase()];
        });

        const { count, rows } = await Employee.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: Position,
                    as: 'position',
                    attributes: ['name']
                },
                {
                    model: Branch,
                    as: 'branch',
                    attributes: ['name']
                }
            ],
            order: order,
            raw: true,
            nest: true,
            limit: endRow - startRow,
            offset: startRow
        });

        const formatted = rows.map(e => ({
            ...e,
            positionName: e.position.name,
            branchName: e.branch.name
        }));

        res.json({ rows: formatted, lastRow: count });
    } catch (error) {
        res.status(500).send(error.message);
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
        const { startRow = 0, endRow = 10, sortModel = [], filterModel = {} } = req.body;

        const whereCondition = {};
        Object.entries(filterModel).forEach(([field, conditions]) => {
            const fieldConditions = {};
            for (const [operator, value] of Object.entries(conditions)) {
                const sequelizeOp = operatorMap[operator];
                if (sequelizeOp) {
                    fieldConditions[sequelizeOp] = value;
                }
            }
            whereCondition[field] = fieldConditions;
        });

        const order = sortModel.map(sort => [
            sort.colId === 'branchName' ? { model: Branch, as: 'branch' } :
                sort.colId === 'positionName' ? { model: Position, as: 'position' } :
                    sort.colId,
            sort.sort.toUpperCase()
        ]);

        const { count, rows } = await Employee.findAndCountAll({
            where: {
                [Op.and]: [
                    whereCondition,
                    {
                        salary: { [Op.lt]: 30000 },
                        join_date: {
                            [Op.lt]: Sequelize.literal(`CURRENT_DATE - INTERVAL '3 years'`)
                        }
                    }
                ]
            },
            include: [
                {
                    model: Position,
                    as: 'position',
                    attributes: ['name']
                },
                {
                    model: Branch,
                    as: 'branch',
                    attributes: ['name']
                }
            ],
            order: order,
            raw: true,
            nest: true,
            limit: endRow - startRow,
            offset: startRow
        });

        const formatted = rows.map(e => ({
            ...e,
            positionName: e.position.name,
            branchName: e.branch.name
        }));

        res.json({ rows: formatted, lastRow: count });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id)
        res.json(employee)
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
};

exports.editEmployee = async (req, res) => {
    try {
        const id = req.params.id;
        const {fullName, joinDate, branchId, positionId, salary } = req.body;

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