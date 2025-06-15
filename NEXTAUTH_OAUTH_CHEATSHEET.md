# 🔐 NextAuth OAuth & Callbacks Cheat Sheet

_Your complete guide to mastering OAuth providers and callback parameters_

## 🎯 Quick Overview

OAuth authentication in NextAuth works differently from credentials - instead of you validating credentials, the **OAuth provider** (Google, GitHub, etc.) handles authentication and gives you user data.

## 🔄 OAuth Flow vs Credentials Flow

### OAuth Flow (GitHub, Google, etc.)

```
1. User clicks "Sign in with GitHub"
2. Redirect to GitHub login page
3. User enters credentials on GitHub
4. GitHub redirects back with code
5. Your app exchanges code for access token
6. Your app gets user profile from GitHub
7. NextAuth callbacks process the data
8. User is signed in with session
```

### Credentials Flow (Username/Password)

```
1. User enters email/password on your site
2. Your action validates credentials
3. Your action calls signIn("credentials")
4. NextAuth processes through callbacks
5. User is signed in with session
```

## 📊 Callback Parameters Cheat Sheet

### What's Available in Each Callback

| Callback    | `user`                      | `profile`                                      | `account`       | `token`   | When Called             |
| ----------- | --------------------------- | ---------------------------------------------- | --------------- | --------- | ----------------------- |
| `signIn()`  | ✅ OAuth<br/>✅ Credentials | ✅ OAuth<br/>❌ Credentials                    | ✅ Always       | ❌ Never  | Every sign-in attempt   |
| `jwt()`     | ✅ Initial only             | ✅ OAuth initial only<br/>❌ Credentials never | ✅ Initial only | ✅ Always | Initial + token refresh |
| `session()` | ❌ Never                    | ❌ Never                                       | ❌ Never        | ✅ Always | When session accessed   |

## 🧩 Parameter Deep Dive

### 🔷 For **OAuth Providers** (GitHub, Google, etc.)

#### `user` Parameter

```javascript
// What NextAuth creates from the OAuth provider
user: {
  id: "12345678",           // Provider's user ID
  name: "John Doe",         // From provider profile
  email: "john@gmail.com",  // From provider profile
  image: "https://github.com/avatar.jpg" // Provider avatar
}
```

#### `profile` Parameter (OAuth ONLY)

```javascript
// Raw data from the OAuth provider
profile: {
  // GitHub example:
  login: "johndoe",         // GitHub username
  name: "John Doe",         // Display name
  email: "john@gmail.com",  // Email
  avatar_url: "https://...", // Avatar URL
  bio: "Developer",         // Bio
  followers: 100,           // GitHub-specific data
  // ... lots more GitHub-specific fields

  // Google example:
  given_name: "John",       // First name
  family_name: "Doe",       // Last name
  picture: "https://...",   // Profile picture
  locale: "en",             // Language preference
  // ... lots more Google-specific fields
}
```

#### `account` Parameter

```javascript
// OAuth connection info
account: {
  type: "oauth",                    // Always "oauth" for OAuth providers
  provider: "github",               // "github", "google", etc.
  providerAccountId: "12345678",    // Provider's user ID
  access_token: "gho_xxxxxxxxxxxx", // OAuth access token
  refresh_token: "ghr_xxxxxxxxxx",  // Refresh token (if available)
  expires_at: 1640995200,           // Token expiration timestamp
  token_type: "bearer",             // Token type
  scope: "read:user user:email",    // Granted permissions
  // ... more OAuth-specific fields
}
```

### 🔶 For **Credentials Provider**

#### `user` Parameter

```javascript
// What you return from authorize()
user: {
  id: "user-123",           // What you returned as id
  name: "John Doe",         // What you returned as name
  email: "john@test.com",   // What you returned as email
  image: "...",             // What you returned as image (or undefined)
  customField: "value"      // Any custom fields you added
}
```

#### `profile` Parameter

```javascript
profile: undefined; // ❌ Always undefined for credentials
```

#### `account` Parameter

```javascript
// Credentials connection info
account: {
  type: "credentials",              // Always "credentials"
  provider: "credentials",          // Always "credentials"
  providerAccountId: undefined,     // ❌ Always undefined!
  // No OAuth tokens since it's not OAuth
}
```

## 🎯 Real-World Examples

### OAuth (GitHub) Callback Data

```javascript
// signIn callback for GitHub
async signIn({ user, profile, account }) {
  console.log("user:", user);
  // {
  //   id: "12345678",
  //   name: "John Doe",
  //   email: "john@gmail.com",
  //   image: "https://avatars.githubusercontent.com/u/12345678"
  // }

  console.log("profile:", profile);
  // {
  //   login: "johndoe",
  //   id: 12345678,
  //   name: "John Doe",
  //   email: "john@gmail.com",
  //   avatar_url: "https://avatars.githubusercontent.com/u/12345678",
  //   bio: "Full-stack developer",
  //   public_repos: 42,
  //   followers: 100,
  //   ... // lots more GitHub data
  // }

  console.log("account:", account);
  // {
  //   type: "oauth",
  //   provider: "github",
  //   providerAccountId: "12345678",
  //   access_token: "gho_xxxxxxxxxxxxxxxxxxxx",
  //   token_type: "bearer",
  //   scope: "read:user,user:email"
  // }

  return true; // Allow sign in
}
```

### Credentials Callback Data

```javascript
// signIn callback for credentials
async signIn({ user, profile, account }) {
  console.log("user:", user);
  // {
  //   id: "b96f9154-4223-4cc2-b9c2-77305d354e60", // From authorize()
  //   name: "John Doe",    // From authorize()
  //   email: "john@test.com" // From authorize()
  // }

  console.log("profile:", profile);
  // undefined ❌

  console.log("account:", account);
  // {
  //   type: "credentials",
  //   provider: "credentials",
  //   providerAccountId: undefined // ❌ No provider ID!
  // }

  return true; // Allow sign in
}
```

## 🚀 Advanced Patterns

### Custom Profile Processing (OAuth)

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
      // ❌ DON'T add roles here! OAuth providers don't provide app-specific roles
      // Use JWT callback for database role lookup instead
    };
  },
});
```

### ✅ Correct Role Assignment Pattern

```javascript
// Step 1: Profile callback - Transform OAuth data only
Google({
  async profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      // ✅ Only transform OAuth provider data
      firstName: profile.given_name,
      isEmailVerified: profile.email_verified,
      // ❌ NO ROLES HERE! They come from your database
    };
  },
});

// Step 2: JWT callback - Database role lookup
async jwt({ token, account, user }) {
  if (account) {
    // ✅ Look up user role from YOUR database
    const dbUser = await getUserByProvider(
      account.providerAccountId,
      account.provider
    );

    if (dbUser) {
      token.sub = dbUser.id;
      token.role = dbUser.role;        // ✅ From YOUR database
      token.permissions = dbUser.permissions;
    } else {
      // New OAuth user - create with default role
      const newUser = await createUserFromOAuth({
        ...user,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        role: "user"  // ✅ YOUR default role
      });

      token.sub = newUser.id;
      token.role = newUser.role;
    }
  }
  return token;
}
```

### Storing OAuth Access Tokens

```javascript
// Store provider tokens for API calls
async jwt({ token, account }) {
  if (account?.provider === "github") {
    // Store GitHub access token
    token.githubAccessToken = account.access_token;
    token.githubRefreshToken = account.refresh_token;
  }
  return token;
}

async session({ session, token }) {
  // Make tokens available in session
  session.githubAccessToken = token.githubAccessToken;
  return session;
}
```

### Conditional Sign-In Logic

```javascript
async signIn({ user, account, profile }) {
  if (account?.provider === "google") {
    // Only allow verified Google emails
    return profile?.email_verified === true;
  }

  if (account?.provider === "github") {
    // Only allow users with public email
    return profile?.email !== null;
  }

  if (account?.type === "credentials") {
    // Credentials already validated in your action
    return true;
  }

  return false; // Reject unknown providers
}
```

## 🔍 Debugging OAuth vs Credentials

### Ultimate Debug Setup

```javascript
async signIn({ user, account, profile }) {
  console.log("🚪 SIGNIN CALLBACK");
  console.log("Provider:", account?.provider);
  console.log("Type:", account?.type);
  console.log("User:", JSON.stringify(user, null, 2));
  console.log("Profile:", profile ? "Present" : "Undefined");
  console.log("Account keys:", Object.keys(account || {}));
  return true;
}

async jwt({ token, account, user, profile }) {
  console.log("🎫 JWT CALLBACK");
  console.log("Has account:", !!account);
  console.log("Has user:", !!user);
  console.log("Has profile:", !!profile);
  console.log("Token sub:", token.sub);

  if (account) {
    console.log("🔥 Initial sign-in for:", account.provider);
  } else {
    console.log("♻️ Token refresh/subsequent request");
  }

  return token;
}
```

## 🎨 Provider-Specific Customizations

### GitHub Provider

```javascript
GitHub({
  // AUTH_GITHUB_ID and AUTH_GITHUB_SECRET automatically used!
  async profile(profile) {
    return {
      id: profile.id.toString(),
      name: profile.name || profile.login,
      email: profile.email,
      image: profile.avatar_url,
      username: profile.login, // ✨ Keep GitHub username
      bio: profile.bio, // ✨ Add bio
      publicRepos: profile.public_repos, // ✨ Add repo count
    };
  },
});
```

### Google Provider

```javascript
Google({
  // AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET automatically used!
  async profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
      firstName: profile.given_name, // ✨ Split name
      lastName: profile.family_name, // ✨ Split name
      locale: profile.locale, // ✨ Language preference
      isEmailVerified: profile.email_verified,
    };
  },
});
```

## 🏗️ Multi-Provider Architecture

### Unified User Handling

```javascript
async jwt({ token, account, user, profile }) {
  if (account) {
    // Handle different providers consistently
    const identifier = account.type === "credentials"
      ? token.email!
      : account.providerAccountId;

    // Your unified database lookup
    const dbUser = await getUserByProvider(identifier, account.provider);

    if (dbUser) {
      token.sub = dbUser.id;
      token.role = dbUser.role;
    } else if (account.type === "oauth") {
      // Create new user for OAuth providers
      const newUser = await createUserFromOAuth(user, account, profile);
      token.sub = newUser.id;
      token.role = newUser.role;
    }
  }

  return token;
}
```

## 🎭 Common Patterns & Gotchas

### ✅ DO's

- **Store access tokens in JWT**: For making API calls to provider
- **Use profile callback**: To customize user data from OAuth
- **Check email_verified**: For providers that support it
- **Handle missing profile data**: Not all providers give the same fields
- **Use account.provider**: To handle different providers differently

### ❌ DON'Ts

- **Don't rely on profile in JWT**: Only available on initial sign-in
- **Don't assume all OAuth providers are the same**: Each has different data structure
- **Don't store sensitive data in JWT/Session**: JWTs can be decoded by clients - see security section below! 🔒
- **Don't forget to handle token refresh**: Implement refresh logic if needed

## 📝 Quick Reference Cards

### OAuth Provider Callback URLs

```bash
# Next.js (App Router)
https://yourdomain.com/api/auth/callback/[provider]

# Examples:
https://yourdomain.com/api/auth/callback/github
https://yourdomain.com/api/auth/callback/google
https://yourdomain.com/api/auth/callback/discord
```

### Environment Variables Template

```bash
# GitHub
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret

# Google
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### Common Provider Data Fields

| Provider | ID Field | Username   | Email   | Image               | Unique Fields                         |
| -------- | -------- | ---------- | ------- | ------------------- | ------------------------------------- |
| GitHub   | `id`     | `login`    | `email` | `avatar_url`        | `bio`, `public_repos`, `followers`    |
| Google   | `sub`    | `email`    | `email` | `picture`           | `given_name`, `family_name`, `locale` |
| Discord  | `id`     | `username` | `email` | `avatar` (partial)  | `discriminator`, `verified`           |
| Twitter  | `id`     | `username` | `email` | `profile_image_url` | `verified`, `public_metrics`          |

## 🔒 Security Warnings

### ⚠️ **NEVER Store Sensitive Data in JWT/Session**

```javascript
// ❌ DANGEROUS - DON'T DO THIS!
async jwt({ token, account, profile }) {
  return {
    ...token,
    // These are accessible by client-side JavaScript!
    apiKey: account.refresh_token,     // ❌ NEVER!
    password: "user-password",         // ❌ NEVER!
    creditCard: profile.creditCard     // ❌ NEVER!
  }
}

// ✅ SAFE - This is OK
async jwt({ token, account, profile }) {
  return {
    ...token,
    // These are safe for client access
    githubUsername: profile.login,     // ✅ Public data
    avatar: profile.avatar_url,        // ✅ Already public
    accessToken: account.access_token  // ✅ Intended for client use
  }
}
```

**Remember:** Anything in JWT/session can be read by client-side JavaScript!

## 🎉 Pro Tips

1. **OAuth is stateless**: The provider handles authentication, you handle authorization
2. **Profile data varies**: Always have fallbacks for missing fields
3. **Tokens expire**: Implement refresh logic for long-lived integrations
4. **Test with real providers**: OAuth quirks only show up in production
5. **Monitor rate limits**: Each provider has different API limits
6. **Security first**: Never expose sensitive data in tokens or sessions

---

_"OAuth: Let the giants handle passwords, you handle the experience!"_ 🚀

## 🔗 Useful Resources

- [NextAuth Providers](https://next-auth.js.org/providers/)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [GitHub OAuth Apps](https://docs.github.com/en/apps/oauth-apps)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth Callbacks](https://next-auth.js.org/configuration/callbacks)

Happy authenticating! 🔐✨
