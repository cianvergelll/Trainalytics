<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let { children } = $props();
	async function verifySession() {
		const token = localStorage.getItem('sessionToken');

		if (!token) return;

		try {
			const response = await fetch('/api/auth/verify', {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (!response.ok) {
				localStorage.removeItem('sessionToken');
				goto('/login');
			}
		} catch (error) {
			console.error('Session verification failed', error);
		}
	}

	onMount(() => {
		verifySession();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main class="min-h-screen bg-gray-50">
	{@render children?.()}
</main>
