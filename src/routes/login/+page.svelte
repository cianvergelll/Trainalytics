<script>
	import { goto } from '$app/navigation';
	import { userSession } from '$lib/sessionStore.js';

	let email = $state('');
	let password = $state('');
	let error = $state('');

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
<div class="flex h-screen w-screen items-center justify-center bg-gray-100">
	<div class="hidden flex-1 flex-col items-start justify-center md:flex">
		<p
			class="mb-5 bg-gradient-to-tr from-green-600 to-green-800 bg-clip-text pl-40 text-7xl font-bold text-transparent"
		>
			Trainalytics
		</p>
		<p class="pl-40 text-xl">Manage and track student internships effectively.</p>
	</div>

	<div class="w-full max-w-md flex-shrink-0 p-8">
		<div class="rounded-2xl bg-white p-8 shadow-2xl">
			<p class="mb-5 text-left text-2xl font-bold">Log in to your account</p>
			{#if error}
				<p class="mb-4 w-full rounded bg-red-100 p-2 text-center text-sm text-red-700">{error}</p>
			{/if}
			<form onsubmit={handleLogin} class="w-full space-y-4">
				<div>
					<input
						bind:value={email}
						type="text"
						class="w-full rounded-lg border border-gray-400 py-2 pl-4"
						placeholder="Username or Email"
						required
					/>
				</div>
				<div>
					<input
						bind:value={password}
						type="password"
						class="w-full rounded-lg border border-gray-400 py-2 pl-4"
						placeholder="Password"
						required
					/>
				</div>
				<button
					type="submit"
					class="w-full rounded-lg bg-gradient-to-r from-green-500 to-green-800 p-3 font-bold text-white transition duration-300 hover:scale-105"
				>
					Login
				</button>
			</form>
		</div>
	</div>
</div>
