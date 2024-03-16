import db from './connection.js'

await db.execute(`
    DROP TABLE IF EXISTS subscription_event, subscription, event;
`);


await db.query(`
    CREATE TABLE IF NOT EXISTS subscription (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        payload_url VARCHAR(200) NOT NULL UNIQUE
    );
    
    CREATE TABLE IF NOT EXISTS event (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(60) NOT NULL UNIQUE
    );
    
    CREATE TABLE IF NOT EXISTS subscription_event (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subscription_id INT,
        event_id INT,
        FOREIGN KEY (subscription_id) REFERENCES subscription(id),
        FOREIGN KEY (event_id) REFERENCES event(id)
    );
`);

await db.query(
    `INSERT INTO event (name) VALUES ("test event");
     INSERT INTO event (name) VALUES ("test event 2");
     `);

await db.end();