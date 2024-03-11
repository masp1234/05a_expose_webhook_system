import db from '../database/connection.js';

async function getSubscriptions() {
    return await db.all("SELECT * FROM subscription")
}

async function getSubscriptionByPayloadUrl(payloadUrl) {
    return await db.get('SELECT * FROM subscription WHERE payload_url = ?', payloadUrl);
}

async function createSubscription(subscription) {
    const existingEventTypes = await db.all("SELECT * FROM event");
    const eventsToAdd = existingEventTypes.filter((eventToAdd) => {
        return !subscription.events.includes(eventToAdd.eventType);
    })

    if (eventsToAdd) {
        console.log('Creating subscription', subscription);
        const subscriptionStmt = await db.prepare("INSERT INTO subscription (payload_url) VALUES (?)");
        const result = await subscriptionStmt.run(subscription.payloadUrl);
        const subscriptionEventsStmt = await db.prepare("INSERT INTO subscription_event (subscription_id, event_id) VALUES (?, ?)");

        for (const eventToAdd of eventsToAdd) {
            await subscriptionEventsStmt.run([result.lastID, eventToAdd.id]);
        }
        await subscriptionStmt.finalize();
    }
}

export {
    getSubscriptions,
    getSubscriptionByPayloadUrl,
    createSubscription
}