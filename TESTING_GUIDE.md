# Quick Testing Guide for TherapyConnect

## 🎯 5-Minute Test Scenarios

### Scenario 1: New User Signup (2 minutes)
1. Go to https://therapyconne.com
2. Click "Start Free 30-Day Trial" button
3. Fill out signup form:
   - Watch password strength indicator update as you type
   - Try password less than 8 chars (should show warning)
   - Try password 12+ chars (should show "Strong!")
4. Check the Terms checkbox
5. Click "Start Your Free Trial"
6. Watch for success animation
7. Verify redirect to dashboard

**Expected Result:** ✅ Smooth signup with helpful feedback, redirect to dashboard

---

### Scenario 2: AI Chat Widget Test (3 minutes)
1. Go to https://therapyconne.com/resources.html
2. Look for floating chat bubble in bottom-right corner
3. Hover over bubble → tooltip "Chat with AI Therapist" should appear
4. Click the chat bubble → window opens
5. Read welcome message with service categories
6. Click "🔑 Configure API" button
7. Review API key setup instructions
8. If you have Claude API key, enter it and save
9. Try quick action button: "💕 Relationship Help"
10. Send a test message

**Expected Result:** ✅ Chat opens smoothly, quick actions work, messages send successfully

---

### Scenario 3: Relationship Advice Section (1 minute)
1. Go to https://therapyconne.com/resources.html
2. Verify "💕 Relationship Advice" is the first tab (and active)
3. Scroll to AI Therapist promotion card
4. Click "💬 Start Chat Now - It's Free!" button
5. Chat widget should open

**Expected Result:** ✅ Tab is prominent, chat opens on click

---

### Scenario 4: Mobile Test (2 minutes)
1. Open https://therapyconne.com on mobile device (or resize browser)
2. Check chat bubble is visible and not blocking content
3. Open chat widget → should fit screen properly
4. Try quick action buttons → should be tappable
5. Test signup form on mobile → inputs should be easy to use

**Expected Result:** ✅ Everything responsive and mobile-friendly

---

## 🐛 What to Look For

### Visual Issues
- [ ] Chat bubble should pulse gently
- [ ] Buttons should have hover effects (desktop)
- [ ] Colors should match brand (purples, greens, blues)
- [ ] Text should be readable on all backgrounds
- [ ] No overlapping elements

### Functional Issues
- [ ] All buttons should be clickable
- [ ] Forms should validate properly
- [ ] Chat messages should appear in correct order
- [ ] Quick actions should populate input field
- [ ] API key should save to localStorage
- [ ] Conversation memory should persist

### User Experience
- [ ] Instructions should be clear
- [ ] Feedback should be immediate
- [ ] No confusing error messages
- [ ] Loading states should be visible
- [ ] Success states should be celebratory

---

## 🔧 Quick Fixes if Something's Wrong

### Chat Widget Not Appearing
1. Check browser console (F12) for errors
2. Verify chat-widget.js is loaded (Network tab)
3. Clear localStorage and refresh
4. Try different browser

### API Key Not Working
1. Verify key starts with "sk-ant-"
2. Check Claude API dashboard for key status
3. Verify localStorage has key: `localStorage.getItem('therapy_claude_api_key')`
4. Try re-entering key

### Signup Not Working
1. Check all fields are filled
2. Verify password is 8+ characters
3. Make sure Terms checkbox is checked
4. Check browser console for errors

### Memory Not Persisting
1. Check localStorage: `localStorage.getItem('therapy_conversation_memory')`
2. Try clearing and restarting conversation
3. Verify same browser/device

---

## ✅ Sign-Off Checklist

Before considering testing complete:
- [ ] Tested on Chrome
- [ ] Tested on Safari/Firefox
- [ ] Tested on mobile device
- [ ] Tested signup flow
- [ ] Tested chat widget
- [ ] Tested quick actions
- [ ] Verified all links work
- [ ] Checked for console errors
- [ ] Verified performance is good
- [ ] Confirmed everything is user-friendly

---

## 📊 Performance Targets

- Page load: < 2 seconds
- Chat opens: < 0.3 seconds
- API response: < 3 seconds (depends on Claude API)
- Smooth animations: 60fps
- No blocking JavaScript

---

## 🎉 Success Criteria

**The update is successful if:**
1. Users can easily find and open the chat widget ✓
2. Quick action buttons reduce friction ✓
3. Signup process feels smooth and trustworthy ✓
4. Relationship advice section is prominent ✓
5. No bugs or broken features ✓
6. Mobile experience is excellent ✓

---

**Test completed by:** _________________  
**Date:** _________________  
**Overall rating:** ⭐⭐⭐⭐⭐  
**Issues found:** _________________
