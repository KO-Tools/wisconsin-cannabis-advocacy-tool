# Wisconsin Cannabis Advocacy Letter Tool

A modern web application that helps Wisconsin residents easily contact their state legislators about cannabis legalization. Built for Kind Oasis to streamline grassroots advocacy efforts.

## 🎯 Purpose

This tool transforms the complex process of contacting state representatives into a simple 3-step experience:
1. **Enter your information** - Name and Wisconsin address
2. **View your representatives** - See your state senator and representative
3. **Send a letter** - Choose from 4 advocacy letter templates and email both legislators

## ✨ Features

- **Address-based legislator lookup** for Wisconsin state senators and representatives
- **4 pre-written advocacy letter templates** focusing on different aspects:
  - Economic Benefits Focus
  - Criminal Justice Reform Focus
  - Medical Benefits Focus
  - Personal Freedom and Public Safety Focus
- **Email client integration** with pre-filled recipient, subject, and message
- **Responsive design** that works on desktop and mobile devices
- **Clean, accessible interface** following WCAG guidelines
- **Kind Oasis branding** with custom color scheme
- **Enhanced modern UI** with gradients, glassmorphism effects, and professional styling

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/KO-Tools/wisconsin-cannabis-advocacy-tool.git
cd wisconsin-cannabis-advocacy-tool
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Open your browser** to `http://localhost:3000`

### Production Build

```bash
npm run build
```

This creates a `build/` folder with optimized production files.

## 🌐 Netlify Deployment

### Easy Deployment

1. **Fork this repository** on GitHub

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and select your forked repository
   - Netlify will automatically detect the build settings from `netlify.toml`

3. **Deploy**:
   - Click "Deploy site"
   - Your site will be live in minutes!
   - Future pushes to main branch will trigger automatic deployments

### Manual Deployment Alternative

1. **Build locally**: `npm run build`
2. **Drag and drop** the `build/` folder to Netlify

## 📁 Project Structure

```
wisconsin-cannabis-advocacy-tool/
├── public/
│   ├── index.html          # HTML template
│   ├── wisconsin_assembly.csv    # Assembly representatives data
│   ├── wisconsin_senators.csv    # State senators data
│   └── wisconsin_districts.csv   # ZIP code to district mapping
├── src/
│   ├── App.js              # Main app component
│   ├── App.css             # App-specific styles
│   ├── index.js            # Entry point
│   ├── index.css           # Global styles with Tailwind
│   └── WisconsinAdvocacyTool.js  # Main tool component
├── package.json            # Dependencies and scripts
├── netlify.toml           # Netlify configuration
└── README.md              # This file
```

## 🎨 Design System

### Colors
- **Primary**: #155756 (Deep teal)
- **Secondary**: #88AEAD (Sage green)
- **Accent**: #ADEEEE (Light aqua)
- **Background**: #F1F2F3 (Light gray)

### Typography
- Clean, readable fonts with minimum 16px for body text
- Hierarchical heading structure for accessibility

## 🔧 Customization

### Adding Real Legislator Data

The tool now includes complete Wisconsin legislator data:
- Full assembly and senate rosters with contact information
- ZIP code to legislative district mapping
- Representative photos and party affiliations

### Adding Address-to-District Mapping

1. **Choose a geocoding service** (Google Maps, Mapbox, etc.)
2. **Add API key** to environment variables
3. **Update the `findRepresentatives` function** to call the geocoding API
4. **Map coordinates to Wisconsin legislative districts**

### Customizing Letters

Edit the `advocacyLetters` object in `WisconsinAdvocacyTool.js` to:
- Add new letter templates
- Modify existing content
- Change subjects and focus areas

## 📊 Analytics & Tracking

The tool is ready for analytics integration. Add your preferred tracking:
- Google Analytics
- Mixpanel
- Custom event tracking

Track key metrics like:
- Form completion rates
- Letter selections
- Geographic distribution of users

## 🛡️ Security Features

- HTTPS enforcement via Netlify
- XSS protection headers
- Content Security Policy
- No user data storage (privacy-first)
- Rate limiting (to be implemented)

## 🌟 Performance

- Optimized React build with code splitting
- Responsive images and lazy loading
- Minimal external dependencies
- Fast loading times (<2 seconds target)

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

This tool was built according to the specifications in the Product Requirements Document. For modifications:

1. Fork the repository
2. Create a feature branch
3. Test changes thoroughly
4. Ensure accessibility compliance
5. Maintain responsive design
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For technical issues or questions about deployment:
- Check the browser console for error messages
- Verify all required files are present
- Ensure Node.js version compatibility
- Open an issue on GitHub

For business questions about Kind Oasis advocacy efforts:
- Contact Kind Oasis directly through their website

---

**Built with ❤️ for Wisconsin cannabis advocacy**

*This tool helps Wisconsin residents make their voices heard on cannabis legalization while supporting responsible businesses like Kind Oasis.*

**Latest Update**: Enhanced UI with modern design elements, complete Wisconsin legislator database, and improved user experience.