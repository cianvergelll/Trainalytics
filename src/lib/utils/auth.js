import { goto } from '$app/navigation';
import { userSession } from '$lib/sessionStore.js';

export async function logoutUser() {
    const token = localStorage.getItem('sessionToken');
    console.log("Logout initiated...");

    localStorage.removeItem('sessionToken');
    $userSession = null;

    if (token) {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("Backend logout notified.");
        } catch (err) {
            console.error('Server logout notification failed:', err);
        }
    }

    console.log("Redirecting to login...");
    goto('/login');
}

