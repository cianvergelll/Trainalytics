<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let studentName = $state('Student');
	let studentEmail = $state('Loading...');
	let studentId = $state(null);

	let avatarUrl = $derived(
		`https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}&background=a855f7&color=fff`
	);

	async function fetchUserData() {
		const token = localStorage.getItem('sessionToken');
		if (!token) return;

		try {
			const authRes = await fetch('/api/auth/me', {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (!authRes.ok) return;
			const authData = await authRes.json();
			studentId = authData.studentId;

			if (studentId) {
				const studentRes = await fetch(`/api/students/${studentId}`, {
					headers: { Authorization: `Bearer ${token}` }
				});

				if (studentRes.ok) {
					const data = await studentRes.json();
					studentName = data.StudentName;
					studentEmail = data.Email;
				}
			}
		} catch (e) {
			console.error('Failed to load sidebar data', e);
		}
	}

	async function logout() {
		const token = localStorage.getItem('sessionToken');
		if (!token) {
			goto('/login');
			return;
		}

		try {
			await fetch('/api/auth/logout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token: token })
			});
		} catch (error) {
			console.error('Logout API call failed:', error);
		} finally {
			localStorage.removeItem('sessionToken');
			goto('/login');
		}
	}

	onMount(() => {
		fetchUserData();
	});
</script>

<aside
	class="fixed inset-y-4 left-4 z-50 flex h-[calc(100vh-2rem)] w-64 flex-col rounded-3xl border border-gray-100 bg-white shadow-xl"
>
	<div class="p-6">
		<div class="flex items-center gap-3">
			<div class="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-purple-100">
				<img src={avatarUrl} alt="Profile" class="h-full w-full object-cover" />
			</div>
			<div class="flex flex-col overflow-hidden">
				<span class="truncate text-sm leading-tight font-bold text-gray-700" title={studentName}>
					{studentName}
				</span>
				<span class="truncate text-[10px] text-gray-400" title={studentEmail}>
					{studentEmail}
				</span>
			</div>
		</div>
	</div>

	<nav class="flex-1 px-3 py-2">
		<ul class="space-y-1">
			{#each [{ name: 'Dashboard', href: '/student/dashboard', icon: 'layout-grid' }, { name: 'Profile', href: '/student/profile', icon: 'user' }, { name: 'Notifications', href: '/bill-reminder', icon: 'bell' }, { name: 'Journals', href: '/student/journals', icon: 'book-open' }, { name: 'Attendance', href: '/student/attendance', icon: 'calendar-check' }, { name: 'Complaints', href: '/student/complaints', icon: 'alert-circle' }, { name: 'Settings', href: '/foo', icon: 'settings' }] as item}
				{@const isActive = $page.url.pathname === item.href}
				<li>
					<a
						href={item.href}
						class="group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all
                        {isActive
							? 'bg-purple-50 font-semibold text-purple-600'
							: 'text-gray-400 hover:bg-purple-50 hover:text-purple-600'}"
					>
						<div
							class="transition-colors {isActive
								? 'text-purple-600'
								: 'group-hover:text-purple-600'}"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								{#if item.icon === 'layout-grid'}
									<rect width="7" height="7" x="3" y="3" rx="1" /><rect
										width="7"
										height="7"
										x="14"
										y="3"
										rx="1"
									/><rect width="7" height="7" x="14" y="14" rx="1" /><rect
										width="7"
										height="7"
										x="3"
										y="14"
										rx="1"
									/>
								{:else if item.icon === 'user'}
									<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle
										cx="12"
										cy="7"
										r="4"
									/>
								{:else if item.icon === 'bell'}
									<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path
										d="M10.3 21a1.94 1.94 0 0 0 3.4 0"
									/>
								{:else if item.icon === 'book-open'}
									<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path
										d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
									/>
								{:else if item.icon === 'calendar-check'}
									<rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><path d="M16 2v4" /><path
										d="M8 2v4"
									/><path d="M3 10h18" /><path d="m9 16 2 2 4-4" />
								{:else if item.icon === 'alert-circle'}
									<circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line
										x1="12"
										x2="12.01"
										y1="16"
										y2="16"
									/>
								{:else if item.icon === 'settings'}
									<path
										d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
									/><circle cx="12" cy="12" r="3" />
								{/if}
							</svg>
						</div>
						{item.name}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<div class="mt-auto border-t border-gray-50 p-4">
		<button
			onclick={logout}
			class="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 py-3 text-sm font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline
					points="16 17 21 12 16 7"
				/><line x1="21" x2="9" y1="12" y2="12" /></svg
			>
			Logout
		</button>
	</div>
</aside>
