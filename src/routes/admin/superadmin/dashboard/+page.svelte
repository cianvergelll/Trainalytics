<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let schools = $state([]);
	let newSchoolId = $state('');
	let newSchoolName = $state('');

	async function fetchSchools() {
		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch('/api/schools');
			if (res.status === 401) {
				localStorage.removeItem('sessionToken');
				goto('/login');
				return;
			}
			if (res.ok) {
				schools = await res.json();
			}
		} catch (e) {
			console.error('Failed to fetch schools:', e);
		}
	}

	onMount(fetchSchools);

	async function addSchool(event) {
		event.preventDefault();
		try {
			await fetch('/api/schools', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ schoolID: newSchoolId, school_name: newSchoolName })
			});
			newSchoolId = '';
			newSchoolName = '';
			fetchSchools();
		} catch (e) {
			console.error('Failed to add school:', e);
		}
	}

	async function deleteSchool(id) {
		if (confirm('Are you sure you want to delete this school?')) {
			try {
				await fetch(`/api/schools/${id}`, { method: 'DELETE' });
				fetchSchools();
			} catch (e) {
				console.error('Failed to delete school:', e);
			}
		}
	}

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
		<h1 class="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
		<button
			onclick={handleLogout}
			class="rounded bg-red-600 px-4 py-2 font-bold text-white shadow transition hover:bg-red-700"
		>
			Log Out
		</button>
	</header>

	<section class="rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-4 text-2xl font-semibold text-gray-700">Manage Schools</h2>

		<form onsubmit={addSchool} class="mb-6 flex items-end gap-4 rounded-md bg-gray-50 p-4">
			<div>
				<label for="schoolId" class="mb-1 block text-sm font-medium">School ID</label>
				<input
					id="schoolId"
					bind:value={newSchoolId}
					class="rounded border border-gray-300 p-2"
					placeholder="e.g., USC"
					required
				/>
			</div>
			<div>
				<label for="schoolName" class="mb-1 block text-sm font-medium">School Name</label>
				<input
					id="schoolName"
					bind:value={newSchoolName}
					class="rounded border border-gray-300 p-2"
					placeholder="e.g., University of San Carlos"
					required
				/>
			</div>
			<button
				type="submit"
				class="rounded bg-blue-600 px-4 py-2 font-bold text-white transition hover:bg-blue-700"
				>Add School</button
			>
		</form>

		<div class="space-y-2">
			{#each schools as school (school.schoolID)}
				<div class="flex items-center justify-between rounded bg-gray-100 p-3">
					<span class="font-medium text-gray-800">{school.school_name} ({school.schoolID})</span>
					<button
						onclick={() => deleteSchool(school.schoolID)}
						class="text-sm text-red-500 hover:underline"
					>
						Delete
					</button>
				</div>
			{/each}
		</div>
	</section>
</div>
