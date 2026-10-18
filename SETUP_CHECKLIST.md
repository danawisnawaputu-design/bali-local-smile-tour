# ✅ Setup & Deployment Checklist

## Phase 1: Initial Setup (Local Development)

### 1.1 Install Dependencies
- [ ] Run `npm install`
- [ ] Verify no errors in console
- [ ] Check node_modules folder created

### 1.2 Setup Supabase Account
- [ ] Create account at https://supabase.com
- [ ] Create new project
- [ ] Wait for project to be ready
- [ ] Note down Project URL and Anon Key

### 1.3 Create Database Tables
- [ ] Open Supabase SQL Editor
- [ ] Copy SQL script from QUICK_START.md
- [ ] Run the script
- [ ] Verify 5 tables created:
  - [ ] activities
  - [ ] tours
  - [ ] fast_boat
  - [ ] nusa_penida
  - [ ] drop_pickup

### 1.4 Setup Environment Variables
- [ ] Copy `.env.example` → `.env.local`
- [ ] Edit `.env.local`
- [ ] Add VITE_SUPABASE_URL
- [ ] Add VITE_SUPABASE_ANON_KEY
- [ ] Save file

### 1.5 Verify Local Setup
- [ ] Run `npm run dev`
- [ ] Open http://localhost:5173
- [ ] Check browser console (F12) for errors
- [ ] Verify no "Supabase variables missing" warning

## Phase 2: Local Testing

### 2.1 Test Data Loading
- [ ] Open Activities page
- [ ] Verify activities load (or show default data)
- [ ] Check console for any errors

### 2.2 Test Real-time Sync (2 Browser Tabs)
- [ ] Open http://localhost:5173 in Tab 1
- [ ] Open http://localhost:5173 in Tab 2
- [ ] Go to Admin panel in Tab 1 (click login if needed)
- [ ] Add new Activity in Tab 1
- [ ] Click Save
- [ ] Go to Activities page in Tab 2
- [ ] [ ] Verify new activity appears WITHOUT page refresh!
- [ ] [ ] Check console for "Real-time update:" message

### 2.3 Test Edit & Delete Operations
- [ ] Edit existing activity in Tab 1
- [ ] [ ] Verify change appears in Tab 2 instantly
- [ ] Delete an activity in Tab 1
- [ ] [ ] Verify it disappears from Tab 2

### 2.4 Test All Data Types
- [ ] [ ] Test Activities sync
- [ ] [ ] Test Tours sync
- [ ] [ ] Test FastBoat sync
- [ ] [ ] Test NusaPenida sync
- [ ] [ ] Test DropPickup sync

### 2.5 Production Build Test
```bash
npm run build
npm run preview
```
- [ ] Build completes without errors
- [ ] Open http://localhost:4173
- [ ] [ ] Verify pages load
- [ ] [ ] Verify data appears
- [ ] [ ] No console errors

## Phase 3: GitHub Setup

### 3.1 Version Control
- [ ] Initialize git (if not already)
  ```bash
  git init
  git add .
  git commit -m "Initial commit with real-time sync"
  ```
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Verify all files uploaded

### 3.2 .gitignore Verification
- [ ] Check .gitignore exists
- [ ] Verify `.env.local` is in .gitignore (NOT tracked)
- [ ] Verify `node_modules/` is in .gitignore
- [ ] Verify `dist/` is in .gitignore

## Phase 4: Netlify Deployment

### 4.1 Netlify Account Setup
- [ ] Create Netlify account
- [ ] Login to dashboard

### 4.2 Connect GitHub Repository
- [ ] Click "Add new site"
- [ ] Choose "Import an existing project"
- [ ] Select GitHub provider
- [ ] Authorize Netlify access to GitHub
- [ ] Select your repository
- [ ] Select main/master branch

### 4.3 Configure Build Settings
- [ ] Verify Build command: `npm run build`
- [ ] Verify Publish directory: `dist`
- [ ] Click "Deploy site"
- [ ] Wait for build to complete (5-10 minutes)

### 4.4 Add Environment Variables
- [ ] Site settings → Environment variables
- [ ] Add new variable:
  - [ ] Name: `VITE_SUPABASE_URL`
  - [ ] Value: (paste your Supabase URL)
- [ ] Add new variable:
  - [ ] Name: `VITE_SUPABASE_ANON_KEY`
  - [ ] Value: (paste your Supabase anon key)
- [ ] Save
- [ ] Trigger re-deploy

### 4.5 Verify Deployment
- [ ] Check deploy log for errors
- [ ] Visit your Netlify domain
- [ ] [ ] Homepage loads
- [ ] [ ] No white screen
- [ ] [ ] No console errors (F12)
- [ ] [ ] Data appears on pages
- [ ] [ ] Admin panel accessible (if needed)

## Phase 5: Real-time Testing on Production

### 5.1 Multi-Device Test
- [ ] Open production URL on Phone #1
- [ ] Open production URL on Phone #2 (or different computer)
- [ ] Login to admin on Phone #1
- [ ] Edit/Add data on Phone #1
- [ ] [ ] Verify change appears on Phone #2 instantly
- [ ] [ ] NO REFRESH on Phone #2!

### 5.2 Different Browsers Test
- [ ] Open production URL in Chrome
- [ ] Open production URL in Safari (or Firefox)
- [ ] Test real-time sync between browsers
- [ ] [ ] Data syncs properly

### 5.3 Network Test
- [ ] Disconnect internet on one device
- [ ] Admin edits data on other device
- [ ] Reconnect first device
- [ ] [ ] Verify sync catches up
- [ ] [ ] All devices have consistent data

## Phase 6: Post-Deployment

### 6.1 Monitor & Test
- [ ] Check Netlify Analytics
- [ ] Monitor error rates
- [ ] Test periodically (weekly)
- [ ] Monitor Supabase dashboard for issues

### 6.2 Backup & Security
- [ ] Enable Supabase backups
- [ ] Note recovery procedures
- [ ] Test data export from Supabase

### 6.3 Documentation
- [ ] Keep all .md files updated
- [ ] Document any customizations
- [ ] Update README with production URL
- [ ] Document admin credentials (securely)

### 6.4 Maintenance Plan
- [ ] Set update schedule
- [ ] Monitor dependencies
- [ ] Plan for feature additions
- [ ] Document known issues

## Troubleshooting Checklist

If something goes wrong:

### White Screen on Netlify
- [ ] Check Netlify build logs
- [ ] Verify environment variables set in Netlify
- [ ] Check browser console (F12) for errors
- [ ] Verify .env.local has correct credentials
- [ ] Try `npm run build && npm run preview` locally
- [ ] Check netlify.toml is correct
- [ ] Read NETLIFY_DEPLOYMENT_GUIDE.md

### Real-time Sync Not Working
- [ ] Verify Supabase tables exist
- [ ] Check Supabase Realtime is enabled
- [ ] Open DevTools → Network → WS (WebSocket)
- [ ] Should see connection to Supabase
- [ ] Check browser console for errors
- [ ] Verify subscriptions are being set up
- [ ] Read ARCHITECTURE.md data flow section

### Data Not Appearing
- [ ] Check Supabase dashboard
- [ ] Verify data exists in tables
- [ ] Check browser console for fetch errors
- [ ] Verify API credentials correct
- [ ] Check RLS policies allow public read
- [ ] Try clearing browser cache

### Admin Panel Issues
- [ ] Verify authentication working
- [ ] Check localStorage for admin auth
- [ ] Verify session timeout message
- [ ] Check admin page loads without error
- [ ] Verify form validation working

### Build Errors
- [ ] Check npm dependencies installed
- [ ] Run `npm install` again
- [ ] Delete node_modules and `.npm`
- [ ] Run `npm install` fresh
- [ ] Check TypeScript errors with `npm run build`
- [ ] Review QUICK_START.md

## Performance Checklist

- [ ] Page load time < 3 seconds
- [ ] Real-time updates < 100ms latency
- [ ] No console warnings
- [ ] No memory leaks (check DevTools Memory tab)
- [ ] Images optimized and loaded correctly
- [ ] Mobile responsiveness checked
- [ ] Bundle size reasonable (< 200KB gzipped)

## Security Checklist

- [ ] `.env.local` NOT committed to git
- [ ] Supabase credentials not in code
- [ ] RLS policies preventing unauthorized access
- [ ] Admin authentication working
- [ ] Session timeout implemented
- [ ] HTTPS enabled on Netlify (automatic)
- [ ] No sensitive data in localStorage
- [ ] API key is ANON key (not SERVICE ROLE key)

## Final Sign-Off

- [ ] All tests passed locally
- [ ] All tests passed in production
- [ ] Documentation complete
- [ ] Team notified of deployment
- [ ] Monitoring set up
- [ ] Backup plan documented
- [ ] Ready for users!

---

## Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server

# Testing
npm run build           # Build for production
npm run preview         # Preview production build locally

# GitHub
git add .
git commit -m "message"
git push               # Push to GitHub (triggers Netlify deploy)

# Debugging
npm install            # Reinstall dependencies
rm -rf node_modules    # Clear node_modules
npm install            # Fresh install
```

---

**Estimated Time**: 1-2 hours total
**Status**: Ready to follow!
**Last Updated**: January 25, 2026
