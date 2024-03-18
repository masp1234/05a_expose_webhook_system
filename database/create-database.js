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
        FOREIGN KEY (subscription_id) REFERENCES subscription(id) ON DELETE CASCADE,
        FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE
    );
`);

await db.query(
    `INSERT INTO event (name) VALUES ("new product");
     INSERT INTO event (name) VALUES ("product removed");
     INSERT INTO event (name) VALUES ("product updated");
     INSERT INTO event (name) VALUES ("product back in stock");
     INSERT INTO event (name) VALUES ("product out of stock");
     INSERT INTO event (name) VALUES ("product price change");
     INSERT INTO event (name) VALUES ("product stock update");
     INSERT INTO event (name) VALUES ("product discontinued");
     INSERT INTO event (name) VALUES ("new product review");
     `);

await db.end();