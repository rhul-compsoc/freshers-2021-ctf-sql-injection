DROP SCHEMA IF EXISTS capturetheflag CASCADE;
CREATE SCHEMA capturetheflag;

CREATE TABLE IF NOT EXISTS capturetheflag.users (
  username VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255) NOT NULL
);

INSERT INTO capturetheflag.users VALUES ('davewhiteland', 'tapirosaurus');
INSERT INTO capturetheflag.users VALUES ('joshuayewman', 'lttstore.com');
INSERT INTO capturetheflag.users VALUES ('leondrolio', 'PleaseDoNotHackMyAccount');

DROP USER IF EXISTS frontend;
CREATE USER frontend WITH PASSWORD 'computingsociety.co.uk';

GRANT USAGE ON SCHEMA capturetheflag TO frontend;
GRANT SELECT ON ALL TABLES IN SCHEMA capturetheflag TO frontend;
