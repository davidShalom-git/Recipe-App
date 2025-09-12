import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,

    register: async (username, email, password) => {
        try {
            set({ isLoading: true });
            
            const response = await fetch('http://192.168.18.58:4000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.error || 'Registration failed'
                };
            }

            if (data.token && data.token !== undefined && data.token !== null) {
                // FIXED: Store token as string, user as JSON
                await AsyncStorage.setItem('token', data.token);
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                set({ 
                    token: data.token, 
                    user: data.user,
                    isAuthenticated: true 
                });
            } else {
                console.log('Registration successful but no token returned');
                set({ 
                    user: data.user || { username, email },
                    isAuthenticated: false
                });
            }

            return {
                success: true,
                message: 'Registration successful',
                user: data.user,
                token: data.token
            };

        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: error.message || 'Network error occurred'
            };
        } finally {
            set({ isLoading: false });
        }
    },

// In your store/auth.js - UPDATE these functions:

Login: async (email, password) => {
    set({ isLoading: true });
    try {
        const response = await fetch('http://192.168.18.58:4000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // FIXED: Store token as plain string (no JSON.stringify)
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));

        console.log('Token being stored:', data.token.substring(0, 30) + '...');

        set({ 
            user: data.user, 
            token: data.token, 
            isAuthenticated: true,
            isLoading: false 
        });
        
        return { success: true, message: 'Login successful', user: data.user, token: data.token };

    } catch (error) {
        set({ isLoading: false });
        return { success: false, message: error.message || 'Login failed' };
    }
},

checkAuth: async () => {
    set({ isLoading: true });
    try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');
        
        console.log('CheckAuth - Raw stored token:', storedToken ? storedToken.substring(0, 30) + '...' : 'null');

        if (storedUser && storedToken) {
            const parsedUser = JSON.parse(storedUser);
            
            // FIXED: Don't JSON.parse the token - use it as-is
            console.log('CheckAuth - Using token as string:', storedToken.substring(0, 30) + '...');
            
            set({ 
                user: parsedUser, 
                token: storedToken, // Use the token as a plain string
                isAuthenticated: true,
                isLoading: false 
            });
        } else {
            set({ 
                user: null, 
                token: null, 
                isAuthenticated: false,
                isLoading: false 
            });
        }
    } catch (error) {
        console.error('CheckAuth Error:', error);
        set({ 
            user: null, 
            token: null, 
            isAuthenticated: false,
            isLoading: false 
        });
    }   
}
,

    logout: async () => {
        set({ isLoading: true });
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
            set({ 
                user: null, 
                token: null, 
                isAuthenticated: false,
                isLoading: false 
            });
            
            return { success: true, message: 'Logged out successfully' };
            
        } catch (error) {
            console.error('Logout Error:', error.message);
            set({ isLoading: false });
            return { success: false, message: 'Logout failed' };
        }
    }
}));
