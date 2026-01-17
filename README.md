# Comment System API

A robust, standalone comment system backend built with Node.js, Express, and Mongoose. It supports nested replies, likes/dislikes with mutual exclusion, and user-specific status (isLiked/isDisliked).

## 🚀 Features

- **Global Comment Feed**: Simple and efficient comment management.
- **Nested Replies**: Users can reply to any comment.
- **Mutual Exclusion Likes**: Liking a comment removes a dislike and vice-versa.
- **Smart Response**: Returns `isLiked` and `isDisliked` based on the authenticated user.
- **Authentication**: Secure JWT-based auth.
- **Rich Tech Stack**: TypeScript, Zod, Winston, Socket.io.

## 🛠 Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Validation**: Zod
- **Auth**: JWT & Bcrypt
- **Logs**: Winston & Morgan
- **Real-time**: Socket.io

## 🚦 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas or local instance

### Installation

1. Clone the repo:

      ```bash
      git clone <repo-url>
      cd folder-name
      ```

2. Install dependencies:

      ```bash
      yarn install
      ```

3. Configure environment:
   Create a `.env` file from `.env.example`.

4. Run dev server:
      ```bash
      yarn dev
      ```

## 📖 API Endpoints

### Comments

- `GET /api/v1/comments` - Fetch all comments (supports sorting & pagination)
- `POST /api/v1/comments` - Create new comment
- `POST /api/v1/comments/:id/reply` - Reply to a comment
- `PATCH /api/v1/comments/:id/like` - Like/Unlike a comment
- `PATCH /api/v1/comments/:id/dislike` - Dislike/Undislike a comment
- `PATCH /api/v1/comments/:id` - Update comment
- `DELETE /api/v1/comments/:id` - Delete comment

### Auth & Users

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/users/create-user` - Register user
- `GET /api/v1/users/profile` - Get profile

## 📝 License

Distributed under the MIT License.
