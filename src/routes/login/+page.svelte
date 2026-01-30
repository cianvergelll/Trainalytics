<script>
	import { goto } from '$app/navigation';
	import { userSession } from '$lib/sessionStore.js';
	import { fly } from 'svelte/transition'; // Added transition import
	import { onMount } from 'svelte'; // Added onMount to trigger animation

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let visible = $state(false); // Controls the entrance animation

	onMount(() => {
		visible = true; // Triggers the slide-in once the page loads
	});

	async function handleLogin(event) {
		event.preventDefault();
		error = '';
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});
			if (response.ok) {
				const data = await response.json();
				localStorage.setItem('sessionToken', data.token);

				$userSession = { token: data.token, role: data.role, username: data.username };

				switch (data.role) {
					case 'SuperAdmin':
						goto('/admin/superadmin/dashboard');
						break;
					case 'Coordinator':
					case 'Staff':
						goto('/admin/main/dashboard');
						break;
					case 'student':
						goto('/student/dashboard');
						break;
					default:
						error = 'Unknown role received. Please contact support.';
						localStorage.removeItem('sessionToken');
						$userSession = null;
				}
			} else {
				const err = await response.json();
				error = err.error || 'Login failed';
				$userSession = null;
			}
		} catch (err) {
			console.error('Login error:', err);
			error = 'Network error';
			$userSession = null;
		}
	}
</script>

<title>Trainalytics Login</title>
<div
	class="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-white px-6 py-12 md:px-20"
>
	<div
		class="absolute top-10 -left-10 h-64 w-64 rounded-full bg-green-100 opacity-50 blur-[100px]"
	></div>
	<div
		class="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-green-50 opacity-60 blur-[120px]"
	></div>

	<div class="z-10 flex w-full max-w-6xl flex-col items-center justify-between md:flex-row">
		{#if visible}
			<div
				in:fly={{ x: -100, duration: 1000, opacity: 0 }}
				class="mb-12 flex flex-col items-start justify-center md:mb-0 md:w-1/2"
			>
				<div class="mb-6 h-1 w-12 bg-green-500 opacity-60"></div>
				<h1 class="mb-4 text-6xl font-extrabold tracking-tight text-green-600 md:text-8xl">
					Trainalytics
				</h1>
				<p class="max-w-md text-lg leading-relaxed text-gray-600">
					Trainalytics helps you manage and track student internships effectively with a seamless,
					data-driven experience.
				</p>
			</div>

			<div
				in:fly={{ y: 50, duration: 1000, delay: 300, opacity: 0 }}
				class="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-10 shadow-2xl shadow-gray-900/50 backdrop-blur-xl"
			>
				<h2 class="mb-8 text-center text-4xl font-bold text-gray-500">
					Sign <span class="text-green-600">I</span>n
				</h2>

				{#if error}
					<p
						class="mb-4 w-full rounded border border-red-200 bg-red-50 p-2 text-center text-sm text-red-600"
					>
						{error}
					</p>
				{/if}

				<form onsubmit={handleLogin} class="space-y-6">
					<div>
						<label class="mb-2 block text-sm font-medium text-gray-700">User Name</label>
						<input
							bind:value={email}
							type="text"
							class="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-6 text-gray-800 placeholder-gray-400 transition-all outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
							placeholder="virgie_admin"
							required
						/>
					</div>
					<div>
						<label class="mb-2 block text-sm font-medium text-gray-700">Password</label>
						<input
							bind:value={password}
							type="password"
							class="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-6 text-gray-800 placeholder-gray-400 transition-all outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
							placeholder="••••••••"
							required
						/>
					</div>

					<button
						type="submit"
						class="relative z-30 mt-4 block w-full cursor-pointer rounded-full bg-green-600 py-4 text-lg font-bold text-white shadow-lg shadow-green-200 transition-all hover:scale-[1.02] hover:bg-green-700 active:scale-[0.98]"
					>
						Submit
					</button>
				</form>
			</div>
		{/if}
	</div>
</div>
