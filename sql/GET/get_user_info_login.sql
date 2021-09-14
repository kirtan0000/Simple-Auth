  
SELECT 
     password,
     refresh,
     is_valid
from users
WHERE email = ?