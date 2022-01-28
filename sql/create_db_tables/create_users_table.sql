CREATE TABLE users (
     username text,
     password text,
     refresh text,
     email text,
     is_valid text,
     nameLastChanged text DEFAULT "0000000000000"
)