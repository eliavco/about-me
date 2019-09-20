const path = require('path');

module.exports = {
    entry: path.join(__dirname, 'public/js'),
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'script.bundle.js'
    }
};
