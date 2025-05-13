const { Branch, Position, Employee } = require("../models");

async function buildHierarchy(branches, parentId = null) {
    const tree = [];
    for (const branch of branches) {
        if (branch.parentId === parentId) {
            const children = await buildHierarchy(branches, branch.id);
            if (children.length) {
                branch.dataValues.children = children;
            }
            tree.push(branch);
        }
    }
    return tree;
}

exports.getBranches = async (req, res) => {
    try {
        const branches = await Branch.findAll();
        const hierarchicalBranches = await buildHierarchy(branches);
        res.json(hierarchicalBranches);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.deleteBranch = async (req, res) => {
    const id = req.params.id;
    try {
        await Branch.destroy({
            where: {
                id: req.params.id
            }
        })
        res.send('Филиал успешно удален')
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

exports.addBranch = async (req, res) => {
    try {

        if (req.body.parent_id) {
            const parent = await Branch.findByPk(req.body.parent_id);
            if (!parent) {
                return res.status(400).send('Родительский филиал не найден');
            }
        }

        const branch = await Branch.create({
            name: req.body.name,
            parentId: req.body.parent_id || null,
        });
        res.send(200).json(branch);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

/*exports.renderBranchesView = async (req, res) => {
    try {
        const { sortBy = 'id', order = 'ASC' } = req.query;

        const validFields = ['id', 'fullName', 'joinDate', 'salary', 'branchName', 'positionName'];
        if (!validFields.includes(sortBy)) {
            return res.status(400).send('Некорректное поле для сортировки');
        }

        const allBranches = await Branch.findAll();
        const hierarchicalBranches = await buildHierarchy(allBranches);
        const positions = await Position.findAll();

        const employees = await Employee.findAll({
            order: sortBy === 'branchName' || sortBy === 'positionName'
                ? [[{ model: sortBy === 'branchName' ? Branch : Position, as: sortBy === 'branchName' ? 'branch' : 'position' }, 'name', order]]
                : [[sortBy, order]],
            include: [
                { model: Branch, as: 'branch', attributes: ['name'] },
                { model: Position, as: 'position', attributes: ['name'] }
            ],
            raw: true
        });

        const formattedEmployees = employees.map(e => ({
            ...e,
            branchName: e['branch.name'],
            positionName: e['position.name']
        }));

        res.render('index', {
            employees: formattedEmployees,
            sortBy,
            order,
            branches: hierarchicalBranches,
            allBranches: allBranches,
            positions: positions
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
};

 */