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