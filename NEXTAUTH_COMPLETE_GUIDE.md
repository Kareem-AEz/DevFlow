# 🔐 The Complete NextAuth.js Guide

_Your definitive resource for mastering authentication in Next.js applications_

## 🎯 Overview

NextAuth.js handles authentication through **two main approaches**:

- **🔑 Credentials**: Users sign in with email/password on your site
- **🌐 OAuth**: Users sign in through external providers (Google, GitHub, etc.)

Both follow the same **waterfall pattern** through NextAuth callbacks, but with different data flows and responsibilities.

## 🌊 The NextAuth Waterfall Pattern

Every authentication in NextAuth follows this predictable flow:

```
User Action → Provider Logic → NextAuth Callbacks → User Session
     ↓              ↓                ↓                  ↓
  Sign in     Validate/Fetch    Process Data      Final Session
```

**Callbacks execute in order:**

1. **`signIn()`** - Controls if authentication proceeds
2. **`jwt()`** - Manages token data (persists across requests)
3. **`session()`** - Shapes the final session object

## 🔑 Credentials Authentication

### How It Works

```javascript
// 1. Your action handles business logic
export async function signInWithCredentials(params) {
  // ✅ Validate credentials
  // ✅ Check database
  // ✅ Verify password

  // Then delegate to NextAuth
  await signIn("credentials", { email, password });
}

// 2. NextAuth provider handles auth flow
Credentials({
  async authorize(credentials) {
    // ✅ Re-validate (NextAuth requirement)
    // ✅ Return user object for session
    return { id, name, email, image };
  },
});
```

### Key Insight: Two-Layer Architecture

- **Your Actions**: Handle business logic (validation, database operations, error handling)
- **NextAuth Provider**: Handle authentication flow (token creation, session management)

### The ID Mapping Dance

```javascript
// Initial state (all the same):
token.sub: "b96f9154-4223-4cc2-b9c2-77305d354e60"         // From authorize()
account.providerAccountId: "b96f9154-4223-4cc2-b9c2-77305d354e60"  // NextAuth copies
user.id: "b96f9154-4223-4cc2-b9c2-77305d354e60"          // From authorize()

// After JWT callback:
token.sub = "actual-database-user-id"  // Your real user ID
```

**The Pattern:**

- `account.providerAccountId` = The "lookup key" (finds your database record)
- `token.sub` = The "session user ID" (what the user sees in their session)

**Why This Matters:** You can return a temporary ID from `authorize()`, then replace it with your real database user ID in the JWT callback. This gives you full control over user identification!

## 🌐 OAuth Authentication

### How It Works

```javascript
// 1. User clicks "Sign in with GitHub"
// 2. Redirect to GitHub → User authenticates → GitHub redirects back
// 3. NextAuth exchanges code for tokens and user data
// 4. Callbacks process the OAuth data

// Simple setup (environment variables automatically used):
export const { handlers, auth } = NextAuth({
  providers: [
    GitHub, // Uses AUTH_GITHUB_ID and AUTH_GITHUB_SECRET
    Google, // Uses AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET
  ],
});
```

### OAuth Data Flow

OAuth provides **three data objects** (credentials only provides `user`):

```javascript
// user: What NextAuth standardizes
user: {
  id: "12345678",
  name: "John Doe",
  email: "john@gmail.com",
  image: "https://github.com/avatar.jpg"
}

// profile: Raw provider data (OAuth only!)
profile: {
  login: "johndoe",        // GitHub username
  bio: "Developer",        // GitHub bio
  public_repos: 42,        // GitHub-specific data
  // ... lots more provider-specific fields
}

// account: OAuth connection info
account: {
  type: "oauth",
  provider: "github",
  providerAccountId: "12345678",
  access_token: "gho_xxxxxxxxxxxx",  // Use for API calls!
  scope: "read:user user:email"
}
```

## 📊 Callback Parameter Availability

| Callback    | `user`          | `profile`             | `account`       | `token`   | When Called             |
| ----------- | --------------- | --------------------- | --------------- | --------- | ----------------------- |
| `signIn()`  | ✅ Always       | ✅ OAuth only         | ✅ Always       | ❌ Never  | Every sign-in attempt   |
| `jwt()`     | ✅ Initial only | ✅ OAuth initial only | ✅ Initial only | ✅ Always | Initial + token refresh |
| `session()` | ❌ Never        | ❌ Never              | ❌ Never        | ✅ Always | When session accessed   |

### The JWT Callback Mystery 🕵️

```javascript
async jwt({ token, account, user }) {
  if (account) {
    // 🔥 Initial sign-in: account & user are present
    console.log("Database lookup time!");
    token.sub = await getUserIdFromDatabase();
  } else {
    // ♻️ Token refresh: account & user are undefined
    console.log("Using cached token data");
  }
  return token;
}
```

**Key Insight:** JWT callback behaves differently based on when it's called!

## ⚠️ Critical Role Assignment Warning

### 🚨 **OAuth Providers DON'T Provide Roles!**

**Common Mistake:** Trying to get user roles from OAuth providers like Google, GitHub, etc.

```javascript
// ❌ WRONG - This will NEVER work!
Google({
  async profile(profile) {
    return {
      ...profile,
      role: profile.role ?? "user", // profile.role is ALWAYS undefined!
    };
  },
});
```

**Why this fails:**

- Google doesn't know about your app's roles (admin, user, etc.)
- GitHub doesn't know who should be admin in your system
- Discord doesn't know your business logic

**The Truth:** OAuth providers give you **profile data** (name, email, avatar), not **app-specific roles**.

### ✅ **The Correct Pattern: Database Role Lookup**

```javascript
// Step 1: OAuth profile - Transform provider data only
Google({
  async profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      // ✅ Only transform OAuth data
      firstName: profile.given_name,
      lastName: profile.family_name,
      // ❌ NO ROLES HERE!
    };
  }
})

// Step 2: JWT callback - Database operations
async jwt({ token, account, user }) {
  if (account) {
    // ✅ Look up role from YOUR database
    const dbUser = await getUserByProvider(
      account.providerAccountId,
      account.provider
    );

    token.role = dbUser?.role || "user";  // ✅ From YOUR database
  }
  return token;
}
```

**Remember:**

- **OAuth providers** = Identity verification + profile data
- **Your database** = Roles, permissions, business logic

## 🚀 Advanced Patterns

### Unified Multi-Provider Architecture

```javascript
async jwt({ token, account, user, profile }) {
  if (account) {
    try {
      // Handle both OAuth and credentials consistently
      const identifier = account.type === "credentials"
        ? token.email!                // Credentials: use email
        : account.providerAccountId;  // OAuth: use provider ID

      const dbUser = await getUserByProvider(identifier, account.provider);

      if (dbUser) {
        // Existing user - get data from database
        token.sub = dbUser.id;
        token.role = dbUser.role;
        token.permissions = dbUser.permissions;
      } else if (account.type === "oauth") {
        // Auto-create users for OAuth providers
        const newUser = await createUserFromOAuth({
          name: user.name,
          email: user.email,
          image: user.image,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          role: "user",  // Default role for new OAuth users
          // Include any transformed profile data
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
        });

        token.sub = newUser.id;
        token.role = newUser.role;
      } else {
        // Credentials user should already exist (created in signUp action)
        console.warn("Credentials user not found in database");
        token.role = "user";
      }
    } catch (error) {
      console.error("JWT callback error:", error);
      token.role = "user";  // Fallback role
    }
  }

  return token;
}
```

### Custom OAuth Profile Processing

```javascript
// ✅ CORRECT - Transform OAuth provider data only
Google({
  async profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
      // ✅ Transform available OAuth data
      firstName: profile.given_name,
      lastName: profile.family_name,
      isEmailVerified: profile.email_verified,
      locale: profile.locale,
      // ❌ DON'T add database-dependent fields like role here!
      // Roles come from YOUR database, not OAuth providers
    };
  },
});
```

### Database Role Assignment (The Correct Way!)

```javascript
// ✅ CORRECT - Database lookup in JWT callback
async jwt({ token, account, user, profile }) {
  if (account) {
    try {
      // Look up user by provider info
      const dbUser = await getUserByProvider(
        account.providerAccountId,  // Provider's user ID
        account.provider           // "google", "github", etc.
      );

      if (dbUser) {
        // Existing user - get role from YOUR database
        token.sub = dbUser.id;
        token.role = dbUser.role;         // ✅ From YOUR database!
        token.permissions = dbUser.permissions;
        token.department = dbUser.department;
      } else if (account.type === "oauth") {
        // New OAuth user - create with default role
        const newUser = await createUserFromOAuth({
          name: user.name,
          email: user.email,
          image: user.image,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          role: "user",  // ✅ YOUR default role
          // Add any fields from profile callback transformation
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
        });

        token.sub = newUser.id;
        token.role = newUser.role;
      }
    } catch (error) {
      console.error("Database lookup failed:", error);
      // Fallback for database errors
      token.role = "user";
    }
  }

  return token;
},

async session({ session, token }) {
  // Make database fields available in session
  session.user.id = token.sub;
  session.user.role = token.role;
  session.user.permissions = token.permissions;
  return session;
}
```

### Database Helper Functions

```javascript
// lib/db-helpers.js
export async function getUserByProvider(providerAccountId, provider) {
  // Using Prisma example
  const account = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId: providerAccountId.toString(),
      },
    },
    include: {
      user: true, // Include user data with role
    },
  });

  return account?.user;
}

export async function createUserFromOAuth(userData, account) {
  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      image: userData.image,
      role: userData.role || "user",
      firstName: userData.firstName,
      lastName: userData.lastName,
      accounts: {
        create: {
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId.toString(),
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at,
        },
      },
    },
  });

  return user;
}
```

### Storing OAuth Access Tokens

```javascript
async jwt({ token, account }) {
  if (account?.provider === "github") {
    // Store tokens for API calls
    token.githubAccessToken = account.access_token;
    token.githubRefreshToken = account.refresh_token;
  }
  return token;
}

// Later, make API calls to GitHub
const response = await fetch('https://api.github.com/user/repos', {
  headers: {
    Authorization: `Bearer ${session.githubAccessToken}`
  }
});
```

## 🛠️ Universal Debugging Setup

```javascript
async signIn({ user, account, profile }) {
  console.log("🚪 SIGNIN CALLBACK");
  console.log("Provider:", account?.provider);
  console.log("Type:", account?.type);
  console.log("Has profile:", !!profile);
  return true;
}

async jwt({ token, account, user, trigger }) {
  console.log("🎫 JWT CALLBACK");
  console.log("Trigger:", trigger);
  console.log("Has account:", !!account);
  console.log("Token sub:", token.sub);

  if (account) {
    console.log("🔥 Initial sign-in:", account.provider);
  } else {
    console.log("♻️ Token refresh/subsequent request");
  }

  return token;
}

async session({ session, token }) {
  console.log("🏠 SESSION:", session.user.id);
  return session;
}
```

## 🔒 Security Best Practices

### ⚠️ **CRITICAL: Never Store Sensitive Data in JWT or Session**

**JWTs and sessions are accessible by client-side JavaScript** - anyone can decode and read them!

#### ❌ **NEVER Store:**

```javascript
// DON'T DO THIS! ❌
async jwt({ token, user }) {
  return {
    ...token,
    password: user.password,           // ❌ NEVER!
    creditCard: user.creditCard,       // ❌ NEVER!
    ssn: user.socialSecurity,          // ❌ NEVER!
    apiKey: user.secretApiKey,         // ❌ NEVER!
    bankAccount: user.bankDetails,     // ❌ NEVER!
    privateKey: user.encryptionKey     // ❌ NEVER!
  }
}
```

#### ✅ **Safe to Store:**

```javascript
// This is SAFE ✅
async jwt({ token, user }) {
  return {
    ...token,
    role: user.role,                   // ✅ Public user role
    name: user.name,                   // ✅ Display name
    email: user.email,                 // ✅ Email (already public)
    avatar: user.image,                // ✅ Profile picture URL
    permissions: user.permissions,     // ✅ UI permissions array
    preferences: user.uiPreferences    // ✅ Non-sensitive settings
  }
}
```

#### 🛡️ **For Sensitive Data, Use Server-Side Lookups:**

```javascript
// Server Component or API Route
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth();

  // Use session.user.id to fetch sensitive data server-side
  const sensitiveData = await getUserSensitiveData(session.user.id);

  // Never expose sensitive data to client
  return <div>Welcome {session.user.name}</div>;
}
```

### 🎯 The ID Passing Pattern

**Key Insight:** You can control exactly what ID becomes the session user ID:

```javascript
// In authorize() - return any ID (temporary is fine)
return { id: "temp-id-123" }

// In JWT callback - replace with your real database user ID
async jwt({ token, account }) {
  if (account) {
    const dbUser = await getUserFromDatabase(account.providerAccountId)
    token.sub = dbUser.id  // This becomes session.user.id
  }
  return token
}
```

**Why This Matters:** You have full control over user identification and can implement complex user mapping logic!

### 🎯 General Best Practices

#### ✅ DO's

- **Use `token` data in JWT/session callbacks**: Always available and reliable
- **Store OAuth access tokens**: Enable API calls to provider services
- **Handle provider differences**: Each OAuth provider has unique data structure
- **Implement proper error handling**: Different strategies for actions vs callbacks
- **Use environment variables**: Keep secrets secure
- **Validate on server-side**: Never trust client data
- **Use the ID passing pattern**: Take control of user identification

#### ❌ DON'Ts

- **Don't rely on `user`/`account` in JWT refresh**: Only available on initial sign-in
- **Don't duplicate validation logic**: Keep business logic in actions, auth logic in providers
- **Don't store sensitive data in JWT/Session**: Accessible by client-side JavaScript
- **Don't assume provider data structure**: Always have fallbacks for missing fields
- **Don't trust client-side data**: Always validate server-side
- **Don't expose database internals**: Use the ID mapping pattern to hide implementation details

## 📝 Quick Reference

### Credentials vs OAuth Comparison

| Aspect                   | Credentials         | OAuth                      |
| ------------------------ | ------------------- | -------------------------- |
| **User enters password** | ✅ On your site     | ❌ On provider site        |
| **Profile data**         | ❌ What you provide | ✅ Rich provider data      |
| **Business logic**       | ✅ Full control     | ⚠️ Limited control         |
| **User management**      | ✅ Your database    | 🤝 Shared with provider    |
| **API access**           | ❌ No tokens        | ✅ Access tokens available |

### Environment Variables Template

```bash
# NextAuth Core
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (automatically detected by NextAuth!)
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

# Database (if using)
DATABASE_URL=your_database_connection_string
```

**💡 Pro Tip:** With correct environment variable names, you can simply use `GitHub` or `Google` without explicitly passing `clientId` and `clientSecret`!

### Common Provider Data Fields

| Provider | ID Field | Username   | Email   | Image        | Unique Fields                         |
| -------- | -------- | ---------- | ------- | ------------ | ------------------------------------- |
| GitHub   | `id`     | `login`    | `email` | `avatar_url` | `bio`, `public_repos`, `followers`    |
| Google   | `sub`    | `email`    | `email` | `picture`    | `given_name`, `family_name`, `locale` |
| Discord  | `id`     | `username` | `email` | `avatar`     | `discriminator`, `verified`           |

## 🔗 Deep Dive Resources

For comprehensive coverage of specific topics, check out our specialized guides:

- 📚 **[Credentials Deep Dive](./NEXTAUTH_CREDENTIALS_GUIDE.md)**: Complete walkthrough of credentials authentication, debugging sessions, and "aha!" moments
- 🔍 **[OAuth Cheat Sheet](./NEXTAUTH_OAUTH_CHEATSHEET.md)**: Comprehensive reference for OAuth providers, callback data structures, and advanced patterns

## 💡 Pro Tips

1. **Start with OAuth for MVP**: Easier to implement, better UX
2. **Add credentials for enterprise**: When you need custom validation logic
3. **Always test token refresh**: Dev mode can hide refresh issues
4. **Monitor provider rate limits**: Each has different API quotas
5. **Use TypeScript**: NextAuth has excellent type definitions

## 🎉 Common Patterns

### Role-Based Access Control

```javascript
// ✅ CORRECT - Database lookup for roles
async jwt({ token, account, user }) {
  if (account) {
    // Look up user's role from database
    const dbUser = await getUserByProvider(
      account.providerAccountId,
      account.provider
    );

    if (dbUser) {
      token.sub = dbUser.id;
      token.role = dbUser.role;  // ✅ From database
    } else {
      // New user - assign default role
      const userData = {
        ...user,
        role: "user",  // Default role
        provider: account.provider,
        providerAccountId: account.providerAccountId
      };

      const newUser = await createUserFromOAuth(userData);
      token.sub = newUser.id;
      token.role = newUser.role;
    }
  }
  return token;
}

// Expose in session
async session({ session, token }) {
  session.user.id = token.sub;
  session.user.role = token.role;
  return session;
}
```

### Conditional Sign-In

```javascript
async signIn({ account, profile }) {
  if (account?.provider === "google") {
    return profile?.email_verified === true;
  }
  if (account?.provider === "github") {
    return profile?.email !== null;
  }
  return true; // Allow credentials
}
```

### Custom Session Data

```javascript
async jwt({ token, user, account }) {
  if (user) {
    token.customField = user.customField;
    token.permissions = user.permissions;
  }
  return token;
}

async session({ session, token }) {
  session.user.customField = token.customField;
  session.user.permissions = token.permissions;
  return session;
}
```

---

## 🚀 Ready to Implement?

1. **Choose your approach**: OAuth for simplicity, credentials for control
2. **Set up providers**: Configure environment variables
3. **Implement callbacks**: Use our debugging setup first
4. **Test thoroughly**: Both initial sign-in and token refresh
5. **Add advanced features**: Roles, custom data, API access

_"NextAuth: Where authentication complexity becomes elegant simplicity!"_ ✨

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [NextAuth Configuration Reference](https://next-auth.js.org/configuration)
- [Security Best Practices](https://next-auth.js.org/configuration/options#security)

Happy authenticating! 🔐🎯
