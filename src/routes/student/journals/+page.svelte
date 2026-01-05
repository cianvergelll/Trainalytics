<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import SideNav from '$lib/components/SideNav.svelte';
	import FilterDropdownPanel from '$lib/components/FilterDropdownPanel.svelte';
	import AddJournalModal from '$lib/components/AddJournalModal.svelte';
	import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';

	let journals = $state([]);
	let loading = $state(true);
	let error = $state('');
	let studentId = $state(null);

	let currentPage = $state(1);
	let totalPages = $state(1);
	let searchTerm = $state('');
	let limit = 10;
	let debounceTimer;

	let showFilterDropdown = $state(false);
	let filterButtonElement = $state();
	let showAddJournalModal = $state(false);
	let successMessage = $state('');
	let showArchiveModal = $state(false);
	let journalToArchiveId = $state(null);

	let filterOptions = $state({
		companies: [],
		sections: []
	});

	let selectedFilters = $state({
		status: [],
		hours: [],
		companies: [],
		sections: []
	});

	async function init() {
		try {
			const token = localStorage.getItem('sessionToken');
			if (!token) {
				goto('/login');
				return;
			}

			const authRes = await fetch('/api/auth/me', {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (!authRes.ok) throw new Error('Auth failed');
			const authData = await authRes.json();
			studentId = authData.studentId;

			if (studentId) {
				await fetchJournals(1);
			} else {
				error = 'No student profile linked to this account.';
			}
		} catch (e) {
			console.error('Init error:', e);
			error = 'Failed to load profile.';
		} finally {
			loading = false;
		}
	}

	async function fetchJournals(page) {
		if (!studentId) return;
		loading = true;

		try {
			const token = localStorage.getItem('sessionToken');

			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				search: searchTerm
			});

			if (selectedFilters.status.length > 0) {
				params.append('status', selectedFilters.status.join(','));
			}

			const res = await fetch(`/api/journals/student/${studentId}?${params.toString()}`, {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (res.ok) {
				const data = await res.json();
				journals = data.logs || [];
				const totalItems = data.total || 0;
				totalPages = Math.ceil(totalItems / limit) || 1;
				currentPage = page;
			} else {
				journals = [];
			}
		} catch (e) {
			console.error('Fetch journals error:', e);
			error = 'Failed to load journals.';
		} finally {
			loading = false;
		}
	}

	async function handleAddJournal(event) {
		const journalData = event.detail;

		try {
			const token = localStorage.getItem('sessionToken');

			const payload = { ...journalData, studentId };

			const res = await fetch('/api/journals', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(payload)
			});

			if (res.ok) {
				showAddJournalModal = false;
				successMessage = 'Journal entry submitted successfully.';
				setTimeout(() => (successMessage = ''), 3000);
				fetchJournals(1);
			} else {
				const errData = await res.json();
				alert(errData.error || 'Failed to submit journal.');
			}
		} catch (e) {
			console.error('Add journal error:', e);
			alert('Network error while adding journal.');
		}
	}

	function onSearchInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			fetchJournals(1);
		}, 500);
	}

	function changePage(newPage) {
		if (newPage < 1 || newPage > totalPages) return;
		fetchJournals(newPage);
	}

	function applyFilters() {
		fetchJournals(1);
		showFilterDropdown = false;
	}

	function clearFilters() {
		selectedFilters = { status: [], hours: [], companies: [], sections: [] };
		fetchJournals(1);
	}

	function handleWindowClick(event) {
		if (showFilterDropdown && filterButtonElement && !filterButtonElement.contains(event.target)) {
			showFilterDropdown = false;
		}
	}

	function handleArchive(id) {
		journalToArchiveId = id;
		showArchiveModal = true;
	}

	async function confirmArchive() {
		alert('Archive feature is currently restricted to Admins.');
		showArchiveModal = false;
	}

	function handleEdit(journal) {
		alert('Edit functionality requires backend implementation.');
	}

	function getStatusClass(status) {
		switch (status?.toLowerCase()) {
			case 'approved':
				return 'bg-green-100 text-green-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'denied':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	onMount(() => {
		init();
	});
</script>

<svelte:window onclick={handleWindowClick} />

<AddJournalModal
	show={showAddJournalModal}
	on:close={() => (showAddJournalModal = false)}
	on:add={handleAddJournal}
/>

<ConfirmationModal
	show={showArchiveModal}
	title="Archive Journal"
	message="Are you sure you want to archive this journal entry?"
	confirmText="Archive"
	confirmColor="red"
	on:close={() => (showArchiveModal = false)}
	on:confirm={confirmArchive}
/>

<div class="flex h-screen gap-4 bg-gray-50 p-4">
	<div class="h-full w-1/5 flex-shrink-0">
		<SideNav />
	</div>

	<div class="flex h-full flex-1 flex-col rounded-xl bg-white p-8 shadow-lg">
		<div class="mb-6">
			<h1 class="text-3xl font-bold text-gray-900">My Journals</h1>
			<p class="text-sm text-gray-500">Pages / Journals / Journal Entries List</p>
		</div>

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
							placeholder="Search by Title..."
							class="w-64 rounded-lg border border-gray-400 py-2 pr-4 pl-10 focus:border-green-500 focus:outline-none"
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

					<div class="relative" bind:this={filterButtonElement}>
						<button
							onclick={() => (showFilterDropdown = !showFilterDropdown)}
							class="flex items-center gap-2 rounded-lg border border-gray-400 px-4 py-2 text-gray-700 hover:bg-gray-100"
						>
							<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
								<path
									d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.59L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
								/>
							</svg>
							Filter By
						</button>

						{#if showFilterDropdown}
							<FilterDropdownPanel
								options={filterOptions}
								bind:selected={selectedFilters}
								on:close={() => (showFilterDropdown = false)}
								on:clear={clearFilters}
								on:apply={applyFilters}
							/>
						{/if}
					</div>
				</div>

				<div class="flex items-center gap-4">
					<button
						onclick={() => console.log('Go to archived journals')}
						class="rounded-lg border border-gray-400 bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
						>Archived Journals</button
					>
					<button
						onclick={() => (showAddJournalModal = true)}
						class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600"
					>
						<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path
								d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
							/>
						</svg>
						Add Journal
					</button>
				</div>
			</div>

			<div class="flex-grow overflow-auto rounded-lg border border-gray-400">
				<table class="min-w-full table-auto text-left">
					<thead class="sticky top-0 border-b border-gray-400 bg-gray-50">
						<tr>
							<th class="px-4 py-3 text-sm font-bold text-black">Date</th>
							<th class="px-4 py-3 text-sm font-bold text-black">Status</th>
							<th class="px-4 py-3 text-sm font-bold text-black">Title</th>
							<th class="px-4 py-3 text-sm font-bold text-black">Description</th>
							<th class="px-4 py-3 text-sm font-bold text-black">Date Approved</th>
							<th class="px-4 py-3 text-sm font-bold text-black">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-400">
						{#if loading}
							<tr>
								<td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500">
									Loading journals...
								</td>
							</tr>
						{:else if journals.length === 0}
							<tr>
								<td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500">
									No journal entries found.
								</td>
							</tr>
						{:else}
							{#each journals as journal (journal.ID || journal.id)}
								<tr class="hover:bg-gray-50">
									<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-900">
										{journal.Date ? new Date(journal.Date).toLocaleDateString() : '-'}
									</td>
									<td class="px-4 py-3 text-sm whitespace-nowrap">
										<span
											class={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(journal.Status)} capitalize`}
										>
											{journal.Status || 'Pending'}
										</span>
									</td>
									<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-900">
										<span class="font-medium">{journal.Title || 'No Title'}</span>
									</td>
									<td class="max-w-xs truncate px-4 py-3 text-sm whitespace-nowrap text-gray-900">
										{journal.Description || ''}
									</td>
									<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-900">
										{journal.DateApproved
											? new Date(journal.DateApproved).toLocaleDateString()
											: '-'}
									</td>
									<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-900">
										<div class="flex items-center gap-2">
											<button
												class="text-blue-700 transition-colors duration-200 hover:text-blue-900"
												title="View Details"
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
												onclick={() => handleEdit(journal)}
												class="text-amber-600 transition-colors duration-200 hover:text-amber-800"
												title="Edit Journal"
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
														d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
													/>
												</svg>
											</button>

											<button
												onclick={() => handleArchive(journal.ID)}
												class="text-red-600 transition-colors duration-200 hover:text-red-800"
												title="Archive Journal"
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
						{/if}
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
