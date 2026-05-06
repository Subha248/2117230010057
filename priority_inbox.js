const http = require('http');

const API_URL = 'http://20.207.122.201/evaluation-service/notifications';

function fetchNotifications() {
    return new Promise((resolve, reject) => {
        const url = new URL(API_URL);
        const options = {
            hostname: url.hostname,
            path: url.pathname,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Status Code: ${res.statusCode}`));
                }
            });
        });
        req.on('error', (e) => reject(e));
        req.end();
    });
}

function processTopN(data, n = 10) {
    const notifications = data.notifications || [];
    const weights = { 'Placement': 3, 'Result': 2, 'Event': 1 };

    notifications.sort((a, b) => {
        const weightA = weights[a.Type] || 0;
        const weightB = weights[b.Type] || 0;

        if (weightA !== weightB) {
            return weightB - weightA;
        }

        const timeA = new Date(a.Timestamp).getTime();
        const timeB = new Date(b.Timestamp).getTime();
        return timeB - timeA;
    });

    return notifications.slice(0, n);
}

async function run() {
    try {
        const responseData = await fetchNotifications();
        const topNotifications = processTopN(responseData, 10);
        
        console.log("\n--- Top 10 Priority Notifications ---");
        console.log(JSON.stringify(topNotifications, null, 2));
    } catch (error) {
        console.error("Error:", error.message);
    }
}

run();
