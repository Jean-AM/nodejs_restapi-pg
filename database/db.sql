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

-- Tabla de libros
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    publication_year INT,
    isbn VARCHAR(13) UNIQUE NOT NULL,
    pages INT,
    cover_image_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de autores
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    biography TEXT,
    birth_date DATE,
    nationality VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reseñas
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación libros-autores
CREATE TABLE book_authors (
    book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    author_id INT NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, author_id)
);

-- Tabla de relación libros-categorías
CREATE TABLE book_categories (
    book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, category_id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_authors_name ON authors(name);
CREATE INDEX idx_users_email ON users(email);

ALTER TABLE users ADD COLUMN status INT DEFAULT 1;