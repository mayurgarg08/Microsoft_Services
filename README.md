# Innoviez: Microsoft Solutions Partner Website

A modern, animated marketing website for **Innoviez**, a Microsoft Solutions Partner offering Dynamics 365, Power Platform, Microsoft 365 / Copilot and Azure services. The site is a single-page React app with a dark/light theme. An Express server is scaffolded alongside it for future backend features.

## Features

- **Hero section** with animated gradient text and a call to action
- **Mega-menu navigation** for Services, Dynamics & Power Platform, and Industries
- **Services grid:** Dynamics 365 implementation, Microsoft 365 & Copilot, Power BI & reporting, Azure cloud & infrastructure, Power Platform automation, managed support
- **Credentials / case studies:** Purview sensitivity labels, a Copilot readiness assessment, a SharePoint intranet
- **About**, **Industries** and **client testimonials** sections
- **Contact form** section
- **Dark / light mode** toggle (dark by default)
- Scroll-triggered fade-up animations and a fully responsive layout

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React 19, Vite 8, Tailwind CSS 3, Lucide React |
| Backend (scaffold) | Node.js, Express 5, Mongoose, bcrypt, JSON Web Token |

## Project structure

```
client/
  src/
    components/Homepage.jsx   all page sections (navbar, hero, services, credentials,
                              about, industries, contact, footer)
    App.jsx
    main.jsx
server/
  Server.js                   Express server (health route on port 5000)
```

## Getting started

### Prerequisites
- Node.js 18+

### Run the frontend

```bash
cd client
npm install
npm run dev        # http://localhost:5173
```

Build for production:

```bash
npm run build
npm run preview
```

### Run the server (optional)

```bash
cd server
npm install
node Server.js     # http://localhost:5000
```

The server only exposes a health-check route for now. The dependencies for MongoDB, auth and JWT are already installed for upcoming features such as saving contact-form submissions.

## Roadmap

- [ ] Save contact-form submissions to MongoDB through the Express API
- [ ] Admin login to view enquiries
- [ ] Deploy the client (Vercel / Netlify)

## Author

**Mayur Garg** · [GitHub](https://github.com/mayurgarg08) · [LinkedIn](https://www.linkedin.com/in/mayur-garg-428a291b4/)
