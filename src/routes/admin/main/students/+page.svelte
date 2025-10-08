<script>
	import { goto } from '$app/navigation';
	import SideNav from '$lib/components/SideNav.svelte';
	import SideNavAdmin from '$lib/components/SideNavAdmin.svelte';

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

<div class="flex h-screen w-screen items-center justify-start bg-gray-100">
	<div class="ml-5 flex h-[95%] w-1/5 flex-col rounded-xl shadow-lg">
		<SideNavAdmin />
	</div>

	<div class="ml-5 flex h-[95%] w-3/4 flex-col rounded-xl bg-white p-10 shadow-lg">
		<h1 class="mb-5 text-3xl font-bold">Students</h1>
		<!-- Content for managing students goes here -->
	</div>
</div>
