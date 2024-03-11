import db from './connection.js'

await db.run(
    `CREATE TABLE IF NOT EXISTS subscription (
    id INTEGER PRIMARY KEY, 
    payload_url TEXT NOT NULL UNIQUE
    );`
    );

await db.run(
    `CREATE TABLE IF NOT EXISTS event (
    id INTEGER PRIMARY KEY,
    event_type TEXT NOT NULL UNIQUE
    );`
    );

await db.run(
    `CREATE TABLE IF NOT EXISTS subscription_event (
    id INTEGER PRIMARY KEY,
    subscription_id INTEGER,
    event_id INTEGER,
    FOREIGN KEY (subscription_id) REFERENCES subscription(id),
    FOREIGN KEY (event_id) REFERENCES event(id)
    );`
    );
await db.exec('INSERT INTO event (event_type) VALUES ("test event")');
await db.exec('INSERT INTO event (event_type) VALUES ("test event 2")');

await db.close();