// Firebase Authentication Integration
// Handles user authentication with Firebase

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase configuration (update with your actual config)
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// ============================================
// Authentication Functions
// ============================================

/**
 * Sign up new user with email and password
 */
export async function signUp(email, password, userData) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Store additional user data in Supabase
        await saveUserProfile(user.uid, {
            email: email,
            ...userData,
            createdAt: new Date().toISOString()
        });
        
        console.log('User signed up:', user.uid);
        return { success: true, user };
    } catch (error) {
        console.error('Sign up error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Sign in existing user
 */
export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('User signed in:', user.uid);
        return { success: true, user };
    } catch (error) {
        console.error('Sign in error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Check if this is a new user and create profile
        const profileExists = await checkUserProfile(user.uid);
        if (!profileExists) {
            await saveUserProfile(user.uid, {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date().toISOString()
            });
        }
        
        console.log('Google sign in successful:', user.uid);
        return { success: true, user };
    } catch (error) {
        console.error('Google sign in error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Sign out current user
 */
export async function logOut() {
    try {
        await signOut(auth);
        console.log('User signed out');
        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Send password reset email
 */
export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: 'Password reset email sent' };
    } catch (error) {
        console.error('Password reset error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser() {
    return auth.currentUser;
}

/**
 * Listen to authentication state changes
 */
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}

// ============================================
// Helper Functions (integrate with Supabase)
// ============================================

async function saveUserProfile(uid, userData) {
    // This will be implemented in supabase-client.js
    const event = new CustomEvent('saveUserProfile', { 
        detail: { uid, userData } 
    });
    window.dispatchEvent(event);
}

async function checkUserProfile(uid) {
    // This will be implemented in supabase-client.js
    return false; // Placeholder
}

// ============================================
// UI Helper Functions
// ============================================

/**
 * Show/hide UI elements based on auth state
 */
export function updateUIForAuth(user) {
    const authButtons = document.querySelectorAll('.auth-required');
    const guestButtons = document.querySelectorAll('.guest-only');
    
    if (user) {
        // User is signed in
        authButtons.forEach(el => el.style.display = 'block');
        guestButtons.forEach(el => el.style.display = 'none');
        
        // Update user display name
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(el => {
            el.textContent = user.displayName || user.email;
        });
    } else {
        // User is signed out
        authButtons.forEach(el => el.style.display = 'none');
        guestButtons.forEach(el => el.style.display = 'block');
    }
}

/**
 * Redirect if not authenticated
 */
export function requireAuth(redirectUrl = 'sign-in.html') {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = redirectUrl;
    }
    return user;
}

// ============================================
// Initialize auth state listener
// ============================================
onAuthChange((user) => {
    updateUIForAuth(user);
    
    // Trigger custom event for other components
    const event = new CustomEvent('authStateChanged', { detail: { user } });
    window.dispatchEvent(event);
});

console.log('Firebase Auth initialized');
