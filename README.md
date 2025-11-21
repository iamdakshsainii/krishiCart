# krishiCart

**krishiCart** is a full-stack web application developed during a hackathon to bridge the gap between farmers and consumers. It enables farmers to showcase their produce, connect directly with buyers, and build trust — all within one scalable digital platform.


---

## 💡 Challenge (Given Scenario)

Many farmers struggle with:

- Limited or no digital presence
- Dependence on middlemen reducing their profits
- Lack of direct connection and trust with consumers
- No centralized online marketplace for their goods

**KisanBazar** addresses these problems by providing a direct, transparent platform connecting farmers and consumers.

---

## ✅ Features & Functionality

| Role       | Features                                                                                  |
|------------|-------------------------------------------------------------------------------------------|
| 👨‍🌾 Farmer  | Register, login, create profile, list and manage products, view & reply to messages       |
| 🛒 Consumer | Browse listings by category or farmer, message farmers, place order requests               |
| 🛠️ Admin   | Manage users, products, orders, categories through dashboard                              |
| 🔐 Auth    | Secure JWT-based role access & user authentication                                       |
| 🌿 Real-Time| Messaging system for instant communication between farmers and consumers                  |
| 📦 Orders   | Place, view, and manage orders with secure checkout                                     |
| 📊 Analytics| Admin overview with insights and management tools                                       |

---

## 🛠️ Technologies Used

- **Frontend:** React.js, Tailwind CSS, React Redux
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT (JSON Web Tokens)
- **Real-time Communication:** Socket.io
- **Deployment:** Vercel

---

## 📁 Project Structure

### Frontend (`client/`)

client/
├── public/ # Static public files (e.g., logo.png)
├── src/
│ ├── assets/ # Images and media assets
│ ├── components/ # Reusable React components
│ ├── pages/ # React pages
│ ├── redux/ # Redux state slices
│ ├── utils/ # Utility functions (e.g., socket.js)
│ ├── App.jsx # React Router setup and main app
│ └── main.jsx # React app entry point
├── index.html # Main HTML template
└── .env # Environment variables (e.g., VITE_BACKEND_URL)


### Backend (`api/`)

api/
├── controllers/ # Express route controllers / business logic
├── db/ # MongoDB connection setup
├── models/ # Mongoose schemas
├── routes/ # Express API routing modules
├── utils/ # Helper utilities (e.g., auth middleware)
├── .env # Backend environment variables
└── index.js # Main Express server with Socket.io setup

---

## 🚀 Getting Started (Setup Instructions)

### Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn package manager
- MongoDB Atlas account or local MongoDB instance
- VS Code or preferred code editor

### Installation

#### 1. Clone the repository

git clone
cd krishiCart

text

#### 2. Setup Backend

cd api

text

Create `.env` file in `api/` and add the following variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=90d

text

Install backend dependencies:

npm install

text

Start backend server with Nodemon:

npm run dev

text

#### 3. Setup Frontend

Open a new terminal window/tab.

cd client

text

Create `.env` file in `client/` with the backend API URL:

VITE_BACKEND_URL=http://localhost:5000

text

Install frontend dependencies:

npm install

text

Start the frontend development server:

npm run dev

text

<<<<<<< HEAD
---

## 📦 Usage

- Access frontend via [http://localhost:5173](http://localhost:5173)
- Backend APIs run on [http://localhost:5000](http://localhost:5000)
- Register as Farmer or Consumer, explore, message, and order!

---
---

## 📞 Contact

For issues, inquiries, or collaboration opportunities, reach out to:

- **Daksh Saini**
- Email: [sainidaksh70@gmail.com](mailto:sainidaksh70@gmail.com)

---
=======
>>>>>>> f2d6e6f154bd08af8c605d6ad2ddf261e2b6071f
