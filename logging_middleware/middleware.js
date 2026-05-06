const fs = require('fs');

function loggingMiddleware(req, res, next) {
    const logDetails = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
    fs.appendFile('access.log', logDetails, (err) => {
        if (err) console.error('Error writing to log file', err);
    });
    console.log(`[Request Log]: ${req.method} ${req.url}`);
    if (typeof next === 'function') {
        next();
    }
}

module.exports = loggingMiddleware;
