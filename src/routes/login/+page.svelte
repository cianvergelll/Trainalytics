<script>
	import { goto } from '$app/navigation';

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

				if (data.role === 'admin') {
					goto('/admin/dashboard');
				} else {
					goto('/student/dashboard');
				}
			} else {
				const err = await response.json();
				error = err.error || 'Login failed';
			}
		} catch (err) {
			console.error('Login error:', err);
			error = 'Network error';
		}
	}
</script>

<title>Kwenta</title>
<div class="flex h-screen w-screen items-center justify-center bg-gray-100">
	<div class="hidden flex-1 flex-col items-start justify-center md:flex">
		<p
			class="mb-5 bg-gradient-to-tr from-green-600 to-green-800 bg-clip-text pl-40 text-7xl font-bold text-transparent"
		>
			Kwenta
		</p>
		<p class="pl-40 text-xl">
			Stay on track of your daily business and personal finances. <br />See where your money goes.
		</p>
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
						class="w-full rounded-lg border border-gray-400 py-2 pl-4"
						placeholder="Email"
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
