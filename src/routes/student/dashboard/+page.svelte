<script>
	import { goto } from '$app/navigation';

	async function handleLogout() {
		const token = localStorage.getItem('sessionToken');
		if (token) {
			try {
				await fetch('/api/auth/logout', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ token })
				});
			} catch (err) {
				console.error('Server logout failed:', err);
			}
		}
		localStorage.removeItem('sessionToken');
		goto('/login');
	}
</script>

<div class="mx-auto max-w-4xl p-8">
	<header class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-800">Student Dashboard</h1>
		<button
			onclick={handleLogout}
			class="rounded bg-red-600 px-4 py-2 font-bold text-white shadow transition hover:bg-red-700"
		>
			Log Out
		</button>
	</header>

	<section class="rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-4 text-2xl font-semibold text-gray-700">Welcome!</h2>
		<p>This is your personal dashboard.</p>
	</section>
</div>
