# 🚀 DevFlow - Where Developers Connect & Collaborate

> Built with love using Next.js, shadcn/ui, and the latest web technologies. This isn't just another Stack Overflow clone—it's a thoughtfully crafted developer community platform.

## 👋 Hey there, fellow developer!

Ever wished you could build your own Stack Overflow? Well, here it is! DevFlow is a full-stack developer community platform that I've been crafting with some of the most exciting tools in the React ecosystem. It's where developers can ask questions, share knowledge, and build meaningful connections—all wrapped in a beautiful, modern interface.

### What makes DevFlow special?

**🎯 The Experience**

- Ask questions with a rich MDX editor that actually feels good to use
- Advanced search that doesn't make you want to pull your hair out
- Tag system that helps you find exactly what you're looking for
- Dark/light themes that transition smoother than your morning coffee
- Mobile-responsive design that works everywhere (yes, even on that old tablet)

**🤝 The Community**

- Browse fellow developers and their awesome profiles
- Save your favorite questions in collections
- Build your reputation through helpful contributions
- Find job opportunities that actually match your skills

**✨ The Polish**

- Smooth animations powered by Motion (not your grandpa's Framer Motion)
- Toast notifications that don't make you cringe (thanks, Sonner!)
- Forms that validate intelligently with React Hook Form + Zod
- Icons that look crisp everywhere courtesy of Lucide React

## 🛠️ The Tech Stack (Because You're Curious)

I've carefully chosen each piece of this stack for a reason. Here's what powers DevFlow:

### 🏗️ **Core Foundation**

```bash
Next.js 15.3.3          # App Router with all the latest goodies
React 19.1.0            # The cutting-edge version with new features
TypeScript              # Because we're not barbarians
Turbopack               # Dev server that's actually fast
```

### 🎨 **UI & Styling (The Pretty Stuff)**

```bash
shadcn/ui               # Component library that doesn't fight you
Radix UI                # Rock-solid primitives under the hood
Lucide React            # 1000+ icons that actually look good
Tailwind CSS 4          # Latest version with new superpowers
Motion                  # Smooth animations (formerly Framer Motion)
next-themes             # Dark/light mode that just works
```

### 🔐 **Authentication (The Secure Stuff)**

```bash
NextAuth.js v5 Beta     # Authentication that doesn't make you cry
bcryptjs                # Password hashing done right
```

### 🗄️ **Data & State**

```bash
MongoDB + Mongoose      # Database combo that scales
React Hook Form         # Forms without the form nightmares
Zod                     # Schema validation that speaks TypeScript
query-string            # URL state management made simple
```

### 🛠️ **Developer Experience**

```bash
ESLint + Prettier       # Code formatting that doesn't argue
Pino + Pino Pretty      # Logging that actually helps debug
Sonner                  # Toast notifications done elegantly
```

### 🎪 **Special Sauce**

```bash
@mdxeditor/editor       # Rich text editing that developers love
cm6-theme-basic-dark    # Code highlighting for dark theme
use-scramble            # Text animations for that extra wow
react-use-measure       # Layout measurements made easy
```

## 📚 **Bonus: The NextAuth Documentation Trilogy**

Here's something special—I've created the most comprehensive NextAuth documentation you'll find anywhere. These aren't just boring docs; they're battle-tested guides born from real debugging sessions and "aha!" moments.

### 🎯 **[The Complete Guide](./NEXTAUTH_COMPLETE_GUIDE.md)**

_Your go-to resource for mastering NextAuth_

This is where you start if you want to truly understand NextAuth. I've broken down the "waterfall pattern," explained why callbacks behave the way they do, and shown you patterns that actually work in production.

### 🔍 **[OAuth Cheat Sheet](./NEXTAUTH_OAUTH_CHEATSHEET.md)**

_Quick reference for OAuth providers_

Real callback examples, provider-specific gotchas, and data structures you can actually copy-paste. No more guessing what GitHub vs Google returns in their callbacks.

### 🕵️ **[Credentials Deep Dive](./NEXTAUTH_CREDENTIALS_GUIDE.md)**

_Born from actual debugging sessions_

This one's special—it includes real debugging discoveries, complete with the "wait, what?" moments and breakthrough realizations. If you've ever been confused about credentials authentication, this guide will save you hours.

---

## 🚀 Getting Started (The Fun Part)

### What you'll need

- **Node.js 18+** (the newer, the better)
- **MongoDB** (cloud or local, your choice)
- **A curious mind** (most important!)

### Let's build this thing!

**1. Grab the code**

```bash
git clone https://github.com/Kareem-AEz/devflow.git
cd devflow
```

**2. Install the magic**

```bash
npm install
# Grab a coffee ☕—this might take a minute
```

**3. Set up your secrets**

```bash
cp .env.example .env.local
```

Now fill in your `.env.local` with the good stuff:

```bash
# The essentials
NEXTAUTH_SECRET=your_super_secret_key_here
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=your_mongodb_connection_string

# OAuth providers (optional but recommended)
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

# Because why not?
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**4. Fire it up!**

```bash
npm run dev
```

**5. Marvel at your creation**
Open [http://localhost:3000](http://localhost:3000) and watch the magic happen! ✨

## 🎭 The Animation Philosophy

DevFlow uses **Motion** to create interactions that feel natural, not distracting. Every animation serves a purpose:

```javascript
// Search results that slide in smoothly
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.2 }}
>
  {searchResults}
</motion.div>

// Buttons that give satisfying feedback
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="your-button-classes"
>
  Click me, I feel good!
</motion.button>
```

## 🏗️ How It's Organized

```
src/
├── app/                    # Next.js App Router magic
│   ├── (auth)/            # Login/signup with smooth transitions
│   ├── (root)/            # Main app (questions, community, jobs, etc.)
│   ├── api/               # Backend routes that actually work
│   └── globals.css        # The styles that make everything pretty
├── components/
│   ├── ui/                # shadcn/ui components (the building blocks)
│   └── layout/            # Navigation, forms, search—the big pieces
├── lib/                   # The utility belt
│   ├── auth.ts           # NextAuth configuration that makes sense
│   ├── validations.ts    # Zod schemas for bulletproof forms
│   └── utils.ts          # Helper functions that save your sanity
└── database/             # MongoDB models and connections
```

## 🤝 Credits & Inspiration

This project was built by following the Full Stack Web Development course by Adrian Hajdin [from JavaScript Mastery](https://jsmastery.pro/).

The core structure, features, and implementation were guided by the course content, which provided a strong foundation for modern web development practices.

I’ve also made several customizations and improvements to the original project to extend its functionality, enhance the UI/UX, and solidify my own learning through hands-on practice.

Huge thanks to Adrian for his excellent teaching and well-structured tutorials.


The NextAuth documentation trilogy? That's my gift to the community—born from countless hours of debugging and discovery.

## 🚀 What's Next?

- Real-time notifications with WebSockets
- Advanced code highlighting themes
- AI-powered question suggestions
- More OAuth providers
- Performance optimizations that'll blow your mind

---

**Built with 💙 using the latest and greatest web technologies**

_P.S. - If you find this useful, don't forget to star the repo! It helps more developers discover these patterns and guides._
