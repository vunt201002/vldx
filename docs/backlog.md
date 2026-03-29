# Backlog

Security and infrastructure improvements identified during audit. Not blocking current deployment.

---

## BL-001: Change Password Endpoint

**Priority**: Medium
**Area**: Security / Admin UX

### Problem
Admin users have no way to change their password from the UI. The only way to reset a password is to run `npm run seed:admin` again from the server, which is impractical.

### What to build
- `PUT /api/auth/password` — requires current password + new password
- Admin UI: "Change Password" form in settings or profile page
- Validate: current password correct, new password min length

### Notes
- Use `bcrypt.compare` to verify current password before allowing change
- Return 401 if current password is wrong (not 400 — avoids leaking account existence)
- No email reset flow needed yet; this is a single-admin system

---

## BL-002: Security / Audit Logging

**Priority**: Low
**Area**: Security / Observability

### Problem
No audit trail for:
- Login attempts (successful and failed)
- Who changed what data and when

### What to build
- Log failed login attempts (email, IP, timestamp) to MongoDB or a log file
- Log successful logins (email, IP, timestamp)
- Optionally: log write operations (create/update/delete) with user + resource

### Notes
- Start with login logging only — highest value, lowest effort
- Can use a simple `AuditLog` MongoDB collection or write to a structured log file
- Do not log passwords or tokens — only email + IP + outcome

---

## BL-003: Rate Limiting on Login Endpoint

**Priority**: Low
**Area**: Security

### Problem
`express-rate-limit` is applied globally, but the login endpoint (`POST /api/auth/login`) should have a stricter limit to prevent brute-force attacks.

### What to build
- Separate rate limiter for `/api/auth/login`: e.g., 10 attempts per 15 minutes per IP
- Return `429 Too Many Requests` with `Retry-After` header when exceeded
- Existing global rate limit (`windowMs: 15min, max: 100`) stays in place for everything else

### Notes
- `app.set('trust proxy', 1)` is already in place — IP detection will work correctly
- Consider adding a short lockout (e.g., 1 hour) after 20 failed attempts if BL-002 is also implemented

---

## BL-004: HTTPS / SSL Setup

**Priority**: Medium
**Area**: Infrastructure
**Blocked by**: Domain name acquisition

### Problem
The VPS currently serves traffic over HTTP. All data (including the admin JWT token and login credentials) is transmitted in plaintext.

### What to build
- Obtain a domain name and point it to the VPS IP (`160.250.187.138`)
- Install nginx as a reverse proxy in front of the Docker Compose stack
- Use Let's Encrypt (Certbot) to provision a free TLS certificate
- Redirect HTTP → HTTPS
- Update `CORS_ORIGIN`, `FRONTEND_URL`, `ADMIN_URL` env vars to use `https://`

### Notes
- Docker Compose ports 3000/8888/5000 should NOT be exposed publicly after nginx is in place — bind to `127.0.0.1` only
- Certbot auto-renewal should be set up as a cron job
- This is a hard prerequisite before sharing the admin URL with any external user

### Rough steps
1. Buy domain, add A record → VPS IP
2. Install nginx on VPS host (not inside Docker)
3. Configure nginx upstream blocks for frontend (3000), admin (8888)
4. Run `certbot --nginx -d yourdomain.com -d admin.yourdomain.com`
5. Rebuild frontend/admin Docker images with `https://` URLs
6. Test and verify `HSTS` header is present

---

*Created: 2026-03-29*
