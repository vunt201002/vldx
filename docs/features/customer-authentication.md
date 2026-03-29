# Customer Authentication Implementation Plan

## Overview

Implement a complete customer authentication system for the VLXD e-commerce platform, enabling customers to register, log in with email/password, and authenticate via Google OAuth 2.0. This feature will support future e-commerce functionality including order tracking, wishlists, and personalized experiences.

## Requirements

### Functional Requirements
- Customer registration with email and password
- Customer login with email/password credentials
- Google OAuth 2.0 login (Sign in with Google)
- JWT-based authentication with access and refresh tokens
- Password reset functionality via email
- Email verification for new registrations
- Protected routes requiring authentication
- User profile management (view/update profile)
- Session management (logout, logout all devices)
- Remember me functionality

### Non-Functional Requirements
- Passwords must be hashed using bcrypt (minimum 10 rounds)
- JWT tokens must expire (access: 15min, refresh: 7 days)
- HTTPS required for production
- CORS configured for frontend domain only
- Rate limiting on auth endpoints (5 attempts per 15min for login)
- GDPR-compliant data handling
- Mobile-responsive login/signup UI
- Accessible forms (WCAG 2.1 AA)

## Architecture

### Components Affected

**Backend:**
- New `Customer` model (`backend/src/models/Customer.ts`)
- New auth routes (`backend/src/routes/authRoutes.ts`)
- New auth controller (`backend/src/controllers/authController.ts`)
- New auth middleware (`backend/src/middleware/auth.ts`)
- New auth service layer (`backend/src/services/authService.ts`)
- New JWT utility (`backend/src/utils/jwt.ts`)
- Updated environment config (`backend/src/config/env.ts`)
- Enhanced rate limiter for auth endpoints

**Frontend:**
- New auth context (`frontend/lib/AuthContext.js`)
- New auth pages:
  - `frontend/pages/login.js`
  - `frontend/pages/register.js`
  - `frontend/pages/forgot-password.js`
  - `frontend/pages/reset-password.js`
  - `frontend/pages/verify-email.js`
- New auth components:
  - `frontend/components/auth/LoginForm.js`
  - `frontend/components/auth/RegisterForm.js`
  - `frontend/components/auth/GoogleLoginButton.js`
  - `frontend/components/auth/ProtectedRoute.js`
- New auth hooks:
  - `frontend/hooks/useAuth.js`
- Updated navbar with login/profile dropdown
- Updated API client to include auth headers
- Profile page (`frontend/pages/profile.js`)

**Admin:**
- Customer list view (`admin/src/pages/Customers.jsx`)
- Customer detail view (`admin/src/pages/CustomerDetail.jsx`)

### Data Flow

```
Registration Flow:
Browser → POST /api/auth/register → Controller validates →
Hash password (bcrypt) → Save to MongoDB → Send verification email →
Return success message

Login Flow (Email/Password):
Browser → POST /api/auth/login → Controller validates credentials →
Check password (bcrypt.compare) → Generate JWT tokens →
Return tokens + user data → Store in localStorage/cookie

Login Flow (Google OAuth):
Browser → Redirect to Google → User authorizes →
Google redirects to callback → Backend verifies token →
Find/create customer → Generate JWT tokens →
Redirect to frontend with tokens

Protected Request:
Browser → GET /api/customer/profile (with Authorization header) →
Auth middleware validates JWT → Decode user ID →
Controller fetches user data → Return response

Token Refresh:
Browser → POST /api/auth/refresh (with refresh token) →
Validate refresh token → Generate new access token →
Return new access token
```

### Dependencies

**New npm packages (Backend):**
```json
{
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "google-auth-library": "^9.14.1",
  "nodemailer": "^6.9.16",
  "validator": "^13.12.0"
}
```

**New npm packages (Backend DevDependencies):**
```json
{
  "@types/bcryptjs": "^2.4.6",
  "@types/jsonwebtoken": "^9.0.7",
  "@types/nodemailer": "^6.4.16",
  "@types/validator": "^13.12.2"
}
```

**Frontend:** No new dependencies required (use native fetch)

## Implementation Steps

### Phase 1: Backend Foundation (Days 1-2)

#### 1.1 Install Dependencies
```bash
cd backend
npm install bcryptjs jsonwebtoken google-auth-library nodemailer validator
npm install -D @types/bcryptjs @types/jsonwebtoken @types/nodemailer @types/validator
```

#### 1.2 Update Environment Configuration
Add to `backend/.env`:
```env
# JWT Configuration
JWT_SECRET=your_strong_jwt_secret_here_min_32_chars
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email Configuration (using Gmail SMTP for dev)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@vlxd.com
```

Update `backend/src/config/env.ts`:
```typescript
export const config = {
  // ... existing config
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
  jwtAccessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || '',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpUser: process.env.SMTP_USER || '',
  smtpPassword: process.env.SMTP_PASSWORD || '',
  emailFrom: process.env.EMAIL_FROM || '',
};
```

#### 1.3 Create Customer Model
File: `backend/src/models/Customer.ts`

Fields:
- `email` (string, unique, required, lowercase, validated)
- `password` (string, required for local auth, hashed)
- `firstName` (string, required)
- `lastName` (string, required)
- `phone` (string, optional)
- `googleId` (string, optional, unique, for OAuth users)
- `profilePicture` (string, optional, URL)
- `isEmailVerified` (boolean, default: false)
- `emailVerificationToken` (string, optional)
- `emailVerificationExpires` (Date, optional)
- `passwordResetToken` (string, optional)
- `passwordResetExpires` (Date, optional)
- `refreshTokens` (array of strings, for multi-device support)
- `lastLoginAt` (Date, optional)
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)

Indexes:
- `email` (unique)
- `googleId` (unique, sparse)
- `emailVerificationToken` (sparse)
- `passwordResetToken` (sparse)

Methods:
- `comparePassword(candidatePassword: string): Promise<boolean>`
- `generateVerificationToken(): string`
- `generatePasswordResetToken(): string`

Pre-save hook: Hash password if modified

#### 1.4 Create JWT Utility
File: `backend/src/utils/jwt.ts`

Functions:
- `generateAccessToken(userId: string): string`
- `generateRefreshToken(userId: string): string`
- `verifyAccessToken(token: string): { userId: string }`
- `verifyRefreshToken(token: string): { userId: string }`
- `generateTokenPair(userId: string): { accessToken: string, refreshToken: string }`

#### 1.5 Create Auth Middleware
File: `backend/src/middleware/auth.ts`

Middleware functions:
- `authenticate`: Verify JWT from Authorization header, attach user to req.user
- `optionalAuth`: Same as authenticate but doesn't fail if no token
- `requireEmailVerified`: Check if user's email is verified

Error handling:
- Return 401 for invalid/missing tokens
- Return 403 for unverified emails

#### 1.6 Create Email Service
File: `backend/src/services/emailService.ts`

Functions:
- `sendVerificationEmail(email: string, token: string, name: string): Promise<void>`
- `sendPasswordResetEmail(email: string, token: string, name: string): Promise<void>`
- `sendWelcomeEmail(email: string, name: string): Promise<void>`

Use nodemailer with templates (HTML + text fallback)

### Phase 2: Backend Auth Logic (Days 3-4)

#### 2.1 Create Auth Service Layer
File: `backend/src/services/authService.ts`

Functions:
- `registerWithEmail(email, password, firstName, lastName): Promise<Customer>`
- `loginWithEmail(email, password): Promise<{ customer, accessToken, refreshToken }>`
- `loginWithGoogle(googleIdToken): Promise<{ customer, accessToken, refreshToken }>`
- `verifyEmail(token): Promise<Customer>`
- `requestPasswordReset(email): Promise<void>`
- `resetPassword(token, newPassword): Promise<void>`
- `refreshAccessToken(refreshToken): Promise<{ accessToken }>`
- `logout(userId, refreshToken): Promise<void>`
- `logoutAllDevices(userId): Promise<void>`

Business logic:
- Validate email format using `validator`
- Enforce password strength (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
- Check for existing users
- Generate verification tokens
- Handle Google OAuth token verification
- Update refresh token arrays

#### 2.2 Create Auth Controller
File: `backend/src/controllers/authController.ts`

Endpoints:
- `POST /register`: Register new customer
- `POST /login`: Login with email/password
- `POST /google`: Login with Google (exchange ID token)
- `GET /google/callback`: OAuth callback (redirect flow)
- `POST /verify-email`: Verify email with token
- `POST /resend-verification`: Resend verification email
- `POST /forgot-password`: Request password reset
- `POST /reset-password`: Reset password with token
- `POST /refresh`: Refresh access token
- `POST /logout`: Logout (invalidate refresh token)
- `POST /logout-all`: Logout all devices
- `GET /me`: Get current user profile (protected)
- `PUT /me`: Update current user profile (protected)
- `PUT /change-password`: Change password (protected)

Response format (consistent):
```json
{
  "success": true,
  "data": {
    "customer": { "id": "...", "email": "...", "firstName": "..." },
    "accessToken": "...",
    "refreshToken": "..."
  },
  "message": "Login successful"
}
```

#### 2.3 Create Auth Routes
File: `backend/src/routes/authRoutes.ts`

Mount all auth controller endpoints with:
- Rate limiting (stricter for login/register)
- Input validation middleware
- Appropriate auth middleware for protected routes

#### 2.4 Update Rate Limiter
File: `backend/src/middleware/rateLimiter.ts`

Create additional rate limiters:
- `authLimiter`: 5 requests per 15min for login/register
- `passwordResetLimiter`: 3 requests per hour for password reset

#### 2.5 Register Auth Routes
File: `backend/src/routes/index.ts`

```typescript
import authRoutes from './authRoutes';
router.use('/auth', authRoutes);
```

#### 2.6 Create Customer Controller (Admin)
File: `backend/src/controllers/customerController.ts`

Endpoints (for admin use):
- `GET /`: List all customers (paginated)
- `GET /:id`: Get customer by ID
- `PUT /:id`: Update customer (admin)
- `DELETE /:id`: Delete customer (admin)

File: `backend/src/routes/customerRoutes.ts`
File: `backend/src/routes/index.ts` (register `/customers`)

### Phase 3: Frontend Auth Context & Hooks (Days 5-6)

#### 3.1 Create Auth Context
File: `frontend/lib/AuthContext.js`

Context provides:
```javascript
{
  user: { id, email, firstName, lastName, profilePicture, isEmailVerified },
  isAuthenticated: boolean,
  isLoading: boolean,
  login: (email, password) => Promise<void>,
  loginWithGoogle: (googleIdToken) => Promise<void>,
  register: (email, password, firstName, lastName) => Promise<void>,
  logout: () => Promise<void>,
  updateProfile: (data) => Promise<void>,
  refreshToken: () => Promise<void>
}
```

Implementation:
- Store tokens in localStorage (accessToken) and httpOnly cookie (refreshToken - requires backend update)
- Auto-refresh access token 1 minute before expiry
- Fetch user profile on mount if token exists
- Clear tokens on logout
- Provide loading states

#### 3.2 Update API Client
File: `frontend/lib/api.js`

Enhancements:
- Add `Authorization: Bearer ${accessToken}` header to authenticated requests
- Intercept 401 responses, attempt token refresh, retry original request
- If refresh fails, logout user and redirect to login
- Add auth-specific functions:
  - `login(email, password)`
  - `register(email, password, firstName, lastName)`
  - `loginWithGoogle(googleIdToken)`
  - `logout()`
  - `refreshToken()`
  - `getProfile()`
  - `updateProfile(data)`
  - `changePassword(oldPassword, newPassword)`
  - `verifyEmail(token)`
  - `requestPasswordReset(email)`
  - `resetPassword(token, newPassword)`

#### 3.3 Create useAuth Hook
File: `frontend/hooks/useAuth.js`

```javascript
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

#### 3.4 Create ProtectedRoute Component
File: `frontend/components/auth/ProtectedRoute.js`

```javascript
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) {
    router.push('/login?redirect=' + router.asPath);
    return null;
  }

  return children;
}
```

#### 3.5 Update _app.js
File: `frontend/pages/_app.js`

Wrap app with AuthProvider:
```javascript
import { AuthProvider } from '@/lib/AuthContext';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
```

### Phase 4: Frontend UI Components (Days 7-8)

#### 4.1 Create Login Page
File: `frontend/pages/login.js`

Features:
- Email/password form with validation
- "Sign in with Google" button
- "Forgot password?" link
- "Don't have an account? Register" link
- Remember me checkbox
- Error messages (invalid credentials, etc.)
- Redirect to `?redirect` param after login (default: `/profile`)
- Show loading state during submission

Design:
- Centered card layout
- Mobile responsive
- Accessible labels and error announcements
- Use Tailwind CSS (consistent with existing pages)

#### 4.2 Create Register Page
File: `frontend/pages/register.js`

Features:
- Email, password, confirm password, firstName, lastName fields
- Password strength indicator
- "Sign up with Google" button
- "Already have an account? Login" link
- Terms of service checkbox
- Email verification notice after successful registration
- Client-side validation (email format, password match, password strength)

#### 4.3 Create Google Login Button Component
File: `frontend/components/auth/GoogleLoginButton.js`

Implementation:
- Load Google Identity Services library
- Render Google One Tap or button
- On success, exchange credential for our JWT tokens
- Handle errors gracefully

Include Google script in _document.js or load dynamically

#### 4.4 Create Login/Register Forms
File: `frontend/components/auth/LoginForm.js`
File: `frontend/components/auth/RegisterForm.js`

Extract form logic from pages for reusability
Include inline validation and error handling

#### 4.5 Create Password Reset Pages
File: `frontend/pages/forgot-password.js`
- Email input form
- Submit sends reset email
- Show success message with instructions

File: `frontend/pages/reset-password.js`
- Extract token from URL query param
- New password + confirm password fields
- Submit resets password
- Redirect to login on success

#### 4.6 Create Email Verification Page
File: `frontend/pages/verify-email.js`
- Extract token from URL query param
- Auto-verify on load
- Show success/error message
- Redirect to profile or show "Resend verification" button

#### 4.7 Create Profile Page
File: `frontend/pages/profile.js`

Sections:
- Profile information (firstName, lastName, email, phone, profile picture)
- Edit profile form
- Change password form
- Logout button
- Logout all devices button
- Account deletion (future)

Use ProtectedRoute wrapper

#### 4.8 Update Navbar
File: `frontend/components/sections/Navbar.js`

Add auth UI:
- If not authenticated: "Login" | "Register" buttons
- If authenticated: Profile dropdown with:
  - "Hi, {firstName}"
  - Profile picture (if set)
  - "My Profile" link
  - "Logout" button

### Phase 5: Admin Customer Management (Day 9)

#### 5.1 Create Customers List Page
File: `admin/src/pages/Customers.jsx`

Features:
- Paginated table of customers
- Columns: Name, Email, Verified, Last Login, Created At
- Search by email/name
- Filter by verified status
- Click row to view details

#### 5.2 Create Customer Detail Page
File: `admin/src/pages/CustomerDetail.jsx`

Features:
- View full customer details
- Edit customer info (admin override)
- View order history (future)
- Delete customer (with confirmation)
- Manually verify email

#### 5.3 Update Admin Navigation
File: `admin/src/layout/AdminLayout.jsx`

Add "Customers" menu item

#### 5.4 Register Admin Routes
File: `admin/src/App.jsx`

```jsx
<Route path="customers" element={<Customers />} />
<Route path="customers/:id" element={<CustomerDetail />} />
```

### Phase 6: Testing & Security (Day 10)

#### 6.1 Backend Testing
Create test files:
- `backend/src/__tests__/auth.test.ts`
- `backend/src/__tests__/customer.test.ts`

Test cases:
- Registration with valid data succeeds
- Registration with duplicate email fails
- Login with correct credentials succeeds
- Login with incorrect password fails
- JWT token validation works
- Token refresh works
- Password reset flow works
- Email verification works
- Google OAuth flow works (mock Google API)
- Rate limiting triggers correctly
- Protected routes reject unauthenticated requests

#### 6.2 Frontend Testing
Manual testing checklist:
- [ ] Register new account
- [ ] Receive verification email
- [ ] Verify email via link
- [ ] Login with email/password
- [ ] Login with Google
- [ ] Access protected profile page
- [ ] Update profile information
- [ ] Change password
- [ ] Logout
- [ ] Forgot password flow
- [ ] Reset password
- [ ] Token auto-refresh works
- [ ] Expired token logs user out
- [ ] Protected routes redirect to login
- [ ] Login redirects back to intended page

#### 6.3 Security Audit
- [ ] Passwords hashed with bcrypt (10+ rounds)
- [ ] JWT secrets are strong (32+ chars)
- [ ] Tokens expire appropriately
- [ ] Rate limiting prevents brute force
- [ ] CORS restricts to frontend domain only
- [ ] SQL injection not possible (using Mongoose)
- [ ] XSS prevented (React escapes by default)
- [ ] CSRF protection (SameSite cookies for refresh tokens)
- [ ] Email verification required for sensitive actions
- [ ] Google OAuth state parameter used
- [ ] HTTPS enforced in production
- [ ] Sensitive data not logged
- [ ] Error messages don't leak information

#### 6.4 Performance Testing
- [ ] Login response < 500ms
- [ ] Registration response < 1s
- [ ] Token refresh < 200ms
- [ ] Protected route overhead < 50ms
- [ ] Database indexes on email, googleId working

## API Changes

### New Endpoints

#### Public Endpoints

**POST /api/auth/register**
```json
Request:
{
  "email": "customer@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "customer": {
      "id": "...",
      "email": "customer@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isEmailVerified": false
    }
  }
}
```

**POST /api/auth/login**
```json
Request:
{
  "email": "customer@example.com",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "customer": {
      "id": "...",
      "email": "customer@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isEmailVerified": true,
      "profilePicture": null
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login successful"
}

Errors: 401 (invalid credentials), 403 (email not verified)
```

**POST /api/auth/google**
```json
Request:
{
  "idToken": "google_id_token_here"
}

Response: 200 OK (same as login)
```

**POST /api/auth/verify-email**
```json
Request:
{
  "token": "verification_token_from_email"
}

Response: 200 OK
{
  "success": true,
  "message": "Email verified successfully"
}
```

**POST /api/auth/forgot-password**
```json
Request:
{
  "email": "customer@example.com"
}

Response: 200 OK
{
  "success": true,
  "message": "If an account exists, a password reset link has been sent"
}
```

**POST /api/auth/reset-password**
```json
Request:
{
  "token": "reset_token_from_email",
  "password": "NewSecurePass123"
}

Response: 200 OK
{
  "success": true,
  "message": "Password reset successful"
}
```

**POST /api/auth/refresh**
```json
Request:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response: 200 OK
{
  "success": true,
  "data": {
    "accessToken": "new_access_token_here"
  }
}

Errors: 401 (invalid refresh token)
```

#### Protected Endpoints (require Authorization header)

**GET /api/auth/me**
```json
Response: 200 OK
{
  "success": true,
  "data": {
    "id": "...",
    "email": "customer@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "profilePicture": "https://...",
    "isEmailVerified": true,
    "createdAt": "2024-03-25T10:00:00Z",
    "lastLoginAt": "2024-03-25T12:00:00Z"
  }
}
```

**PUT /api/auth/me**
```json
Request:
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567890"
}

Response: 200 OK
{
  "success": true,
  "data": { /* updated customer */ },
  "message": "Profile updated successfully"
}
```

**PUT /api/auth/change-password**
```json
Request:
{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass123"
}

Response: 200 OK
{
  "success": true,
  "message": "Password changed successfully"
}

Errors: 401 (incorrect current password)
```

**POST /api/auth/logout**
```json
Request:
{
  "refreshToken": "token_to_invalidate"
}

Response: 200 OK
{
  "success": true,
  "message": "Logged out successfully"
}
```

**POST /api/auth/logout-all**
```json
Response: 200 OK
{
  "success": true,
  "message": "Logged out from all devices"
}
```

#### Admin Endpoints

**GET /api/customers**
```json
Query params: ?page=1&limit=20&search=john&verified=true

Response: 200 OK
{
  "success": true,
  "data": [ /* array of customers */ ],
  "total": 150,
  "page": 1,
  "totalPages": 8
}
```

**GET /api/customers/:id**
**PUT /api/customers/:id**
**DELETE /api/customers/:id**

## Database Changes

### New Collection: `customers`

Schema (Mongoose):
```typescript
{
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false }, // not returned by default
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  googleId: { type: String, unique: true, sparse: true },
  profilePicture: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, select: false },
  emailVerificationExpires: { type: Date, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  refreshTokens: [{ type: String, select: false }],
  lastLoginAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

Indexes:
```javascript
customerSchema.index({ email: 1 }, { unique: true });
customerSchema.index({ googleId: 1 }, { unique: true, sparse: true });
customerSchema.index({ emailVerificationToken: 1 }, { sparse: true });
customerSchema.index({ passwordResetToken: 1 }, { sparse: true });
```

### Migrations

No migrations needed (new collection). For production deployment:
1. Ensure indexes are created on first deployment
2. Consider adding sample customer data for testing

## Testing Strategy

### Unit Tests

**Backend:**
- `authService.ts`: Test all service functions with mocked database
- `jwt.ts`: Test token generation and verification
- `Customer model`: Test password hashing, token generation methods
- Middleware: Test auth middleware with valid/invalid tokens

**Frontend:**
- `AuthContext`: Test context state management
- `useAuth` hook: Test hook returns correct values
- Form validation logic

### Integration Tests

**Backend:**
- Full registration → verification → login flow
- Password reset flow end-to-end
- Google OAuth mock flow
- Protected route access with/without tokens
- Token refresh flow
- Rate limiting behavior

**Frontend:**
- Registration form submission
- Login form submission
- Profile update flow
- Navigation between auth pages
- Token auto-refresh on protected pages

### Manual Testing

Checklist (see Phase 6.2 above)

### Load Testing

- Simulate 100 concurrent logins
- Verify rate limiting doesn't affect legitimate users
- Check database connection pooling under load
- Monitor JWT verification performance

### Security Testing

- Attempt SQL injection on email fields
- Test XSS in name fields
- Verify CORS blocks unauthorized domains
- Attempt brute force login (verify rate limiting)
- Test token expiration and refresh
- Verify password reset tokens expire

## Rollout Plan

### Development Phase (2 weeks)
1. Complete implementation following phases 1-6
2. Test thoroughly in local environment
3. Code review and security audit

### Staging Deployment (1 week)
1. Deploy to staging environment
2. Create test customer accounts
3. Run full test suite
4. Performance testing with realistic data
5. Security penetration testing
6. Fix any issues found

### Production Deployment (Phased)

**Week 1: Soft Launch**
- Deploy backend with feature flag (auth endpoints active)
- Deploy frontend with feature flag OFF (show "Coming Soon" on auth pages)
- Monitor backend performance and errors
- No customer-facing changes yet

**Week 2: Beta Launch**
- Enable feature flag for 10% of traffic (using cookie or A/B test)
- Monitor:
  - Registration success rate
  - Login success rate
  - Error rates
  - Performance metrics
  - User feedback
- Fix critical issues quickly

**Week 3: Full Launch**
- Enable feature flag for 50% of traffic
- Continue monitoring
- Gradual increase to 100% over 3 days
- Announce feature to all users

### Rollback Strategy

**If critical issues found:**
1. Disable feature flag (redirect auth pages to "Maintenance" page)
2. Keep backend running for existing logged-in users
3. Fix issues in hotfix branch
4. Redeploy after testing
5. Re-enable gradually

**Database rollback:**
- Do NOT delete `customers` collection (user data loss)
- If schema changes needed, run migration script
- Keep backups before major changes

### Monitoring

**Metrics to track:**
- Registration rate (daily)
- Login success/failure rate
- Google OAuth adoption rate
- Email verification rate
- Password reset request rate
- Average response time for auth endpoints
- Error rates by endpoint
- Token refresh rate
- Active users (daily, weekly, monthly)

**Alerts:**
- Auth endpoint error rate > 5%
- Login success rate < 90%
- Response time > 1s (P95)
- Rate limit triggers > 100/hour (potential attack)

## Timeline Considerations

### Critical Path Items
1. Customer model + JWT utilities (blocks everything else)
2. Auth middleware (blocks protected routes)
3. Auth service layer (blocks controllers)
4. Auth context (blocks frontend UI)
5. Google OAuth setup (requires Google Cloud project configuration)

### Dependencies Between Steps
- Frontend cannot be built until backend API is stable
- Admin pages depend on customer API endpoints
- Email verification requires SMTP configuration
- Google OAuth requires external account setup (can be done in parallel)

### Estimated Timeline

**Backend:** 4-5 days (Phases 1-2)
**Frontend:** 3-4 days (Phases 3-4)
**Admin:** 1 day (Phase 5)
**Testing:** 2 days (Phase 6)

**Total:** ~10-12 working days for implementation
**+ 3 weeks** for staged rollout and monitoring

### Parallel Work Opportunities
- Frontend developer can start on UI components while backend APIs are being built (using mock data)
- Google OAuth setup can be done in parallel with email/password auth
- Admin pages can be built in parallel with frontend customer pages
- Documentation can be written throughout development

## Security Considerations

### Password Security
- Minimum 8 characters, must include uppercase, lowercase, and number
- Hash with bcrypt (cost factor: 10 for dev, 12 for production)
- Never log passwords or send in responses
- Implement password strength meter on frontend

### Token Security
- Access tokens: Short-lived (15 min), stored in memory or localStorage
- Refresh tokens: Longer-lived (7 days), stored in httpOnly cookie (prevents XSS)
- Use secure random strings for verification/reset tokens (crypto.randomBytes)
- Rotate refresh tokens on use (optional, for higher security)
- Invalidate all tokens on password change or logout-all

### API Security
- Rate limiting: 5 login attempts per 15 min per IP
- CORS: Whitelist frontend domain only
- HTTPS: Required in production (redirect HTTP to HTTPS)
- Input validation: Sanitize all inputs, use validator library
- SQL injection: N/A (using Mongoose ORM)
- NoSQL injection: Mongoose escapes by default, but validate input types

### OAuth Security
- Verify Google ID token signature using google-auth-library
- Use state parameter to prevent CSRF
- Validate redirect URIs match configured callbacks
- Don't trust client-provided user data without verification

### Privacy & Compliance
- GDPR: Provide data export and deletion (future)
- Store minimal user data
- Clear privacy policy on registration
- Allow users to delete accounts
- Log access to customer data (audit trail)

### Error Handling
- Don't reveal whether email exists in forgot password flow
- Generic "invalid credentials" message for login (don't say "wrong password")
- Log suspicious activity (multiple failed logins, unusual patterns)
- Don't expose stack traces in production

## Future Enhancements

### Phase 2 Features (Post-Launch)
- Two-factor authentication (2FA via SMS or authenticator app)
- Social login (Facebook, Apple)
- Account deletion with grace period
- Email change with verification
- Login history and device management
- "Login from new device" email notifications
- Passwordless login (magic link via email)
- Progressive profile completion (gamification)

### Integration Points
- Order history linked to customer ID
- Wishlist/saved items per customer
- Personalized product recommendations
- Loyalty points and rewards
- Address book for shipping
- Payment method storage
- Customer support ticket system

## References

- [Google OAuth 2.0 Web Server Flow](https://developers.google.com/identity/protocols/oauth2/web-server)
- [OAuth 2.0 implementation in Node.js](https://permify.co/post/oauth-20-implementation-nodejs-expressjs/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [bcrypt NPM Package](https://www.npmjs.com/package/bcryptjs)
- [jsonwebtoken NPM Package](https://www.npmjs.com/package/jsonwebtoken)

---
*Generated: 2026-03-25*
