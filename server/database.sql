CREATE DATABASE RacePredictorGP;


CREATE TABLE rider (
                       rider_id SERIAL PRIMARY KEY,
                       number INT NOT NULL UNIQUE,
                       name VARCHAR(255) NOT NULL,
);