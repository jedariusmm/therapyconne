# 🗺️ Google Maps API Setup Guide

## How to Get Your Google Maps API Key

### Step 1: Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### Step 2: Create a New Project (or select existing)
1. Click on the project dropdown at the top
2. Click "New Project"
3. Name it: "TherapyConnect"
4. Click "Create"

### Step 3: Enable Required APIs
1. Go to "APIs & Services" > "Library"
2. Search for and enable these APIs:
   - **Maps JavaScript API** (for displaying the map)
   - **Places API** (for searching therapists)
   - **Geocoding API** (for address lookup)
   - **Geolocation API** (for user location)

### Step 4: Create API Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "+ CREATE CREDENTIALS"
3. Select "API key"
4. Copy the API key that appears

### Step 5: Secure Your API Key (IMPORTANT!)
1. Click "Edit API key" (or the key name)
2. Under "Application restrictions":
   - Select "HTTP referrers (websites)"
   - Add your domains:
     - `https://therapyconne.com/*`
     - `https://*.vercel.app/*` (for testing)
     - `http://localhost:*` (for local development)
3. Under "API restrictions":
   - Select "Restrict key"
   - Check only:
     - Maps JavaScript API
     - Places API
     - Geocoding API
     - Geolocation API
4. Click "Save"

### Step 6: Add API Key to Your Site
Open `therapist-finder.html` and replace this line (at the bottom):

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places,geometry&callback=initMap" async defer></script>
```

With:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY_HERE&libraries=places,geometry&callback=initMap" async defer></script>
```

### Step 7: Set Up Billing (Required)
⚠️ **Important:** Google Maps requires a billing account, BUT:
- You get **$200 free credits per month**
- This is enough for ~28,000 map loads or ~5,600 searches per month
- You won't be charged unless you exceed this (very unlikely for a new site)

To set up billing:
1. Go to "Billing" in Google Cloud Console
2. Click "Link a billing account"
3. Add a credit card (required but won't be charged within free tier)

---

## 💰 Pricing (Don't Worry - It's Mostly Free!)

### Free Monthly Credits: $200

**What this covers:**
- Maps JavaScript API: ~28,000 page loads
- Places API: ~5,600 searches
- Geocoding API: ~40,000 requests

**Real-world usage example:**
- 100 users per day searching for therapists = 3,000 searches/month
- **Cost:** $0 (well within free tier!)

---

## 🔒 Security Best Practices

### ✅ DO:
- Restrict your API key to your specific domains
- Restrict which APIs the key can access
- Monitor usage in Google Cloud Console
- Set up usage quotas and alerts

### ❌ DON'T:
- Share your API key publicly
- Commit it directly to GitHub (use environment variables)
- Leave it unrestricted
- Skip billing setup (the free tier still requires a billing account)

---

## 🧪 Testing Your Setup

After adding your API key:

1. Open `therapist-finder.html` in a browser
2. Click "Enable Location Access"
3. Allow location permissions
4. The map should load and show your location
5. Click "Search" to find nearby therapists

**If you see errors:**
- Check browser console (F12)
- Verify API key is correct
- Ensure all required APIs are enabled
- Check that billing is set up

---

## 📝 Quick Setup Checklist

- [ ] Created Google Cloud Project
- [ ] Enabled Maps JavaScript API
- [ ] Enabled Places API
- [ ] Enabled Geocoding API
- [ ] Created API key
- [ ] Restricted API key to your domains
- [ ] Set up billing account
- [ ] Added API key to therapist-finder.html
- [ ] Tested on live site

---

## 🆘 Troubleshooting

### "This page can't load Google Maps correctly"
- **Problem:** API key is missing or invalid
- **Solution:** Double-check the API key in therapist-finder.html

### "You have exceeded your request quota for this API"
- **Problem:** Hit the free tier limit (unlikely!) or billing not set up
- **Solution:** Set up billing account in Google Cloud Console

### "Google Maps Platform rejected your request"
- **Problem:** API key restrictions are too strict or APIs not enabled
- **Solution:** Check domain restrictions and ensure all 4 APIs are enabled

### Map shows but search doesn't work
- **Problem:** Places API not enabled
- **Solution:** Enable Places API in Google Cloud Console

---

## 🎯 Next Steps

Once your API key is working:

1. ✅ Deploy updated therapist-finder.html to Vercel
2. ✅ Test the search on live site
3. ✅ Monitor usage in Google Cloud Console
4. ✅ Set up usage alerts (optional but recommended)

**Estimated setup time:** 10-15 minutes

**Monthly cost:** $0 (within free tier for normal usage)
