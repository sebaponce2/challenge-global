CREATE TABLE status (
    id SERIAL PRIMARY KEY,
    value TEXT NOT NULL
);

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    status_id INTEGER REFERENCES status (id),
    name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    date_of_birth TIMESTAMP,
    phone VARCHAR(20),
    photo VARCHAR(255),
    last_seen TIMESTAMP
);

CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    first_user INTEGER REFERENCES profiles (id),
    second_user INTEGER REFERENCES profiles (id)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER REFERENCES chats (id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES profiles (id),
    content TEXT NOT NULL,
    time TIMESTAMP NOT NULL
);

INSERT INTO status (id, value) VALUES 
(1, 'Online'), 
(2, 'Offline');

INSERT INTO profiles (status_id, name, last_name, email, date_of_birth, phone, photo, last_seen) VALUES
(1, 'Walter', 'Olmos', 'walter.olmos@gmail.com', NOW(), '123456789', NULL, NOW()),
(2, 'John', 'Gonzales', 'john.gonzales@gmail.com', NOW(), '123456780', NULL, NOW()),
(1, 'Maria', 'Lopez', 'maria.lopez@gmail.com', NOW(), '123456781', NULL, NOW()),
(2, 'Peter', 'Sanchez', 'peter.sanchez@gmail.com', NOW(), '123456782', NULL, NOW());

INSERT INTO chats (first_user, second_user) VALUES
(1,2),
(1,3),
(1,4);

INSERT INTO messages (chat_id, sender_id, content, time) VALUES
(1, 2, 'Hey, how are you?', '2025-01-26 10:00:00'),
(1, 1, 'Im good, thanks! How about you?', '2025-01-26 10:05:00'),
(2, 3, 'Do you want to go out tonight?', '2025-01-25 19:00:00'),
(2, 1, 'Sure, where do you want to go?', '2025-01-25 19:05:00'),
(3, 4, 'Hello my friend!', '2025-01-26 12:03:00'),
(3, 1, 'Hi mate, how are you?', '2025-01-26 14:05:00'),
(3, 4, 'Ill be late for the meeting', '2025-01-26 17:05:00');