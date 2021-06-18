SELECT username,
     email
FROM users
WHERE username = ?
     OR email = ?