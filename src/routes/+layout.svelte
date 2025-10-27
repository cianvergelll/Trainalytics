<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userSession } from '$lib/sessionStore.js';
	import { jwtDecode } from 'jwt-decode';

	let { children } = $props();

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
		if (!browser) return;

		const currentPath = $page.url.pathname;
		const isLoginPage = currentPath === '/login';
		const token = localStorage.getItem('sessionToken');
		let session = $userSession;
		if (!token) {
			if (session) {
				console.log('Token missing, clearing session store.');
				$userSession = null;
				session = null;
			}
			if (!isLoginPage) {
				console.log(`No token, redirecting from ${currentPath} to /login`);
				goto('/login');
			}
			return;
		}

		if (token && !session) {
			try {
				const decoded = jwtDecode(token);
				if (decoded && decoded.id && decoded.role && decoded.username && decoded.exp) {
					if (decoded.exp * 1000 < Date.now()) {
						console.log('Token expired on initial load.');
						throw new Error('Token expired');
					}
					console.log('Populating session store from token.');
					$userSession = { token: token, role: decoded.role, username: decoded.username };
					session = $userSession;
				} else {
					throw new Error('Invalid token structure');
				}
			} catch (e) {
				console.error('Token invalid on initial load:', e);
				localStorage.removeItem('sessionToken');
				$userSession = null;
				session = null;
				if (!isLoginPage) {
					console.log(`Invalid token, redirecting from ${currentPath} to /login`);
					goto('/login');
				}
				return;
			}
		}

		if (session && session.role) {
			const userRole = session.role;
			let isAuthorized = false;

			if (currentPath.startsWith('/student') && userRole === 'student') isAuthorized = true;
			else if (currentPath.startsWith('/admin/superadmin') && userRole === 'SuperAdmin')
				isAuthorized = true;
			else if (
				currentPath.startsWith('/admin/main') &&
				(userRole === 'Coordinator' || userRole === 'Staff' || userRole === 'SuperAdmin')
			)
				isAuthorized = true;
			else if (currentPath === '/' || isLoginPage) isAuthorized = true;
			else if (currentPath.startsWith('/api')) isAuthorized = true;

			const correctDashboard = getDashboardByRole(userRole);

			if (!isAuthorized) {
				console.warn(
					`Unauthorized access attempt to ${currentPath} by role ${userRole}. Redirecting to ${correctDashboard}`
				);
				goto(correctDashboard);
			} else if (isAuthorized && (isLoginPage || currentPath === '/')) {
				if (currentPath !== correctDashboard) {
					console.log(`User logged in, redirecting from ${currentPath} to ${correctDashboard}`);
					goto(correctDashboard);
				}
			}
		} else if (!isLoginPage) {
			console.log(`Session invalid, redirecting from ${currentPath} to /login`);
			localStorage.removeItem('sessionToken');
			goto('/login');
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main class="min-h-screen bg-gray-50">
	{@render children?.()}
</main>
