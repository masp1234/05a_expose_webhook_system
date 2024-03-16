import db from '../database/connection.js';

async function getSubscriptions() {
    const [results] = await db.query('SELECT * FROM subscription');
    return results;
}

async function getSubscriptionByPayloadUrl(payloadUrl) {
    const [result] = await db.execute('SELECT * FROM subscription WHERE payload_url = ?', [payloadUrl]);
    return result[0];
}

async function createSubscription(subscription) {
    const [existingEventTypes] = await db.query("SELECT * FROM event");
    const eventsToAdd = existingEventTypes.filter((eventToAdd) => {
        return !subscription.events.includes(eventToAdd.eventType);
    })

    if (eventsToAdd) {
        console.log('Creating subscription', subscription);
        const createdSubscription = await db.execute("INSERT INTO subscription (payload_url) VALUES (?)", [subscription.payloadUrl]);

        for (const eventToAdd of eventsToAdd) {
            await db.execute("INSERT INTO subscription_event (subscription_id, event_id) VALUES (?, ?)", [createdSubscription[0].insertId, eventToAdd.id])
        }
    }
}

export {
    getSubscriptions,
    getSubscriptionByPayloadUrl,
    createSubscription
}