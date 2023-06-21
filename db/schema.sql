DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    passwordhash TEXT NOT NULL,
    role role NOT NULL DEFAULT 'user',
    CONSTRAINT role CHECK (role IN ('user', 'admin'))
);

DROB TABLE IF EXISTS sessions;
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_secret TEXT NOT NULL UNIQUE,
    userid INTEGER NOT NULL,
    CONSTRAINT sessions_userid_fk FOREIGN KEY (userid) REFERENCES users(id)
);



INSERT INTO users (username, passwordhash) VALUES ('myusername', 'somehash');