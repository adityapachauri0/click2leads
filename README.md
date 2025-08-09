# Click2Leads - Premium Lead Generation Platform

A stunning, modern lead generation website built with React, TypeScript, Node.js, and Express. Features beautiful animations, real-time analytics, and comprehensive digital marketing services showcase.

## 🚀 Features

- **Stunning UI/UX**: Modern glassmorphism design with animated gradients
- **Services Showcase**: Google Ads, Facebook, Native, Programmatic, Web Dev, Hosting
- **Interactive Analytics**: Real-time charts and performance metrics
- **Case Studies**: Dynamic portfolio with impressive results
- **Lead Generation**: Advanced contact forms with validation
- **Responsive Design**: Perfect on all devices
- **Smooth Animations**: Framer Motion powered interactions
- **Performance Optimized**: Fast loading and SEO ready

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Recharts for data visualization
- React Icons for iconography
- Axios for API calls

### Backend
- Node.js & Express
- CORS enabled
- Rate limiting
- Helmet for security
- Compression middleware

## 📦 Installation

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Setup Instructions

1. **Install Backend Dependencies**
```bash
cd backend
npm install
```

2. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Start Frontend Development Server
```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

### Build for Production
```bash
cd frontend
npm run build
```

## 📁 Project Structure

```
Click2leads_New/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── CaseStudies.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ...utilities
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   └── package.json
├── backend/
│   ├── routes/
│   │   ├── leads.js
│   │   ├── contact.js
│   │   ├── analytics.js
│   │   ├── services.js
│   │   └── caseStudies.js
│   ├── server.js
│   └── package.json
└── README.md
```

## 🎨 Features Overview

### Hero Section
- Animated gradient background
- Floating elements
- Statistics counter animation
- Call-to-action buttons

### Services Section
- 6 comprehensive service cards
- Icon animations
- Hover effects
- Feature lists

### Analytics Dashboard
- Real-time performance charts
- Channel distribution pie chart
- Conversion funnel visualization
- Key metrics display

### Case Studies
- Interactive case study selector
- Results showcase
- Client testimonials
- Industry categorization

### Pricing Plans
- 3 tier pricing structure
- Monthly/Annual toggle
- Feature comparison
- Popular plan highlight

### Contact Form
- Multi-field validation
- Budget selection
- Office information
- Social media links

## 🔧 Configuration

### Environment Variables

Backend (.env):
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key
```

Frontend (.env):
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WEBSITE_NAME=Click2Leads
```

## 📱 Responsive Design

- Mobile-first approach
- Tablet optimization
- Desktop enhancement
- Touch-friendly interactions

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `build` folder

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Deploy the backend folder

## 🔐 Security Features

- CORS configuration
- Rate limiting
- Helmet.js protection
- Input validation
- XSS prevention

## 📈 Performance

- Lazy loading components
- Image optimization
- Code splitting
- Minification
- Compression

## 🎯 SEO Ready

- Meta tags configured
- Semantic HTML
- Fast loading times
- Mobile responsive
- Structured data ready

## 💼 Business Features

- Lead capture system
- Analytics tracking
- Service showcase
- Portfolio display
- Pricing calculator
- Contact management

## 🤝 Contributing

Feel free to contribute to this project by:
1. Forking the repository
2. Creating your feature branch
3. Committing your changes
4. Pushing to the branch
5. Opening a pull request

## 📄 License

This project is proprietary to Click2Leads.

## 📞 Contact

- Website: https://click2leads.co.uk
- Email: hello@click2leads.co.uk
- Phone: +44 20 1234 5678

---

Built with ❤️ by Click2Leads - Transform Clicks Into Premium Leads