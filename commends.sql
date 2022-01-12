
 CREATE TABLE blogs  (
    id SERIAL UNIQUE,
    author text ,
    url text NOT NULL,
    title text NOT NULL,
    likes int DEFAULT 0 
);