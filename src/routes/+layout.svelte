<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userSession } from '$lib/sessionStore.js';

	let { children } = $props();

	function parseJwt(token) {
		if (!token) return null;
		try {
			const base64Url = token.split('.')[1];
			const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			const jsonPayload = decodeURIComponent(
				atob(base64)
					.split('')
					.map(function (c) {
						return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
					})
					.join('')
			);
			return JSON.parse(jsonPayload);
		} catch (e) {
			return null;
		}
	}

	function getDashboardByRole(role) {
		switch (role) {
			case 'SuperAdmin':
				return '/admin/superadmin/dashboard';
			case 'Coordinator':
			case 'Staff':
				return '/admin/main/dashboard';
			case 'student':
				return '/student/dashboard';
			default:
				return '/login';
		}
	}

	$effect(() => {
		if (browser) {
			handleSession($page.url);
		}
	});

	async function handleSession(url) {
		const isLoginPage = url.pathname === '/login';
		const token = localStorage.getItem('sessionToken');

		if (!token) {
			if (!isLoginPage) {
				goto('/login');
			}
			return;
		}

		let session = $userSession;
		if (!session) {
			session = parseJwt(token);
		}

		if (session && session.role) {
			const userRole = session.role;
			const path = url.pathname;
			let isAuthorized = false;

			if (path.startsWith('/student') && userRole === 'student') {
				isAuthorized = true;
			} else if (path.startsWith('/admin/superadmin') && userRole === 'SuperAdmin') {
				isAuthorized = true;
			} else if (
				path.startsWith('/admin/main') &&
				(userRole === 'Coordinator' || userRole === 'Staff' || userRole === 'SuperAdmin')
			) {
				isAuthorized = true;
			} else if (path === '/' || isLoginPage) {
				isAuthorized = true;
			}

			if (!isAuthorized) {
				const correctDashboard = getDashboardByRole(userRole);
				goto(correctDashboard);
				return;
			}

			if (isLoginPage) {
				const correctDashboard = getDashboardByRole(userRole);
				goto(correctDashboard);
				return;
			}
		} else {
			localStorage.removeItem('sessionToken');
			if (!isLoginPage) goto('/login');
			return;
		}

		if ($userSession) {
			return;
		}
		try {
			const response = await fetch('/api/auth/verify', {
				headers: { Authorization: `Bearer ${token}` }
			});
			if (!response.ok) {
				if (response.status === 401) {
					alert('Your session has expired. You will be logged out.');
				}
				localStorage.removeItem('sessionToken');
				if (!isLoginPage) goto('/login');
			}
		} catch (error) {
			console.error('Session verification failed:', error);
			localStorage.removeItem('sessionToken');
			if (!isLoginPage) goto('/login');
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main class="min-h-screen bg-gray-50">
	{@render children?.()}
</main>
