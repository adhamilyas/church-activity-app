import { writable } from 'svelte/store';
import type { User } from './types';

// Create a writable store for the authenticated user
export const user = writable<User | null>(null);

// Check if there's a user in localStorage on initialization
if (typeof window !== 'undefined') {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    user.set(JSON.parse(savedUser));
  }
}

// Subscribe to changes and save to localStorage
user.subscribe((value) => {
  if (typeof window !== 'undefined') {
    if (value) {
      localStorage.setItem('user', JSON.stringify(value));
    } else {
      localStorage.removeItem('user');
    }
  }
});

// Helper functions for authentication
export function isLoggedIn(): boolean {
  let isUserLoggedIn = false;
  user.subscribe((value) => {
    isUserLoggedIn = !!value;
  })();
  return isUserLoggedIn;
}

export function logout(): void {
  user.set(null);
} 