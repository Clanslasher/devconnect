# DevConnect — Developer Social Platform

A full-stack social network built for developers. Create a profile, post updates with code snippets, follow other devs, and engage with a real-time feed.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6 |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| HTTP Client | Axios |

---

## Project Structure

```
devconnect/
├── server/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT protect + generateToken
│   ├── models/
│   │   ├── User.js            # User schema (follow, skills, etc.)
│   │   └── Post.js            # Post schema (likes, comments, code snippets)
│   ├── routes/
│   │   ├── auth.js            # POST /register, /login, GET /me
│   │   ├── users.js           # GET profile, PUT follow, search, suggestions
│   │   └── posts.js           # CRUD posts, likes, comments, trending tags
│   └── index.js               # Express app entry point
│
├── client/
│   └── src/
│       ├── components/
│       │   ├── Avatar.jsx     # Initials-based avatar with color coding
│       │   ├── CreatePost.jsx # Post composer with code snippet support
│       │   ├── Layout.jsx     # 3-column app shell
│       │   ├── PostCard.jsx   # Post with like/comment interactions
│       │   ├── RightSidebar.jsx  # Trending tags + follow suggestions
│       │   └── Sidebar.jsx    # Left nav with user info
│       ├── context/
│       │   └── AuthContext.jsx   # Global auth state + JWT management
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Feed.jsx       # Personalized feed from followed users
│       │   ├── Explore.jsx    # All posts + developer search
│       │   └── Profile.jsx    # User profile with edit modal
│       └── utils/
│           └── api.js         # Axios instance with auth interceptor
│
├── .env.example
└── package.json               # Root with concurrently scripts
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))

### 1. Clone and install

```bash
git clone <your-repo>
cd devconnect
npm run install-all
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/devconnect
JWT_SECRET=change_this_to_a_long_random_string
NODE_ENV=development
```

### 3. Run in development

```bash
npm run dev
```

This starts:
- **Backend** at `http://localhost:5000` (with nodemon)
- **Frontend** at `http://localhost:3000` (proxied to backend)

---

## API Reference

### Auth
| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create account | No |
| POST | `/api/auth/login` | Sign in | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Users
| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/users/search?q=` | Search users | Yes |
| GET | `/api/users/suggestions` | Follow suggestions | Yes |
| GET | `/api/users/:username` | Get profile + posts | Yes |
| PUT | `/api/users/profile` | Update own profile | Yes |
| PUT | `/api/users/:id/follow` | Follow / unfollow | Yes |

### Posts
| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/posts/feed` | Personalized feed | Yes |
| GET | `/api/posts/explore` | All posts (paginated) | Yes |
| GET | `/api/posts/trending-tags` | Top hashtags | Yes |
| POST | `/api/posts` | Create post | Yes |
| PUT | `/api/posts/:id/like` | Toggle like | Yes |
| POST | `/api/posts/:id/comments` | Add comment | Yes |
| DELETE | `/api/posts/:id/comments/:cid` | Delete comment | Yes |
| DELETE | `/api/posts/:id` | Delete post | Yes |

---

## Features

- **JWT Authentication** — secure login/register with 30-day tokens
- **Profile management** — name, bio, skills, location, website, GitHub, avatar
- **Post feed** — see posts from people you follow
- **Code snippets** — attach syntax-highlighted code blocks to posts
- **Hashtags** — tag posts and browse trending topics
- **Likes** — real-time like/unlike with live counts
- **Comments** — threaded comments on any post
- **Follow system** — follow/unfollow with follower counts
- **Developer search** — search users by name or username
- **Explore** — discover all posts and developers
- **Follow suggestions** — personalized recommendations

---

## Deployment

### Backend (e.g. Railway, Render, Fly.io)
Set environment variables:
- `MONGO_URI` — your Atlas connection string
- `JWT_SECRET` — a long random secret
- `NODE_ENV=production`
- `CLIENT_URL` — your deployed frontend URL

### Frontend (e.g. Vercel, Netlify)
```bash
cd client && npm run build
```
Set `REACT_APP_API_URL` if not using proxy (update `client/src/utils/api.js` baseURL).

---

## Design System

Dark terminal aesthetic with `JetBrains Mono` for code/labels and `Syne` for UI text. Violet accent (`#7c6af7`), charcoal backgrounds, and minimal borders. Every interactive element has smooth transitions and focus states.
