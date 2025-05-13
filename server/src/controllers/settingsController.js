/*
const { Op } = require('sequelize');

exports.renderSettingsPage = (req, res) => {
    const currentSettings = req.session.settings || {
        font: 'Arial',
        theme: 'light',
        primaryColor: '#007bff'
    };

    res.render('settings', {
        availableFonts: ['Arial', 'Helvetica', 'Times New Roman', 'Verdana'],
        colorThemes: ['light', 'dark', 'blue'],
        currentSettings
    });
};

exports.saveSettings = (req, res) => {
    req.session.settings = {
        font: req.body.font,
        theme: req.body.theme,
        primaryColor: req.body.primaryColor
    };
    res.locals.currentSettings = req.session.settings;
    res.redirect('/');
};
*/
