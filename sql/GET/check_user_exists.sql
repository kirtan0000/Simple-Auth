SELECT username,
     email,
     is_valid
FROM users
WHERE username = ?
     OR email = ?