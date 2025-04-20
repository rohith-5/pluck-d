# 🥬 Pluckd - Bulk Fresh Produce Ordering Platform

Pluckd is a full-stack web application built to simplify and streamline **bulk ordering of vegetables and fruits**, supporting authentication, order tracking, and admin management — with a sleek, responsive UI.

---

## ✅ Completed Features

### 🌿 Core Functionalities
- ✅ **Product Management (CRUD)**
- ✅ **User Authentication & Authorization**
- ✅ **Cart System with React Context**
- ✅ **Order Creation & Management**
- ✅ **Order Status Updates (Admin)**
- ✅ **User-specific Order Filtering & Sorting**
- ✅ **Admin Dashboard for Order Control**
- ✅ **Product Catalogue with Filtering & Sorting**
- ✅ **Order Tracking System**
- ✅ **Order Confirmation Page**
- ✅ **My Orders Page**

---

### 💡 UI/UX Enhancements
- ✅ **Responsive & Modern Design**
- ✅ **Toast Notifications**
- ✅ **Loading States & Error Handling**
- ✅ **Form Validation**
- ✅ **Responsive Navigation Bar**

---

## 🛠 Tech Stack

- **Frontend**: React, Tailwind CSS, React Router, Context API  
- **Backend**: Node.js, Express.js  
- **Database**: PostgreSQL (via Prisma ORM)  
- **Auth**: JWT + Cookies  
- **Hosting**: [Frontend - Vercel], [Backend - Render]  
- **ORM**: Prisma (NeonDB)  

---

---

## ⚙️ Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Set your environment variables
# Example .env
DATABASE_URL=your_postgres_url
FRONTEND_URL=http://localhost:3000

# 3. Generate Prisma client & apply migration
npx prisma generate
npx prisma migrate dev --name init

# 4. Start the server
npm run dev

