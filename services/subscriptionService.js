import db from '../database/connection.js';

async function getSubscriptions() {
    const [results] = await db.query('SELECT * FROM subscription');
    return results;
}

async function getSubscriptionByPayloadUrl(payloadUrl) {
    const [result] = await db.execute('SELECT * FROM subscription WHERE payload_url = ?', [payloadUrl]);
    return result[0];
}

async function getSubscribedEventsBySubscriptionId(subscriptionId) {
    const [ results ] = await db.execute(`
        SELECT event.*
        FROM event
        JOIN subscription_event ON event.id = subscription_event.event_id
        JOIN subscription ON subscription_event.subscription_id = subscription.id
        WHERE subscription.id = ?;`, [subscriptionId]);

        return results;
}

async function createSubscription(subscription) {
    const [existingEvents] = await db.query("SELECT * FROM event");
    console.log(existingEvents);
    const eventsToAdd = existingEvents.filter((existingEvent) => {
        return subscription.events.includes(existingEvent.name);
    });

    if (eventsToAdd.length > 0) {
        console.log('Creating subscription', subscription);
        const createdSubscription = await db.execute("INSERT INTO subscription (payload_url) VALUES (?)", [subscription.payloadUrl]);

        for (const eventToAdd of eventsToAdd) {
            await db.execute("INSERT INTO subscription_event (subscription_id, event_id) VALUES (?, ?)", [createdSubscription[0].insertId, eventToAdd.id])
        }
    }
}

async function deleteSubscription(payloadUrl) {
    await db.execute("DELETE FROM subscription WHERE payload_url=?", [payloadUrl])
}

export {
    getSubscriptions,
    getSubscriptionByPayloadUrl,
    getSubscribedEventsBySubscriptionId,
    createSubscription,
    deleteSubscription
}