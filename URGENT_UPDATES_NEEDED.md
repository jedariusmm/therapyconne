# 🚨 URGENT UPDATES NEEDED - TherapyConnect

## Status: IN PROGRESS ⏳

### ✅ COMPLETED:
1. **Removed fake journal data** - journal.html now shows empty state

---

## 🔴 CRITICAL REMAINING TASKS:

### 1. Remove ALL Fake Data Across Site
**Files to Clean:**
- `dashboard.html` - Remove fake stats, fake testimonials
- `community.html` - Remove fake groups, fake events, fake members
- `therapists.html` - Remove fake therapist profiles
- `sessions.html` - Remove fake session history
- `profile.html` - Remove fake user data
- `goals.html` - Remove fake goals

**Replace with:** Empty states that encourage users to create real content

---

### 2. Real Therapist Finder (Google Maps Integration)
**Create new file:** `therapist-finder.html`

**Requirements:**
- Use Google Places API to find real licensed therapists
- Search by user's location (geolocation API)
- Show: Name, Address, Phone, Reviews, Distance
- Filter by: Insurance accepted, Specialties, Languages
- Real contact info and booking links
- NO FAKE THERAPISTS - Only Google Maps verified businesses

**API Setup Needed:**
```javascript
// Get Google Places API Key from: https://console.cloud.google.com/
const API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY';

// Search for therapists near user
function findTherapists(lat, lng) {
    const service = new google.maps.places.PlacesService(map);
    const request = {
        location: new google.maps.LatLng(lat, lng),
        radius: '10000', // 10km
        type: ['doctor', 'health'],
        keyword: 'therapist psychologist counselor mental health'
    };
    service.nearbySearch(request, displayResults);
}
```

---

### 3. Real Community Page
**Update:** `community.html`

**Requirements:**
- Show REAL logged-in users (from localStorage/database)
- Real-time "Online Now" status (green dot)
- User profiles with real avatars (uploaded by users)
- Real posts/updates from actual users
- NO FAKE GROUPS - Only show groups created by real users
- NO FAKE EVENTS - Only show events created by real users
- Empty state: "No community members yet. Invite friends to join!"

**Implementation:**
```javascript
// Get all real users
function getOnlineUsers() {
    // Check localStorage for logged-in users
    const allUsers = JSON.parse(localStorage.getItem('therapyConnectAllUsers') || '{}');
    const onlineUsers = Object.values(allUsers).filter(user => {
        const lastActive = new Date(user.lastActive);
        const now = new Date();
        return (now - lastActive) < 5 * 60 * 1000; // Active in last 5 min
    });
    return onlineUsers;
}
```

---

### 4. NUPI Exercise Guidance
**Update:** `resources.html` exercise buttons

**Current Problem:** Exercise buttons don't do anything
**Solution:** Connect them to NUPI chat with guidance prompts

**Example Fix:**
```javascript
// Update exercise buttons
function startExercise(exerciseName) {
    const exercisePrompts = {
        'bodyscan': 'Guide me through a 10-minute body scan meditation. Go slowly, help me relax each body part.',
        'breathing': 'Lead me through 4-7-8 breathing: Inhale 4 seconds, hold 7 seconds, exhale 8 seconds. Guide me for 5 minutes.',
        'gratitude': 'Help me practice gratitude journaling. Ask me questions to reflect on what I'm grateful for.',
        'grounding': 'Guide me through the 5-4-3-2-1 grounding technique for anxiety.',
        'progressive-relaxation': 'Lead me through progressive muscle relaxation. Guide me to tense and release each muscle group.',
        'visualization': 'Guide me through a calming visualization exercise. Help me imagine a peaceful place.'
    };
    
    if (window.therapistChat) {
        window.therapistChat.quickMessage(exercisePrompts[exerciseName]);
    }
}
```

---

### 5. Profile Picture Upload
**Update:** `profile.html`

**Add Features:**
- Upload profile picture button
- Image preview before saving
- Crop tool for profile pictures
- Save to localStorage (or cloud storage)
- Display profile pic in navbar and all pages

**Implementation:**
```html
<!-- Add to profile.html -->
<div class="profile-picture-section">
    <div class="current-avatar" id="profilePicPreview">
        <img src="default-avatar.png" alt="Profile" id="profileImg">
    </div>
    <input type="file" id="profilePicInput" accept="image/*" style="display: none;" onchange="previewProfilePic(this)">
    <button onclick="document.getElementById('profilePicInput').click()">
        📷 Upload Photo
    </button>
</div>

<script>
function previewProfilePic(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profileImg').src = e.target.result;
            // Save to localStorage
            const user = JSON.parse(localStorage.getItem('therapyConnectUser'));
            user.profilePicture = e.target.result;
            localStorage.setItem('therapyConnectUser', JSON.stringify(user));
        };
        reader.readAsDataURL(input.files[0]);
    }
}
</script>
```

---

### 6. Full Profile Editing
**Update:** `profile.html`

**Add Editable Fields:**
- Full Name
- Email (non-editable, just display)
- Bio/About Me
- Location
- Interests/Hobbies
- Mental Health Goals
- Preferred Contact Method
- Privacy Settings

---

## 🎯 PRIORITY ORDER:
1. **Remove ALL fake data** (CRITICAL - affects trust)
2. **Real therapist finder** (CRITICAL - core feature)
3. **Profile picture upload** (HIGH - personalization)
4. **NUPI exercise guidance** (MEDIUM - improves UX)
5. **Real community page** (MEDIUM - social features)
6. **Full profile editing** (LOW - nice to have)

---

## ⚠️ WARNING:
**NO FAKE DATA ANYWHERE!**
- No fake testimonials
- No fake reviews
- No fake users
- No fake therapists
- No fake groups
- No fake events
- No fake journal entries
- No fake goals
- No fake session history

**If data doesn't exist yet, show empty states with calls-to-action!**

---

## 📝 NEXT STEPS:
1. Complete removing fake data from all pages
2. Get Google Places API key for therapist finder
3. Build therapist-finder.html with real Google Maps integration
4. Update profile.html with upload functionality
5. Fix exercise buttons to trigger NUPI
6. Make community.html show real users only
7. Test everything thoroughly
8. Deploy to production

---

## 🔧 APIs/Tools Needed:
- Google Places API (for therapist finder)
- Google Maps JavaScript API (for map display)
- FileReader API (for image upload - already in browser)
- localStorage (for storing user data - already using)
- Consider Firebase Storage for profile pictures (optional upgrade)
