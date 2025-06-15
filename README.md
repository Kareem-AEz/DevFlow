# 🚀 DevFlow - Stack Overflow Clone with NextAuth

> A modern, full-stack developer community platform inspired by Stack Overflow, featuring comprehensive authentication, Q&A functionality, and beautiful UI.

## ✨ Overview

DevFlow is a complete Stack Overflow-inspired application built with Next.js. It's a developer community platform where users can ask questions, provide answers, vote on content, and build their reputation. The application features a robust authentication system powered by NextAuth.js, advanced search capabilities, and a beautiful, responsive design.

**Key Features:**

- 💬 **Ask & Answer Questions** - Full Q&A functionality like Stack Overflow
- 🔍 **Advanced Search** - Find questions by tags, keywords, or users
- ⭐ **Voting System** - Upvote/downvote questions and answers
- 🏆 **Reputation System** - Build reputation through community engagement
- 🏷️ **Tagging System** - Organize content with relevant tags
- 👤 **User Profiles** - Comprehensive user dashboard and statistics

## 🛠️ Tech Stack

- **Framework:** Next.js 15.3.2 (App Router)
- **Authentication:** NextAuth.js v5 (Beta)
- **Styling:** Tailwind CSS + Radix UI
- **Database:** MongoDB with Mongoose
- **Forms:** React Hook Form + Zod validation
- **UI Components:** Custom components with Radix UI primitives
- **TypeScript:** Full type safety
- **Development:** ESLint, Prettier, Turbopack

## 📚 **Featured: The Ultimate NextAuth Documentation**

This project includes the most comprehensive NextAuth.js documentation you'll find anywhere! Our documentation trilogy covers every aspect of NextAuth authentication:

### 🎯 **[Complete NextAuth Guide](./NEXTAUTH_COMPLETE_GUIDE.md)**

_Your definitive resource for mastering authentication in Next.js_

Perfect for developers who want a complete understanding of NextAuth. Covers both credentials and OAuth authentication with unified patterns, debugging strategies, and real-world examples.

**What you'll learn:**

- The NextAuth waterfall pattern
- Credentials vs OAuth authentication flows
- Callback parameter availability and behavior
- Advanced multi-provider patterns
- Universal debugging techniques

### 🔍 **[OAuth Providers Cheat Sheet](./NEXTAUTH_OAUTH_CHEATSHEET.md)**

_Complete reference for OAuth providers and callback parameters_

Essential reference for implementing OAuth authentication. Includes provider-specific data structures, callback examples, and quick lookup tables.

**What you'll find:**

- GitHub, Google, Discord provider data structures
- Real OAuth callback examples
- Access token storage patterns
- Provider-specific customizations
- Environment variable templates

### 🕵️ **[Credentials Authentication Deep Dive](./NEXTAUTH_CREDENTIALS_GUIDE.md)**

_Complete walkthrough based on real debugging sessions_

In-depth exploration of credentials authentication, featuring actual debugging discoveries and "aha!" moments from development sessions.

**Includes:**

- The complete credentials flow breakdown
- JWT callback behavior mysteries solved
- ID mapping patterns explained
- Common misconceptions debunked
- Real debugging session logs

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB database
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/devflow.git
   cd devflow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure your `.env.local`:

   ```bash
   # NextAuth
   NEXTAUTH_SECRET=your_random_secret_key
   NEXTAUTH_URL=http://localhost:3000

   # Database
   DATABASE_URL=your_mongodb_connection_string

   # OAuth Providers (Optional)
   AUTH_GITHUB_ID=your_github_client_id
   AUTH_GITHUB_SECRET=your_github_client_secret
   AUTH_GOOGLE_ID=your_google_client_id
   AUTH_GOOGLE_SECRET=your_google_client_secret
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages (sign-in, sign-up)
│   ├── (root)/            # Main application pages (questions, tags, profile)
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── forms/             # Question/Answer forms
│   ├── cards/             # Question/Answer/User cards
│   └── shared/            # Common UI components
├── lib/                   # Utility functions & configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── actions/          # Server actions (questions, answers, voting)
│   └── validations.ts    # Zod schemas for forms
├── database/             # Database models (User, Question, Answer, Tag)
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
└── constants/            # Application constants (routes, limits)
```

## 🔐 Authentication Features

### Supported Authentication Methods

- ✅ **Email & Password** (Credentials)
- ✅ **GitHub OAuth**
- ✅ **Google OAuth**
- ✅ **Extensible for more providers**

### Security Features

- 🛡️ **Password Hashing** with bcryptjs
- 🔐 **JWT Token Management**
- 🚫 **CSRF Protection**
- ✨ **Session Management**
- 🔒 **Role-based Access Control Ready**

### Authentication Flow

1. **Sign Up**: Create developer account to join the community
2. **Sign In**: Multiple provider options for quick access
3. **Session Management**: Automatic token refresh for seamless experience
4. **Sign Out**: Secure session cleanup

## 💡 DevFlow Features

### Core Q&A Functionality

- 📝 **Ask Questions** - Post detailed questions with rich text editor
- 💬 **Answer Questions** - Provide comprehensive answers to help others
- ⬆️ **Voting System** - Upvote helpful questions and answers
- ✅ **Accept Answers** - Mark the best answer to your question
- 🏷️ **Tag System** - Categorize questions with relevant technologies

### Community Features

- 👤 **User Profiles** - Showcase your expertise and activity
- 🏆 **Reputation System** - Earn points for helpful contributions
- 📊 **Leaderboard** - See top contributors in the community
- 🔍 **Advanced Search** - Find questions by keywords, tags, or users
- 📱 **Responsive Design** - Perfect experience on all devices

### Developer Experience

- 🌙 **Dark/Light Mode** - Choose your preferred theme
- ⚡ **Fast Performance** - Optimized with Next.js App Router
- 🔄 **Real-time Updates** - See new content without refreshing
- 📱 **Mobile Optimized** - Full functionality on mobile devices

## 📖 Documentation & Guides

- 📚 **[Complete NextAuth Guide](./NEXTAUTH_COMPLETE_GUIDE.md)** - Master guide covering everything
- 🔍 **[OAuth Cheat Sheet](./NEXTAUTH_OAUTH_CHEATSHEET.md)** - Quick reference for OAuth providers
- 🕵️ **[Credentials Deep Dive](./NEXTAUTH_CREDENTIALS_GUIDE.md)** - Detailed credentials authentication

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Credits & Acknowledgments

### Created by **Adrian Hajdin** from **[JavaScript Mastery](https://jsmastery.pro)**

DevFlow is a full-featured Stack Overflow clone developed as part of the JavaScript Mastery curriculum. This project showcases modern Next.js development practices, advanced authentication patterns, and comprehensive full-stack application architecture.

**Special thanks to the JavaScript Mastery community for:**

- Comprehensive Next.js 15 and NextAuth.js v5 training
- Advanced database design patterns
- Modern UI/UX development techniques
- Production-ready deployment strategies

### Enhanced Documentation

The comprehensive NextAuth.js documentation included in this project was developed through extensive research, real debugging sessions, and integration with the latest official Auth.js documentation to provide the most complete authentication guide available.

**JavaScript Mastery** is a leading platform for learning modern web development, offering comprehensive courses on React, Next.js, and full-stack development.

- 🌐 **Website:** [jsmastery.pro](https://jsmastery.pro)
- 📺 **YouTube:** [JavaScript Mastery](https://youtube.com/@javascriptmastery)
- 🐦 **Twitter:** [@jsmasterypro](https://twitter.com/jsmasterypro)

### Special Thanks

- The Next.js team for the amazing framework
- The NextAuth.js team for the authentication library
- The React and Tailwind CSS communities
- All contributors and the open-source community

---

## 🚀 Ready to Contribute?

Join the DevFlow community! Whether you're looking to learn from the codebase, contribute new features, or use this as inspiration for your own projects, DevFlow provides an excellent example of modern full-stack development.

**Questions?** Check out our comprehensive [NextAuth documentation](#-featured-the-ultimate-nextauth-documentation) above!

---

<div align="center">

**Built with ❤️ by Kareem-AEz**

[⭐ Star this repo](https://github.com/Kareem-AEz/DevFlow) • [🐛 Report Bug](https://github.com/Kareem-AEz/DevFlow/issues) • [💡 Request Feature](https://github.com/Kareem-AEz/DevFlow/issues)

</div>
