<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userSession } from '$lib/sessionStore.js';

	let { children } = $props();

	$effect(() => {
		if (browser) {
			handleSession($page.url);
		}
	});

	async function handleSession(url) {
		const isLoginPage = url.pathname === '/login';

		if ($userSession) {
			return;
		}

		const token = localStorage.getItem('sessionToken');

		if (!token) {
			if (!isLoginPage) {
				goto('/login');
			}
			return;
		}

		try {
			const response = await fetch('/api/auth/verify', {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (!response.ok) {
				localStorage.removeItem('sessionToken');
				if (!isLoginPage) {
					goto('/login');
				}
			}
		} catch (error) {
			console.error('Session verification failed:', error);
			localStorage.removeItem('sessionToken');
			if (!isLoginPage) {
				goto('/login');
			}
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main class="min-h-screen bg-gray-50">
	{@render children?.()}
</main>
