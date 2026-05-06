const fs = require('fs');

function fetchNotificationsLocal() {
    return new Promise((resolve, reject) => {
        fs.readFile('notifications_data.json', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

function processTopN(data, n = 10) {
    const notifications = data.notifications || [];
    const weights = {
        'Placement': 3,
        'Result': 2,
        'Event': 1
    };

    notifications.sort((a, b) => {
        const weightA = weights[a.Type] || 0;
        const weightB = weights[b.Type] || 0;

        if (weightA !== weightB) {
            return weightB - weightA; // Higher weights first
        }

        const timeA = new Date(a.Timestamp).getTime();
        const timeB = new Date(b.Timestamp).getTime();
        return timeB - timeA; // Most recent first
    });

    return notifications.slice(0, n);
}

async function run() {
    try {
        console.log("Fetching notifications locally...");
        const responseData = await fetchNotificationsLocal();
        const topNotifications = processTopN(responseData, 10);

        console.log("\n--- Top 10 Priority Notifications ---");
        console.log(JSON.stringify(topNotifications, null, 2));
    } catch (error) {
        console.error("Error processing notifications:", error.message);
    }
}

run();
