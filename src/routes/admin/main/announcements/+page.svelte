<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import SideNavAdmin from '$lib/components/SideNavAdmin.svelte';
	import SetAnnouncementModal from '$lib/components/SetAnnouncementModal.svelte';

	let announcements = $state([]);
	let currentPage = $state(1);
	let totalPages = $state(1);
	let searchTerm = $state('');
	let debounceTimer;
	const limit = 10;

	let showSetAnnouncementModal = $state(false);
	let error = $state('');

	async function fetchAnnouncements(page, search = '') {
		const params = new URLSearchParams({ page, limit, search: search });
		const queryString = params.toString();

		const cacheKey = `announcements?${queryString}`;
		const cachedData = sessionStorage.getItem(cacheKey);
		if (cachedData) {
			const data = JSON.parse(cachedData);
			announcements = data.announcements;
			currentPage = data.currentPage;
			totalPages = data.totalPages;
			return;
		}

		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch(`/api/announcements?${queryString}`, {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (res.status === 401) {
				sessionStorage.clear();
				localStorage.removeItem('sessionToken');
				goto('/login');
				return;
			}

			if (res.ok) {
				const data = await res.json();
				announcements = data.announcements;
				currentPage = data.currentPage;
				totalPages = data.totalPages;
				sessionStorage.setItem(cacheKey, JSON.stringify(data));
			} else {
				console.error('Failed to fetch announcements:', res.statusText);
				error = 'You do not have permission to view announcements.';
			}
		} catch (e) {
			console.error('An error occurred:', e);
			error = 'An error occurred while fetching data.';
		}
	}

	async function handleSetAnnouncement(event) {
		const newAnnouncementData = event.detail;
		error = '';

		const dataToSend = { ...newAnnouncementData };
		delete dataToSend.attachment;

		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch('/api/announcements', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(dataToSend)
			});

			if (res.ok) {
				console.log('Announcement set successfully');
				showSetAnnouncementModal = false;
				sessionStorage.clear();
				fetchAnnouncements(1, searchTerm);
			} else {
				const err = await res.json();
				console.error('Failed to set announcement:', err);
				error = err.error || 'Failed to set announcement.';
			}
		} catch (e) {
			console.error('Error setting announcement:', e);
			error = 'A network error occurred.';
		}
	}

	onMount(() => {
		fetchAnnouncements(1, searchTerm);
	});

	function onSearchInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			sessionStorage.clear();
			fetchAnnouncements(1, searchTerm);
		}, 300);
	}

	function changePage(newPage) {
		if (newPage < 1 || newPage > totalPages) return;
		fetchAnnouncements(newPage, searchTerm);
	}

	async function handleLogout() {
		sessionStorage.clear();
		const token = localStorage.getItem('sessionToken');
		if (token) {
			localStorage.removeItem('sessionToken');
			await fetch('/api/auth/logout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token })
			});
		}
		goto('/login');
	}
</script>

<SetAnnouncementModal
	show={showSetAnnouncementModal}
	on:close={() => (showSetAnnouncementModal = false)}
	on:set={handleSetAnnouncement}
/>

<div class="flex h-screen gap-4 bg-gray-50 p-4">
	<div class="h-full w-1/5 flex-shrink-0">
		<SideNavAdmin />
	</div>

	<div class="flex h-full flex-1 flex-col rounded-xl bg-white p-8 shadow-lg">
		<div class="mb-6">
			<h1 class="text-3xl font-bold text-gray-800">Announcement</h1>
			<p class="text-sm text-gray-500">Pages / Announcement / Announcement List</p>
		</div>

		{#if error}
			<p class="mb-4 w-full rounded bg-red-100 p-2 text-center text-sm text-red-700">{error}</p>
		{/if}

		<div class="flex min-h-0 flex-grow flex-col">
			<div class="mb-4 flex items-center justify-between">
				<div class="flex items-center gap-4">
					<div class="relative">
						<input
							type="text"
							placeholder="Search..."
							class="w-64 rounded-lg border border-gray-300 py-2 pr-10 pl-4 focus:border-green-500 focus:outline-none"
							bind:value={searchTerm}
							oninput={onSearchInput}
						/>
						<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
							<svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</div>
					<button
						class="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-100"
					>
						Filter By
						<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path
								d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.59L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
							/>
						</svg>
					</button>
				</div>
				<div class="flex items-center gap-4">
					<button
						class="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
						>Archived Announcements</button
					>
					<button
						onclick={() => (showSetAnnouncementModal = true)}
						class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600"
					>
						<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path
								d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
							/>
						</svg>
						Set Announcement
					</button>
				</div>
			</div>

			<div class="flex-grow overflow-auto rounded-lg border">
				<table class="min-w-full table-auto text-left">
					<thead class="sticky top-0 border-b bg-gray-50">
						<tr class="bg-green-50">
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Title</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Created By</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Created at</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Updated By</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Last Modified</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y">
						{#each announcements as ann (ann.ID)}
							<tr class="hover:bg-gray-50">
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">{ann.Title}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">{ann.CreatedBy}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">{ann.CreatedAt}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">{ann.UpdatedBy}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">{ann.LastModified}</td
								>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">
									<div class="flex items-center gap-3">
										<button class="text-gray-500 hover:text-green-600" aria-label="View">
											<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
												<path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
												<path
													fill-rule="evenodd"
													d="M.664 10.59a1.651 1.651 0 010-1.18l.879-1.148a1.651 1.651 0 011.087-.582l1.649-.033a1.651 1.651 0 011.53.86l.635 1.27a1.651 1.651 0 001.53.861l1.65-.033a1.651 1.651 0 001.086-.582l.88-1.148a1.651 1.651 0 000-1.18l-.88-1.147a1.651 1.651 0 00-1.086-.583l-1.65.033a1.651 1.651 0 00-1.53-.86l-.635-1.27a1.651 1.651 0 01-1.53-.86L6.22.842a1.651 1.651 0 01-1.087-.582L4.254.113a1.651 1.651 0 010 1.181l.88 1.147c.224.292.36.66.36 1.052v1.274c.36.36.36.36.36.36v-1.274a1.651 1.651 0 01-.36-1.052l-.88-1.148a1.651 1.651 0 01-1.086-.582l-1.65-.033a1.651 1.651 0 01-1.53-.86l-.635-1.27a1.651 1.651 0 00-1.53-.86L.842 6.22a1.651 1.651 0 00-1.087.582L-.394 7.948a1.651 1.651 0 000 1.181l.394 1.147c.224.292.36.66.36 1.052v1.274a1.651 1.651 0 00.36 1.052l.88 1.148zM10 15a5 5 0 100-10 5 5 0 000 10z"
													clip-rule="evenodd"
												/>
											</svg>
										</button>
										<button class="text-gray-500 hover:text-blue-600" aria-label="Edit">
											<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
												<path
													d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z"
												/>
												<path
													d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z"
												/>
											</svg>
										</button>
										<button class="text-gray-500 hover:text-red-600" aria-label="Delete">
											<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
												<path
													fill-rule="evenodd"
													d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25-.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
													clip-rule="evenodd"
												/>
											</svg>
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="mt-auto flex items-center justify-center pt-4">
				<nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
					<button
						onclick={() => changePage(currentPage - 1)}
						disabled={currentPage === 1}
						class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 disabled:opacity-50"
						>Prev</button
					>
					{#each Array(totalPages) as _, i}
						{@const page = i + 1}
						<button
							onclick={() => changePage(page)}
							class:bg-green-500={currentPage === page}
							class:text-white={currentPage === page}
							class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
							>{page}</button
						>
					{/each}
					<button
						onclick={() => changePage(currentPage + 1)}
						disabled={currentPage === totalPages}
						class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 disabled:opacity-50"
						>Next</button
					>
				</nav>
			</div>
		</div>
	</div>
</div>
