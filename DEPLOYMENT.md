# 🚀 Deployment Guide

This guide will help you deploy your CoEv platform to GitHub Pages and make it live online.

## 📋 Prerequisites

1. **GitHub Account**: You need a GitHub account
2. **Git**: Install Git on your computer
3. **All project files**: Make sure all your files are ready

## 🎯 Step-by-Step Deployment

### **Step 1: Create GitHub Repository**

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository: `coev-platform`
5. Make it **Public** (required for free GitHub Pages)
6. **Don't** initialize with README (we already have one)
7. Click "Create repository"

### **Step 2: Upload Your Files**

#### **Option A: Using GitHub Desktop (Easiest)**
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Clone your repository
3. Copy all your project files to the repository folder
4. Commit and push to GitHub

#### **Option B: Using Git Commands**
```bash
# Navigate to your project folder
cd path/to/your/frontend

# Initialize git repository
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: CoEv Platform"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/coev-platform.git

# Push to GitHub
git push -u origin main
```

### **Step 3: Enable GitHub Pages**

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section (in the left sidebar)
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch
6. Select "/ (root)" folder
7. Click "Save"

### **Step 4: Your Site is Live!**

Your website will be available at:
```
https://YOUR_USERNAME.github.io/coev-platform
```

## 🔧 Custom Domain (Optional)

If you want a custom domain:

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In GitHub Pages settings, add your custom domain
3. Update your DNS settings with your domain provider
4. Add a `CNAME` file to your repository with your domain name

## 📱 Testing Your Deployment

1. **Wait 5-10 minutes** for GitHub Pages to build your site
2. Visit your live URL
3. Test all functionality:
   - Navigation between pages
   - Student/Club registration
   - Event creation
   - Certificate uploads
   - Search and filtering

## 🐛 Troubleshooting

### **Common Issues:**

1. **Site not loading**: Check if GitHub Pages is enabled
2. **Broken links**: Ensure all file paths are correct
3. **Missing styles**: Check if CSS files are properly linked
4. **JavaScript errors**: Open browser console to debug

### **Debug Steps:**

1. Check browser console for errors
2. Verify all files are uploaded to GitHub
3. Ensure file names match exactly (case-sensitive)
4. Test locally before deploying

## 🔄 Updating Your Site

To update your live site:

```bash
# Make your changes locally
# Then commit and push
git add .
git commit -m "Update: [describe your changes]"
git push
```

GitHub Pages will automatically rebuild your site with the new changes.

## 📊 Analytics (Optional)

To track visitors:

1. Go to your repository settings
2. Scroll to "Pages" section
3. Check "Google Analytics" if you have an account

## 🎉 Success!

Your CoEv platform is now live and accessible to anyone on the internet!

**Live URL**: `https://YOUR_USERNAME.github.io/coev-platform`

---

**Need help?** Open an issue on your GitHub repository or check GitHub's documentation. 