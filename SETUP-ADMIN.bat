@echo off
setlocal
curl -s -X POST http://localhost:5000/api/auth/ensure-admin
 echo.
echo.
echo If you see "Admin account is ready", use the credentials from backend\.env
pause
