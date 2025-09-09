# 📋 Complete Upload Checklist

## **CRITICAL: Before Uploading**

### **1. Verify All Files Are Present**
Make sure you have ALL these files in your project folder:

```
✅ index.html
✅ student.html
✅ events.html
✅ calendar.html
✅ recruitments.html
✅ feedback.html
✅ club.html
✅ student-login.html
✅ student-signup.html
✅ club-login.html
✅ club-signup.html
✅ club-edit.html
✅ TEST-DEPLOYMENT.html (new test file)
✅ README.md
✅ LICENSE
✅ .gitignore
✅ package.json
✅ DEPLOYMENT.md
✅ UPLOAD-CHECKLIST.md

✅ assets/style.css
✅ assets/script.js
✅ assets/light-rays-bg.js
✅ assets/silk-bg.js
✅ assets/LiquidChrome.js
```

### **2. Test Locally First**
1. Open `TEST-DEPLOYMENT.html` in your browser
2. You should see:
   - ✅ Purple gradient background
   - ✅ Styled navbar with "CoEv" logo
   - ✅ White text on purple background
   - ✅ Proper fonts and styling

If this test page doesn't work, **DO NOT UPLOAD** until it's fixed.

## **Step-by-Step Upload Process**

### **Step 1: Create GitHub Repository**
1. Go to [GitHub.com](https://github.com)
2. Click "+" → "New repository"
3. Name: `coev-platform`
4. Make it **PUBLIC**
5. **DO NOT** add README, .gitignore, or license (we have them)
6. Click "Create repository"

### **Step 2: Upload Using GitHub Desktop (Recommended)**

#### **Option A: GitHub Desktop**
1. Download [GitHub Desktop](https://desktop.github.com)
2. Install and sign in
3. Clone your repository
4. Copy ALL files to the repository folder
5. Commit and push

#### **Option B: Drag & Drop to GitHub**
1. Go to your repository on GitHub
2. Click "uploading an existing file"
3. Drag ALL files and folders
4. Commit changes

### **Step 3: Verify Upload**
After uploading, check your repository has:
- [ ] All HTML files
- [ ] `assets/` folder with all CSS/JS files
- [ ] All documentation files

### **Step 4: Enable GitHub Pages**
1. Go to repository Settings
2. Scroll to "Pages" (left sidebar)
3. Source: "Deploy from a branch"
4. Branch: "main"
5. Folder: "/ (root)"
6. Click "Save"

### **Step 5: Test Your Live Site**
1. Wait 5-10 minutes
2. Visit: `https://YOUR_USERNAME.github.io/coev-platform`
3. Test: `https://YOUR_USERNAME.github.io/coev-platform/TEST-DEPLOYMENT.html`

## **🔧 Troubleshooting**

### **If the site looks broken:**

#### **1. Check File Structure**
Your GitHub repository should look like this:
```
coev-platform/
├── index.html
├── student.html
├── events.html
├── calendar.html
├── recruitments.html
├── feedback.html
├── club.html
├── student-login.html
├── student-signup.html
├── club-login.html
├── club-signup.html
├── club-edit.html
├── TEST-DEPLOYMENT.html
├── README.md
├── LICENSE
├── .gitignore
├── package.json
├── DEPLOYMENT.md
├── UPLOAD-CHECKLIST.md
└── assets/
    ├── style.css
    ├── script.js
    ├── light-rays-bg.js
    ├── silk-bg.js
    └── LiquidChrome.js
```

#### **2. Check Browser Console**
1. Open your live site
2. Press F12 to open developer tools
3. Check "Console" tab for errors
4. Look for 404 errors (missing files)

#### **3. Common Issues & Fixes**

**Issue: White background instead of purple**
- **Cause**: CSS file not loading
- **Fix**: Check if `assets/style.css` is uploaded

**Issue: No navbar**
- **Cause**: CSS or HTML structure broken
- **Fix**: Verify all files are uploaded

**Issue: Broken links**
- **Cause**: File paths incorrect
- **Fix**: Ensure all files are in correct folders

**Issue: Missing fonts**
- **Cause**: Google Fonts not loading
- **Fix**: Check internet connection, fonts load from Google

## **🎯 Success Criteria**

Your site is working correctly if:
- ✅ Purple gradient background is visible
- ✅ Navbar appears with "CoEv" logo
- ✅ All navigation links work
- ✅ Test page loads with proper styling
- ✅ No console errors

## **📞 If Still Broken**

1. **Check the test page first**: `YOUR_SITE/TEST-DEPLOYMENT.html`
2. **Compare with local version**: Open files locally vs online
3. **Check file sizes**: Ensure all files uploaded completely
4. **Try different browser**: Clear cache and try incognito mode

## **🚀 Quick Fix Commands**

If you need to re-upload:
```bash
git add .
git commit -m "Fix: Complete file upload"
git push
```

---

**Remember**: The test page (`TEST-DEPLOYMENT.html`) will help you verify everything is working before the main site goes live! 