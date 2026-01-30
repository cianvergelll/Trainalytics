<script>
	import { onMount } from 'svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import { notificationsStore, unreadCountStore } from '$lib/stores/socketStore';

	let activeFilter = $state('all');

	let notifications = $derived($notificationsStore);
	let unreadCount = $derived($unreadCountStore);
	let loading = $state(false);

	onMount(() => {
		fetchNotifications();
	});

	async function fetchNotifications() {
		const token = localStorage.getItem('sessionToken');
		if (!token) return;

		loading = true;
		try {
			const res = await fetch('/api/notifications', {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (res.ok) {
				const history = await res.json();
				notificationsStore.set(history);
			}
		} catch (e) {
			console.error('Failed to load notifications:', e);
		} finally {
			loading = false;
		}
	}

	let filteredNotifications = $derived(
		notifications.filter((n) => {
			if (activeFilter === 'all') return true;
			if (activeFilter === 'unread') return !n.read;
			if (activeFilter === 'read') return n.read;
			if (activeFilter === 'important') return n.type === 'warning';
			return true;
		})
	);

	async function markAllAsRead() {
		notificationsStore.update((n) => n.map((item) => ({ ...item, read: true })));

		try {
			const token = localStorage.getItem('sessionToken');
			await fetch('/api/notifications/read-all', {
				method: 'PUT',
				headers: { Authorization: `Bearer ${token}` }
			});
		} catch (e) {
			console.error('Failed to sync read status:', e);
		}
	}

	async function handleNotificationClick(notif) {
		if (!notif.read) {
			notificationsStore.update((n) =>
				n.map((item) => (item.id === notif.id ? { ...item, read: true } : item))
			);

			try {
				const token = localStorage.getItem('sessionToken');
				await fetch(`/api/notifications/${notif.id}/read`, {
					method: 'PUT',
					headers: { Authorization: `Bearer ${token}` }
				});
			} catch (e) {
				console.error('Failed to mark read:', e);
			}
		}

		if (notif.targetUrl) {
			window.location.href = notif.targetUrl;
		}
	}

	function getIcon(type) {
		if (type === 'success') {
			return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
		} else if (type === 'warning') {
			return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
		} else {
			return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
		}
	}
</script>

<div class="flex h-screen gap-4 bg-gray-50 p-4">
	<div class="h-full w-1/5 flex-shrink-0">
		<SideNav activePage="notifications" />
	</div>

	<div class="flex h-full flex-1 flex-col overflow-hidden">
		<div class="flex-1 overflow-y-auto p-8">
			<div class="mx-auto flex max-w-[1600px] flex-col gap-8">
				<div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
					<div>
						<h1 class="text-3xl font-bold text-gray-800">Notifications</h1>
						<p class="mt-1 text-sm text-gray-500">
							You have <span class="font-bold text-gray-900">{unreadCount}</span> unread notifications.
						</p>
					</div>

					<div class="flex items-center gap-2">
						{#if unreadCount > 0}
							<button
								onclick={markAllAsRead}
								class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									class="h-4 w-4"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								Mark all as read
							</button>
						{/if}

						<button
							onclick={fetchNotifications}
							class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-green-600"
							disabled={loading}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								class="h-4 w-4 {loading ? 'animate-spin' : ''}"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
								/>
							</svg>
							Refresh
						</button>
					</div>
				</div>

				<div class="border-b border-gray-200">
					<nav class="-mb-px flex gap-6" aria-label="Tabs">
						{#each ['all', 'unread', 'read', 'important'] as filter}
							<button
								onclick={() => (activeFilter = filter)}
								class="shrink-0 border-b-2 px-1 py-4 text-sm font-medium capitalize transition-colors
                                {activeFilter === filter
									? 'border-green-500 text-green-600'
									: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
							>
								{filter}
							</button>
						{/each}
					</nav>
				</div>

				<div class="flex flex-col gap-4">
					{#if filteredNotifications.length === 0}
						<div class="flex flex-col items-center justify-center py-20 text-center">
							<div class="mb-4 rounded-full bg-gray-100 p-4 text-gray-400">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="h-8 w-8"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
									/>
								</svg>
							</div>
							<h3 class="text-lg font-medium text-gray-900">No notifications found</h3>
							<p class="text-sm text-gray-500">There are no notifications in this category.</p>
						</div>
					{:else}
						{#each filteredNotifications as notif (notif.id)}
							<button
								onclick={() => handleNotificationClick(notif)}
								class="relative flex w-full items-start gap-4 rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-all hover:border-green-200 hover:shadow-md {notif.read
									? 'opacity-70'
									: 'bg-white ring-1 ring-gray-100 ring-inset'}"
							>
								<div
									class={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${notif.type === 'success' ? 'bg-green-50' : notif.type === 'warning' ? 'bg-orange-50' : 'bg-blue-50'}`}
								>
									{@html getIcon(notif.type)}
								</div>
								<div class="flex-1">
									<div class="flex items-center justify-between">
										<h3
											class="text-base font-bold {notif.read ? 'text-gray-600' : 'text-gray-900'}"
										>
											{notif.title}
										</h3>
										<span class="ml-2 text-xs font-medium whitespace-nowrap text-gray-400"
											>{notif.time || 'Just now'}</span
										>
									</div>
									<p class="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-600">
										{notif.message}
									</p>
								</div>
								{#if !notif.read}
									<div class="absolute top-1/2 right-5 -translate-y-1/2">
										<div class="h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white"></div>
									</div>
								{/if}
							</button>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
