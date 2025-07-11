# Wisconsin Advocacy Tool - Deployment Checklist

## Pre-Deployment Verification

### 1. Local Build Test
```bash
# Navigate to project directory
cd wisconsin-cannabis-advocacy-tool

# Install dependencies
npm install

# Run build to check for errors
npm run build

# Verify build folder contents
ls -la build/
```

### 2. File Structure Verification
Ensure these files exist:
- [x] `public/_redirects`
- [x] `public/wisconsin_assembly.csv`
- [x] `public/wisconsin_senators.csv` 
- [x] `public/wisconsin_districts.csv`
- [x] `netlify.toml` (with security headers)
- [x] `src/WisconsinAdvocacyTool.js` (updated version)
- [x] `tests/deployment-testing.js`

### 3. Code Quality Check
- [ ] No console errors in browser dev tools
- [ ] All components render correctly
- [ ] Form validation works
- [ ] ZIP code extraction functions properly
- [ ] Error handling displays correctly

## Deployment Commands

### Step 1: Commit All Changes ✅ COMPLETED
```bash
# Check git status
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "Production ready: Add disclaimers, validation, and security headers"

# Push to main branch
git push origin main
```

**Status: ✅ All critical updates have been committed to the repository**

### Step 2: Netlify Deployment
1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and select your repository: `KO-Tools/wisconsin-cannabis-advocacy-tool`
   - Netlify will auto-detect build settings from `netlify.toml`

2. **Verify Build Settings** (should be auto-detected):
   - Build command: `npm run build`
   - Publish directory: `build/`
   - Node version: 18

3. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete (2-3 minutes)
   - Note the auto-generated URL

### Step 3: Custom Domain (Optional)
```bash
# If you have a custom domain
# In Netlify dashboard:
# 1. Go to Site settings → Domain management
# 2. Add custom domain (e.g., advocacy.kindoasis.com)
# 3. Update DNS records as instructed
# 4. SSL certificate will be automatically generated
```

## Post-Deployment Testing

### 1. ZIP Code Testing
Test these specific ZIP codes:
- [ ] **53703** (Madison) → Should find Kelda Roys (Senator) & Renuka Mayadev (Rep)
- [ ] **53202** (Milwaukee) → Should find Dora Drake (Senator) & Darrin Madison (Rep)
- [ ] **54301** (Green Bay) → Should find Eric Wimberger (Senator) & Benjamin Franklin (Rep)
- [ ] **53140** (Kenosha) → Should find Robert Roth (Senator) & Bob Donovan (Rep)
- [ ] **53401** (Racine) → Should find Van Wanggaard (Senator) & Angelina Cruz (Rep)

### 2. Email Testing
For each test address:
- [ ] Email client opens correctly
- [ ] Recipients are pre-filled (both Senator and Representative)
- [ ] Subject line appears correctly
- [ ] Letter content is properly formatted
- [ ] No encoding issues

### 3. Browser Testing
Test on:
- [ ] Chrome (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (desktop)
- [ ] Safari (mobile)
- [ ] Firefox (desktop)
- [ ] Edge (desktop)

### 4. Device Testing
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Large mobile (414x896)

### 5. Performance Testing
- [ ] Initial load time < 2 seconds
- [ ] CSV data loads without errors
- [ ] No JavaScript errors in console
- [ ] Form submissions are responsive
- [ ] Image loading (with fallbacks)

### 6. Security Verification
Check network tab for:
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] No mixed content warnings
- [ ] CSP policy working correctly

## Testing Commands

### Run Testing Suite
```javascript
// Open browser console on deployed site and run:
runAllTests();

// Individual test functions:
testZipCodeLookup(testZipCodes);
testBrowserCompatibility();
testEmailClients();
testPerformance();
testAccessibility();
```

## Error Monitoring

### Common Issues to Watch For:
1. **CSV Loading Failures**
   - Check file paths are correct
   - Verify CSV format is valid
   - Monitor network tab for 404 errors

2. **ZIP Code Lookup Failures**
   - Test edge cases (rural areas, new developments)
   - Verify data completeness in CSV files

3. **Email Client Issues**
   - Some corporate networks block mailto links
   - Long URLs may be truncated
   - Special characters may need encoding

### Debug Steps:
```javascript
// Run in browser console after deployment:
runAllTests();

// Check for specific errors:
console.log('Legislator data loaded:', window.legislatorDataLoaded);
console.log('CSV parse errors:', window.csvParseErrors);
```

## Success Criteria

✅ **Deployment is successful when:**
- [ ] All 5 test ZIP codes return correct representatives
- [ ] Email generation works in Gmail, Outlook, and Apple Mail
- [ ] Site loads in < 2 seconds on fast connection
- [ ] Mobile navigation works smoothly
- [ ] All 4 letter types generate properly
- [ ] No console errors on page load
- [ ] Form validation provides clear feedback
- [ ] User disclaimer is visible and functional

## Updates Completed ✅

### Critical Code Updates
- [x] **User Disclaimer**: Added with verification link to legis.wisconsin.gov
- [x] **Enhanced ZIP Code Validation**: Improved error messaging
- [x] **Error Logging**: Added comprehensive production error logging

### Required Files
- [x] **`public/_redirects`**: Created for Netlify SPA routing support
- [x] **Updated `netlify.toml`**: Added security headers including CSP

### Testing Implementation
- [x] **Testing Script**: Created in `tests/deployment-testing.js`
- [x] **Test ZIP Codes**: All 5 test cases ready for validation

### Repository Status
- [x] All updates committed to GitHub repository
- [x] Ready for Netlify deployment
- [x] Documentation created for testing and monitoring

## Rollback Plan

If issues are found post-deployment:
```bash
# Quick fix via file upload
# 1. Fix issue locally
# 2. Test with npm run build
# 3. Drag build/ folder to Netlify deploy interface

# Or rollback to previous version
# 1. In Netlify dashboard, go to Deploys
# 2. Find last working version
# 3. Click "Publish deploy"
```

## Monitoring

After deployment, monitor:
- [ ] Netlify build logs for errors
- [ ] User feedback on representative accuracy
- [ ] Browser console errors (if analytics implemented)
- [ ] Email delivery success rates

---

**🎉 Ready for Deployment!**

All critical updates have been implemented and committed to the GitHub repository. The Wisconsin Cannabis Advocacy Letter Tool is now production-ready with:

- Enhanced security headers
- User disclaimers and validation
- Comprehensive error logging
- Testing utilities
- Complete deployment documentation

**Next Steps:**
1. Deploy to Netlify using GitHub integration
2. Run the provided testing suite
3. Verify all ZIP codes and email functionality
4. Monitor performance and user feedback