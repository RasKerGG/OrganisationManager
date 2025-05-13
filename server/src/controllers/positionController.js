const { Position} = require('../models');

exports.getPosition = async function (req, res) {
    try {
        const positions = await Position.findAll();
        res.json(positions);
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

exports.addPosition = async (req, res) => {
    try {
        await Position.create({
            name: req.body.name,
        });
        res.status(201).send('Запрос выполнен успешно')
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}