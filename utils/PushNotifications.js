
const { Expo } = require('expo-server-sdk');

const Notifications = async (pushToken, title, body) => {

    // Create an instance of Expo
    let expo = new Expo();

    // Validate push token
    if (!Expo.isExpoPushToken(pushToken)) {
        return res.status(400).json({ error: 'Invalid Expo push token' });
    }

    // Construct the message
    let message = {
        to: pushToken,
        sound: 'default',
        title: title,
        body: body,
        data: { someData: 'example' },
    };

    // Chunk the notifications if sending multiple at once
    let chunks = expo.chunkPushNotifications([message]);

    try {
        let tickets = [];
        for (let chunk of chunks) {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        }

        return { success: true, tickets }
    } catch (error) {

        return { success: false, error: 'Failed to send notification' }
    }
};

module.exports = Notifications;
