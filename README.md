# 🌍 LangConnect Elite: Language Teaching Marketplace

**LangConnect Elite** is a high-end MERN stack platform designed to connect professional English and French tutors with learners globally. The platform features a unique luxury aesthetic inspired by modern Fintech and Apple design systems.

## 🎯 Business Model & Monetization
The platform is built on a dual-revenue engine:

1.  **Teacher Subscriptions:** 
    *   **Basic Tier ($5/mo):** Capacity for 6 student connections.
    *   **Pro Tier ($10/mo):** Capacity for 20 student connections + Priority Search Placement.
    *   *Automatic Reset:* Student counters reset every 30 days upon successful payment.

2.  **Platform Commission:**
    *   The platform automatically collects a **15.0% commission** on all student-to-teacher lesson fees processed through the secure gateway.

---

## 🛠 Tech Stack
-   **Frontend:** React 18, Tailwind CSS v4, Lucide Icons, Socket.io-client.
-   **Backend:** Node.js, Express.js, Socket.io, Nodemailer (Email Service).
-   **Database:** MongoDB Atlas (Relational document modeling).
-   **Payments:** Swychr (AccountPe) API for Payins and Payouts.
-   **Storage:** Cloudinary (CDN for profile imagery and classroom assets).

---

## 🧑‍💻 Key Features

### For Students
-   **Elite Search:** Filter tutors by language, budget, and live rating.
-   **Responsive Portal:** Manage lessons, bookmarks, and chat history.
-   **Secure Messaging:** End-to-end private chat with tutors (Unlocked only after booking).
-   **Localized Payments:** Pay for sessions in local currency (XAF, NGN, GHS, etc.) via Swychr.

### For Teachers
-   **Subscription Gate:** Professional tools are paywalled until a monthly tier is activated.
-   **Wallet System:** Track 85% share earnings and withdraw directly to local Mobile Money or Banks.
-   **Profile Builder:** High-end biography and gallery management via Cloudinary.
-   **Usage Meter:** Real-time tracking of the 6/20 student connection limit.

### For Administrators
-   **Platform Intelligence:** Live tracking of net commission revenue and user growth.
-   **Vetting System:** Manual "Approve & Notify" workflow with automated branded emails.
-   **Account Control:** Ability to Feature top tutors or Suspend bad actors instantly.

---

## 🛡 Security & Reliability
-   **Anti-Fraud Handshake:** Every redirect from the payment gateway is verified server-side via the Swychr API before unlocking features.
-   **NoSQL Injection Protection:** All requests are sanitized using `mongo-sanitize`.
-   **Real-Time Sync:** Socket.io ensures instant message delivery and WhatsApp-style unread badges.

---
# 🌍 LangConnect Elite Marketplace

**LangConnect Elite** is a production-ready MERN marketplace architected for high-end language tutoring. It features a luxury Emerald Green & White design system inspired by Apple and modern Fintech.

## 🎯 Core Business Logic
This platform is built on two strict revenue rules:
1.  **Subscription Tiering:** Teachers pay **$5 (Basic)** for 6 student slots or **$10 (Pro)** for 20 slots. The system resets the counter every 30 days.
2.  **The 15% Split:** On every student-to-teacher lesson payment, the system calculates a **15% platform fee** and an **85% teacher share**.

---

## 🏗️ Technical Architecture

### Backend (Node/Express/MongoDB)
-   **Security Layer:** Implements `helmet`, `hpp`, `mongo-sanitize`, and `rate-limit`.
-   **Service Layer:** Business logic (Revenue math, Connection gates) is decoupled from controllers in `services/accountPeService.js`.
-   **Handshake logic:** Uses a `verifyPaymentStatus` endpoint as a fallback for the Swychr webhook. It parses data from the `remark` payload.
-   **Remark Format:** `TYPE|PLAN/CONN_ID|USER_ID/AMOUNT`. (e.g., `SUB|basic|69a...`)

### Frontend (React/Vite/Tailwind v4)
-   **Responsive Layouts:** Separate `StudentLayout` and `TeacherLayout` using mobile-drawer sidebars.
-   **Axios Interceptor:** Automatically attaches JWT tokens to every request in `AuthContext.jsx`.
-   **State Management:** High-performance use of Context API for user identity.
-   **Real-time UI:** Socket.io handles instant messaging and unread badges.

---

## 🛠️ Environment Variables (.env)
You **must** set these variables in Render and Vercel for the handshake to work:

```text
MONGO_URI= (MongoDB Atlas String)
JWT_SECRET= (Any random long string)
CLIENT_URL= https://learnlanguagehelp.site
BACKEND_URL= https://api.learnlanguagehelp.site
SWYCHR_EMAIL= xxxxxx@gmail.com
SWYCHR_PASSWORD= (Swychr Secret Password)
CLOUDINARY_CLOUD_NAME= (Cloudinary Name)
CLOUDINARY_API_KEY= (Cloudinary Key)
CLOUDINARY_API_SECRET= (Cloudinary Secret)

## 🚀 Deployment Instructions
-   **Frontend:** Deployed on **Vercel** (`learnlanguagehelp.site`).
-   **Backend:** Deployed on **Render** (`api.learnlanguagehelp.site`).
-   **Domain:** Managed via **Namecheap** with high-precision DNS A and CNAME records.

---
**Developed with High-Precision Architecture for LangConnect Elite.**