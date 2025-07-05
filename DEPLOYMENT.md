# 🚀 Netlify Deployment Guide

This guide will walk you through deploying your Wisconsin Cannabis Advocacy Letter Tool to Netlify.

## 📋 Prerequisites

- GitHub account (to fork this repository)
- A Netlify account (free at [netlify.com](https://netlify.com))
- Optional: Node.js 18+ for local development

## 🎯 Deployment Methods

### Method 1: GitHub Integration (Recommended)

This method provides automatic deployments when you push changes.

1. **Fork this repository**:
   - Click the "Fork" button on this GitHub repository
   - This creates your own copy of the code

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com) and sign up/login
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize Netlify to access your repositories
   - Select your forked `wisconsin-cannabis-advocacy-tool` repository

3. **Configure build settings** (should auto-detect):
   - Build command: `npm run build`
   - Publish directory: `build`
   - The `netlify.toml` file will handle these automatically

4. **Deploy**:
   - Click "Deploy site"
   - Netlify will build and deploy automatically
   - Your site will be live in 2-3 minutes!
   - Future pushes to the main branch will trigger automatic deployments

### Method 2: Manual Deployment (Quick Testing)

For quick testing or if you don't want to use GitHub integration.

1. **Download the repository**:
   - Click "Code" → "Download ZIP" on this GitHub page
   - Extract the files to your computer

2. **Build locally** (optional, for testing):
   ```bash
   cd wisconsin-cannabis-advocacy-tool
   npm install
   npm run build
   ```

3. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Sites" → "Add new site" → "Deploy manually"
   - Drag and drop the entire project folder (or just the `build/` folder if you built locally)
   - Your site will be live immediately!

## ⚙️ Configuration Details

The included `netlify.toml` file automatically configures:
- **Build settings**: Node.js 18, npm build command
- **Redirects**: Single Page Application routing support
- **Security headers**: XSS protection, content security policy
- **Optimization**: CSS/JS minification and bundling

## 🔧 Post-Deployment Setup

### 1. Custom Domain (Optional)
- In Netlify dashboard: Site settings → Domain management
- Add your custom domain (e.g., `advocacy.kindoasis.com`)
- Netlify provides free SSL certificates automatically

### 2. Environment Variables (For Production Features)

If you plan to add real services, configure these in Netlify:
- Go to: Site settings → Environment variables
- Add variables like:
  - `REACT_APP_GEOCODING_API_KEY` - For address-to-district mapping
  - `REACT_APP_ANALYTICS_ID` - For tracking user interactions

### 3. Real Legislator Data Integration

To use your actual CSV files instead of sample data:

1. **Upload CSV files** to the `public/` folder in your repository:
   - `wisconsin_legislators.csv`
   - `wisconsin_senators.csv`

2. **Update the component** to load real data:
   - Edit `src/WisconsinAdvocacyTool.js`
   - Replace the `sampleLegislators` array with CSV loading code
   - Use the Papa Parse library (already included) to parse CSV data

3. **Commit and push** your changes - Netlify will automatically redeploy

## 📊 Analytics Setup

### Google Analytics Integration

1. **Create GA4 property** at [analytics.google.com](https://analytics.google.com)

2. **Add tracking code** to `public/index.html`:
   ```html
   <!-- Google tag (gtag.js) -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

3. **Track advocacy actions** in the component:
   ```javascript
   // Track when users successfully send letters
   const generateEmail = () => {
     // ... existing email generation code
     
     // Track the advocacy action
     if (window.gtag) {
       gtag('event', 'advocacy_letter_sent', {
         letter_type: selectedLetter,
         user_district: representatives.senator?.District
       });
     }
   };
   ```

## 🛠️ Troubleshooting

### Build Errors

**"Module not found"**:
- Ensure all files are in the correct folder structure
- Check that `package.json` is in the root directory

**"npm command failed"**:
- Verify Node.js version is 18 or higher in Netlify settings
- Check that all dependencies are listed in `package.json`

**Tailwind CSS not working**:
- Ensure `index.css` includes the Tailwind imports
- Consider adding a `tailwind.config.js` file for custom configuration

### Runtime Errors

**White screen after deployment**:
- Check the browser console for JavaScript errors
- Verify all file paths use relative imports
- Ensure all required components are properly exported

**Styles not loading correctly**:
- Verify CSS files are properly imported in JavaScript
- Check that Tailwind classes are being processed correctly

**Representatives not found**:
- Confirm CSV files are in the `public/` folder
- Check CSV file format matches expected structure
- Verify fetch requests use correct file paths

### Common Issues

1. **Missing Tailwind CSS**:
   - Install if needed: `npm install -D tailwindcss postcss autoprefixer`
   - Initialize: `npx tailwindcss init -p`
   - Configure content paths in `tailwind.config.js`

2. **CSV Loading Problems**:
   - Files must be in `public/` folder, not `src/`
   - Use relative paths: `/wisconsin_legislators.csv`
   - Check browser network tab for 404 errors

3. **Email Client Issues**:
   - Test that `mailto:` links work in target browsers
   - Some corporate environments block mailto links
   - Consider adding copy-to-clipboard fallback

## 🔒 Security Best Practices

The `netlify.toml` includes security headers, but also consider:

- **Rate Limiting**: Implement if you add external API calls
- **Input Validation**: Already included for form fields
- **Privacy Policy**: Add if collecting any user data
- **GDPR Compliance**: Consider if serving European users

## 📈 Performance Optimization

Already optimized:
- ✅ React code splitting
- ✅ Minified CSS/JS
- ✅ Compressed images
- ✅ Fast loading (<2 second target)

Additional optimizations:
- Add service worker for offline functionality
- Implement lazy loading for representative photos
- Use CDN for static assets
- Compress advocacy letter content

## 🎉 Launch Checklist

Before making your site public:

- [ ] Test form validation with various inputs
- [ ] Verify email generation works across browsers
- [ ] Check responsive design on mobile devices
- [ ] Test accessibility with screen reader
- [ ] Validate all advocacy letter content for accuracy
- [ ] Set up analytics tracking
- [ ] Configure custom domain (if desired)
- [ ] Test with real Wisconsin addresses
- [ ] Review and approve all letter templates
- [ ] Ensure contact information is accurate

## 📞 Support Resources

**For deployment issues**:
1. Check Netlify build logs in your dashboard
2. Review browser console for runtime errors
3. Test locally first: `npm install && npm start`
4. Check Netlify's excellent documentation: [docs.netlify.com](https://docs.netlify.com)

**For code modifications**:
1. Review the React documentation: [reactjs.org](https://reactjs.org)
2. Check Tailwind CSS docs: [tailwindcss.com](https://tailwindcss.com)
3. Papa Parse CSV library: [papaparse.com](https://papaparse.com)

**For business questions**:
- Contact Kind Oasis directly through their website
- Review the original Product Requirements Document

---

**🌿 Your Wisconsin Cannabis Advocacy Tool is ready to help residents make their voices heard! 📧**

*After deployment, share the link with Wisconsin residents to start making an impact on cannabis legalization efforts.*