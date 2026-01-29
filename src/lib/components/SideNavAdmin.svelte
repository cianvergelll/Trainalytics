<script>
	import { goto } from '$app/navigation';

	let { activePage = '' } = $props();

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

	const menuItems = [
		{ label: 'Students', href: '/admin/main/students', id: 'students' },
		{ label: 'Announcements', href: '/admin/main/announcements', id: 'announcements' },
		{ label: 'Journals', href: '/admin/main/journals', id: 'journals' },
		{ label: 'Attendance', href: '/admin/main/attendance', id: 'attendance' },
		{ label: 'Complaints', href: '/admin/main/complaints', id: 'complaints' },
		{ label: 'Reports', href: '/admin/main/reports', id: 'reports' },
		{ label: 'Settings', href: '/admin/main/settings/companies', id: 'companies' }
	];
</script>

<aside class="fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col overflow-hidden bg-white">
	<div class="p-8 pb-4">
		<div class="flex items-center gap-3 rounded-2xl px-4 py-3">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1DB954] font-black text-white shadow-lg"
			>
				T
			</div>
			<h1 class="text-sm font-black tracking-tighter text-[#0E6245] uppercase italic">
				Trainalytics
			</h1>
		</div>
	</div>

	<nav class="flex-1 py-4 pl-4">
		<ul class="flex flex-col space-y-1">
			<li class="relative">
				<a
					href="/admin/main/dashboard"
					class={activePage === 'dashboard'
						? 'relative z-10 flex items-center gap-3 rounded-l-full bg-gray-100 px-8 py-4 text-[11px] font-black tracking-widest text-[#0E6245] uppercase'
						: 'flex items-center gap-3 px-8 py-4 text-[11px] font-bold tracking-widest text-[#0E6245] uppercase transition-all hover:text-[#1DB954]'}
				>
					Dashboard
				</a>
			</li>

			{#each menuItems as item}
				<li class="relative">
					<a
						href={item.href}
						class={activePage === item.id
							? 'relative z-10 flex items-center gap-3 rounded-l-full bg-gray-100 px-8 py-4 text-[11px] font-black tracking-widest text-[#0E6245] uppercase'
							: 'flex items-center gap-3 px-8 py-4 text-[11px] font-bold tracking-widest text-[#0E6245] uppercase transition-all hover:text-[#1DB954]'}
					>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<div class="mt-auto p-10">
		<button
			onclick={logout}
			class="group flex items-center gap-3 text-[10px] font-black tracking-[0.2em] text-[#0E6245] uppercase transition-all hover:text-[#1DB954]"
		>
			<div
				class="h-1 w-4 rounded-full bg-gray-200 transition-all group-hover:w-6 group-hover:bg-[#1DB954]"
			></div>
			Logout
		</button>
	</div>
</aside>
