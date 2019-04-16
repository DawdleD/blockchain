'use strict';
const fs = require('fs');

let unLink = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) reject(err);
            else resolve(true);
        })
    });
};

module.exports = {unLink};

