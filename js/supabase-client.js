// Supabase Client - Database Integration
// Handles all database operations with Supabase

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Supabase configuration (update with your actual keys)
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// User Profile Functions
// ============================================

/**
 * Create or update user profile
 */
export async function saveUserProfile(userId, profileData) {
    try {
        const { data, error } = await supabase
            .from('users')
            .upsert({
                id: userId,
                ...profileData,
                updated_at: new Date().toISOString()
            });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error saving user profile:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error getting user profile:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// Therapist Functions
// ============================================

/**
 * Get all therapists
 */
export async function getTherapists(filters = {}) {
    try {
        let query = supabase
            .from('therapists')
            .select('*');
        
        // Apply filters
        if (filters.specialty) {
            query = query.contains('specialties', [filters.specialty]);
        }
        if (filters.insurance) {
            query = query.contains('insurance_accepted', [filters.insurance]);
        }
        if (filters.sessionType) {
            query = query.contains('session_types', [filters.sessionType]);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error getting therapists:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get single therapist by ID
 */
export async function getTherapist(therapistId) {
    try {
        const { data, error } = await supabase
            .from('therapists')
            .select('*')
            .eq('id', therapistId)
            .single();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error getting therapist:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// Session/Appointment Functions
// ============================================

/**
 * Book a therapy session
 */
export async function bookSession(sessionData) {
    try {
        const { data, error } = await supabase
            .from('sessions')
            .insert({
                ...sessionData,
                status: 'scheduled',
                created_at: new Date().toISOString()
            })
            .select();
        
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error booking session:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get user's sessions
 */
export async function getUserSessions(userId) {
    try {
        const { data, error } = await supabase
            .from('sessions')
            .select(`
                *,
                therapist:therapists(*)
            `)
            .eq('user_id', userId)
            .order('session_date', { ascending: true });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error getting sessions:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Cancel a session
 */
export async function cancelSession(sessionId) {
    try {
        const { data, error } = await supabase
            .from('sessions')
            .update({ 
                status: 'cancelled',
                cancelled_at: new Date().toISOString()
            })
            .eq('id', sessionId)
            .select();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error cancelling session:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// Progress Tracking Functions
// ============================================

/**
 * Save mood entry
 */
export async function saveMoodEntry(userId, moodData) {
    try {
        const { data, error } = await supabase
            .from('mood_entries')
            .insert({
                user_id: userId,
                ...moodData,
                created_at: new Date().toISOString()
            })
            .select();
        
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error saving mood entry:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get mood history
 */
export async function getMoodHistory(userId, days = 30) {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        const { data, error } = await supabase
            .from('mood_entries')
            .select('*')
            .eq('user_id', userId)
            .gte('created_at', startDate.toISOString())
            .order('created_at', { ascending: true });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error getting mood history:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Save journal entry
 */
export async function saveJournalEntry(userId, entryData) {
    try {
        const { data, error } = await supabase
            .from('journal_entries')
            .insert({
                user_id: userId,
                ...entryData,
                created_at: new Date().toISOString()
            })
            .select();
        
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error saving journal entry:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get journal entries
 */
export async function getJournalEntries(userId, limit = 50) {
    try {
        const { data, error } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error getting journal entries:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// Messaging Functions
// ============================================

/**
 * Send message to therapist
 */
export async function sendMessage(messageData) {
    try {
        const { data, error } = await supabase
            .from('messages')
            .insert({
                ...messageData,
                created_at: new Date().toISOString(),
                read: false
            })
            .select();
        
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error sending message:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get conversation with therapist
 */
export async function getConversation(userId, therapistId) {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${userId},receiver_id.eq.${therapistId}),and(sender_id.eq.${therapistId},receiver_id.eq.${userId})`)
            .order('created_at', { ascending: true });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error getting conversation:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// Real-time Subscriptions
// ============================================

/**
 * Subscribe to new messages
 */
export function subscribeToMessages(userId, callback) {
    const subscription = supabase
        .channel('messages')
        .on('postgres_changes', 
            { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'messages',
                filter: `receiver_id=eq.${userId}`
            }, 
            callback
        )
        .subscribe();
    
    return subscription;
}

/**
 * Unsubscribe from channel
 */
export function unsubscribe(subscription) {
    supabase.removeChannel(subscription);
}

// ============================================
// Export supabase client for custom queries
// ============================================
export { supabase };

console.log('Supabase client initialized');
