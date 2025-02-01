CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    email VARCHAR (255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email) VALUES 
    ('John Doe', 'john@gmail.com'), 
    ('Jane Doe', 'jane@gmail.com'),
    ('Diego P.', 'diego@gmail.com');

SELECT * FROM users;