<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import SideNavAdmin from '$lib/components/SideNavAdmin.svelte';
	import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';

	let announcements = $state([]);
	let currentPage = $state(1);
	let totalPages = $state(1);
	let searchTerm = $state('');
	let debounceTimer;
	const limit = 10;
	let error = $state('');
	let successMessage = $state('');

	let showRestoreModal = $state(false);
	let announcementToRestoreId = $state(null);

	async function fetchArchivedAnnouncements(page, search = '') {
		const params = new URLSearchParams({
			page,
			limit,
			search: search,
			archived: 'true'
		});
		const queryString = params.toString();

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
				// REMOVED: sessionStorage.setItem(...)
			} else {
				error = 'Failed to load archived announcements.';
			}
		} catch (e) {
			console.error('An error occurred:', e);
			error = 'Failed to load data.';
		}
	}

	function handleRestore(id) {
		announcementToRestoreId = id;
		showRestoreModal = true;
	}

	async function confirmRestore() {
		if (!announcementToRestoreId) return;

		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch(`/api/announcements/${announcementToRestoreId}/archive`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ archived: false })
			});

			if (res.ok) {
				successMessage = 'Announcement restored successfully.';
				setTimeout(() => (successMessage = ''), 3000);
				sessionStorage.clear();
				fetchArchivedAnnouncements(currentPage, searchTerm);
			} else {
				const err = await res.json();
				error = err.error || 'Failed to restore announcement.';
			}
		} catch (e) {
			console.error('Error restoring announcement:', e);
			error = 'Network error while restoring.';
		} finally {
			showRestoreModal = false;
			announcementToRestoreId = null;
		}
	}

	onMount(() => {
		fetchArchivedAnnouncements(1, searchTerm);
	});

	function onSearchInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			fetchArchivedAnnouncements(1, searchTerm);
		}, 300);
	}

	function changePage(newPage) {
		if (newPage < 1 || newPage > totalPages) return;
		fetchArchivedAnnouncements(newPage, searchTerm);
	}
</script>

<ConfirmationModal
	show={showRestoreModal}
	title="Restore Announcement"
	message="Are you sure you want to restore this announcement? It will appear in the main list again."
	confirmText="Restore"
	confirmColor="green"
	on:close={() => (showRestoreModal = false)}
	on:confirm={confirmRestore}
/>

<div class="flex h-screen gap-4 bg-gray-50 p-4">
	<div class="h-full w-1/5 flex-shrink-0">
		<SideNavAdmin />
	</div>

	<div class="flex h-full flex-1 flex-col rounded-xl bg-white p-8 shadow-lg">
		<div class="mb-6">
			<h1 class="text-3xl font-bold text-gray-800">Archived Announcements</h1>
			<p class="text-sm text-gray-500">Pages / Announcement / Archived Announcements</p>
		</div>

		{#if error}
			<p class="mb-4 w-full rounded bg-red-100 p-2 text-center text-sm text-red-700">{error}</p>
		{/if}
		{#if successMessage}
			<p class="mb-4 w-full rounded bg-green-100 p-2 text-center text-sm text-green-700">
				{successMessage}
			</p>
		{/if}

		<div class="flex min-h-0 flex-grow flex-col">
			<div class="mb-4 flex items-center justify-between">
				<div class="flex items-center gap-4">
					<div class="relative">
						<input
							type="text"
							placeholder="Search..."
							class="w-64 rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-green-500 focus:outline-none"
							bind:value={searchTerm}
							oninput={onSearchInput}
						/>
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</div>
				</div>
				<div class="flex items-center gap-4">
					<button
						onclick={() => goto('/admin/main/announcements')}
						class="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
					>
						Back to Main List
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
									<div class="flex items-center gap-2">
										<span class="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600"
											>Archived</span
										>
										<button
											onclick={() => handleRestore(ann.ID)}
											class="flex items-center gap-1 text-green-600 transition-colors duration-200 hover:text-green-800"
											title="Restore Announcement"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="2"
												stroke="currentColor"
												class="h-5 w-5"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
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
