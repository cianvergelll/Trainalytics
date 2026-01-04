<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import SideNavAdmin from '$lib/components/SideNavAdmin.svelte';
	import SetAnnouncementModal from '$lib/components/SetAnnouncementModal.svelte';
	import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
	import ViewAnnouncementModal from '$lib/components/ViewAnnouncementModal.svelte';

	let announcements = $state([]);
	let currentPage = $state(1);
	let totalPages = $state(1);
	let searchTerm = $state('');
	let debounceTimer;
	const limit = 10;
	let error = $state('');
	let successMessage = $state('');

	// Modal States
	let showSetAnnouncementModal = $state(false);
	let showViewModal = $state(false);
	let showArchiveModal = $state(false);

	let selectedAnnouncement = $state(null); // For View/Edit
	let announcementToArchiveId = $state(null); // For Archive

	async function fetchAnnouncements(page, search = '') {
		const params = new URLSearchParams({ page, limit, search: search });
		const queryString = params.toString();

		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch(`/api/announcements?${queryString}`, {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (res.status === 401) {
				localStorage.removeItem('sessionToken');
				goto('/login');
				return;
			}

			if (res.ok) {
				const data = await res.json();
				announcements = data.announcements;
				currentPage = data.currentPage;
				totalPages = data.totalPages;
			} else {
				error = 'Failed to fetch announcements.';
			}
		} catch (e) {
			console.error(e);
			error = 'An error occurred while fetching data.';
		}
	}

	// 1. VIEW ACTION
	function handleView(announcement) {
		selectedAnnouncement = announcement;
		showViewModal = true;
	}

	// 2. EDIT ACTION
	function handleEdit(announcement) {
		selectedAnnouncement = announcement; // Pass this to the SetModal to pre-fill
		showSetAnnouncementModal = true;
	}

	// Handle the actual update logic (passed to modal)
	async function handleUpdateAnnouncement(event) {
		const { id, ...data } = event.detail;
		// Remove attachment logic for now if not implemented
		delete data.attachment;

		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch(`/api/announcements/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(data)
			});

			if (res.ok) {
				showSetAnnouncementModal = false;
				selectedAnnouncement = null;
				successMessage = 'Announcement updated successfully.';
				setTimeout(() => (successMessage = ''), 3000);
				fetchAnnouncements(currentPage, searchTerm);
			} else {
				error = 'Failed to update announcement.';
			}
		} catch (e) {
			error = 'Network error during update.';
		}
	}

	async function handleSetAnnouncement(event) {
		// Existing Create Logic...
		const newAnnouncementData = event.detail;
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
				showSetAnnouncementModal = false;
				fetchAnnouncements(1, searchTerm);
				successMessage = 'Announcement created successfully.';
				setTimeout(() => (successMessage = ''), 3000);
			} else {
				error = 'Failed to set announcement.';
			}
		} catch (e) {
			error = 'A network error occurred.';
		}
	}

	// 3. ARCHIVE ACTION
	function handleArchive(id) {
		announcementToArchiveId = id;
		showArchiveModal = true;
	}

	async function confirmArchive() {
		if (!announcementToArchiveId) return;

		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch(`/api/announcements/${announcementToArchiveId}/archive`, {
				method: 'PATCH',
				headers: { Authorization: `Bearer ${token}` }
			});

			if (res.ok) {
				showArchiveModal = false;
				announcementToArchiveId = null;
				successMessage = 'Announcement archived successfully.';
				setTimeout(() => (successMessage = ''), 3000);
				fetchAnnouncements(currentPage, searchTerm);
			} else {
				error = 'Failed to archive announcement.';
			}
		} catch (e) {
			error = 'Network error during archive.';
		}
	}

	onMount(() => {
		fetchAnnouncements(1, searchTerm);
	});

	function onSearchInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			fetchAnnouncements(1, searchTerm);
		}, 300);
	}

	function changePage(newPage) {
		if (newPage < 1 || newPage > totalPages) return;
		fetchAnnouncements(newPage, searchTerm);
	}
</script>

<ViewAnnouncementModal
	show={showViewModal}
	announcement={selectedAnnouncement}
	on:close={() => {
		showViewModal = false;
		selectedAnnouncement = null;
	}}
/>

<SetAnnouncementModal
	show={showSetAnnouncementModal}
	announcementToEdit={selectedAnnouncement}
	on:close={() => {
		showSetAnnouncementModal = false;
		selectedAnnouncement = null;
	}}
	on:set={handleSetAnnouncement}
	on:update={handleUpdateAnnouncement}
/>

<ConfirmationModal
	show={showArchiveModal}
	title="Archive Announcement"
	message="Are you sure you want to archive this announcement? It will be hidden from the main list."
	confirmText="Archive"
	confirmColor="red"
	on:close={() => (showArchiveModal = false)}
	on:confirm={confirmArchive}
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
				</div>
				<div class="flex items-center gap-4">
					<button
						onclick={() => goto('/admin/main/announcements/archived')}
						class="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
					>
						Archived Announcements
					</button>

					<button
						onclick={() => ((selectedAnnouncement = null), (showSetAnnouncementModal = true))}
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
									<div class="flex items-center gap-2">
										<button
											onclick={() => handleView(ann)}
											class="text-emerald-700 transition-colors duration-200 hover:text-emerald-900"
											title="View Announcement"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="2"
												stroke="currentColor"
												class="size-5"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
												/>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
												/>
											</svg>
										</button>

										<button
											onclick={() => handleEdit(ann)}
											class="text-indigo-900 transition-colors duration-200 hover:text-indigo-700"
											title="Edit Announcement"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="2"
												stroke="currentColor"
												class="size-5"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
												/>
											</svg>
										</button>

										<button
											onclick={() => handleArchive(ann.ID)}
											class="text-red-600 transition-colors duration-200 hover:text-red-800"
											title="Archive Announcement"
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
													d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
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
