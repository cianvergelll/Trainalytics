<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import SideNav from '$lib/components/SideNav.svelte';
	import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
	import ViewComplaintModal from '$lib/components/ViewComplaintModal.svelte';

	let complaints = $state([]);
	let currentPage = $state(1);
	let totalPages = $state(1);
	let searchTerm = $state('');
	let debounceTimer;
	const limit = 10;
	let error = $state('');
	let successMessage = $state('');

	// Modals
	let showViewModal = $state(false);
	let showArchiveModal = $state(false);
	let selectedComplaint = $state(null);
	let complaintToArchiveId = $state(null);

	// --- FETCH DATA ---
	async function fetchComplaints(page, search = '') {
		const params = new URLSearchParams({ page, limit, search: search });
		const queryString = params.toString();
		const cacheKey = `student_complaints?${queryString}`;
		const cachedData = sessionStorage.getItem(cacheKey);

		if (cachedData) {
			const data = JSON.parse(cachedData);
			complaints = data.complaints || [];
			currentPage = data.currentPage;
			totalPages = data.totalPages;
			return;
		}

		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch(`/api/complaints?${queryString}`, {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (res.status === 401) {
				goto('/login');
				return;
			}

			if (res.ok) {
				const data = await res.json();
				complaints = data.complaints || [];
				currentPage = data.currentPage;
				totalPages = data.totalPages;
				sessionStorage.setItem(cacheKey, JSON.stringify(data));
			} else {
				// Fallback mock data if API fails/doesn't exist yet
				complaints = [
					{ ID: 1, Concern: 'Aircon leakage in Lab 2', Date: '2026-01-20', Status: 'Pending' },
					{ ID: 2, Concern: 'Missing OJT Allowance', Date: '2026-01-15', Status: 'Resolved' },
					{ ID: 3, Concern: 'Conflict in Schedule', Date: '2026-01-10', Status: 'Rejected' }
				];
			}
		} catch (e) {
			console.error(e);
			error = 'An error occurred while fetching data.';
		}
	}

	// --- HANDLERS ---
	function handleView(complaint) {
		selectedComplaint = complaint;
		showViewModal = true;
	}

	function handleEdit(complaint) {
		alert(`Edit functionality for: ${complaint.Concern}`);
		// logic to open edit modal goes here
	}

	function handleArchive(id) {
		complaintToArchiveId = id;
		showArchiveModal = true;
	}

	async function confirmArchive() {
		// Mock archive success
		showArchiveModal = false;
		successMessage = 'Complaint archived successfully.';
		setTimeout(() => (successMessage = ''), 3000);
	}

	onMount(() => {
		fetchComplaints(1, searchTerm);
	});

	function onSearchInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			sessionStorage.clear();
			fetchComplaints(1, searchTerm);
		}, 300);
	}

	function changePage(newPage) {
		if (newPage < 1 || newPage > totalPages) return;
		fetchComplaints(newPage, searchTerm);
	}
</script>

<ViewComplaintModal
	show={showViewModal}
	complaint={selectedComplaint}
	on:close={() => {
		showViewModal = false;
		selectedComplaint = null;
	}}
/>

<ConfirmationModal
	show={showArchiveModal}
	title="Archive Complaint"
	message="Are you sure you want to archive this complaint?"
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
			<h1 class="text-3xl font-bold text-gray-800">My Complaints</h1>
			<p class="text-sm text-gray-500">Pages / Complaints / List</p>
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
						<svg
							class="pointer-events-none absolute top-2.5 right-3 h-5 w-5 text-gray-400"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
				</div>

				<button
					class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 font-medium text-white transition-colors hover:bg-green-600"
				>
					<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path
							d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
						/>
					</svg>
					File Complaint
				</button>
			</div>

			<div class="flex-grow overflow-auto rounded-lg border border-gray-400">
				<table class="min-w-full table-auto text-left">
					<thead class="sticky top-0 border-b border-gray-400 bg-gray-50 shadow-sm">
						<tr>
							<th class="px-6 py-4 text-left text-sm font-bold tracking-wider text-black">
								Concern
							</th>

							<th class="px-6 py-4 text-left text-sm font-bold tracking-wider text-black">
								Date
							</th>

							<th class="px-6 py-4 text-center text-sm font-bold tracking-wider text-black">
								Status
							</th>

							<th class="px-6 py-4 text-center text-sm font-bold tracking-wider text-black">
								Action
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100 bg-white">
						{#if complaints.length === 0}
							<tr>
								<td colspan="4" class="px-6 py-8 text-center text-sm text-gray-500"
									>No complaints found.</td
								>
							</tr>
						{:else}
							{#each complaints as comp (comp.ID)}
								<tr class="border-b border-gray-400 transition-colors hover:bg-gray-50">
									<td class="px-6 py-4 text-sm font-medium text-gray-900">{comp.Concern}</td>

									<td class="px-6 py-4 text-sm text-gray-500">{comp.Date}</td>

									<td class="px-6 py-4 text-center">
										{#if comp.Status?.toLowerCase() === 'resolved'}
											<span
												class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
											>
												Resolved
											</span>
										{:else if comp.Status?.toLowerCase() === 'pending'}
											<span
												class="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"
											>
												Pending
											</span>
										{:else if comp.Status?.toLowerCase() === 'rejected'}
											<span
												class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800"
											>
												Rejected
											</span>
										{:else}
											<span
												class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
											>
												{comp.Status || 'Unknown'}
											</span>
										{/if}
									</td>

									<td class="px-6 py-4 text-center">
										<div class="flex items-center justify-center gap-3">
											<button
												onclick={() => handleView(comp)}
												class="text-blue-600 transition-colors hover:text-blue-800"
												title="View Details"
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
														d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
													/>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
													/>
												</svg>
											</button>

											<button
												onclick={() => handleEdit(comp)}
												class="text-orange-500 transition-colors hover:text-orange-700"
												title="Edit"
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
														d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
													/>
												</svg>
											</button>

											<button
												onclick={() => handleArchive(comp.ID)}
												class="text-red-600 transition-colors hover:text-red-800"
												title="Archive"
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
				<nav class="isolate inline-flex -space-x-px rounded-md shadow-sm">
					<button
						onclick={() => changePage(currentPage - 1)}
						disabled={currentPage === 1}
						class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 disabled:opacity-50"
					>
						Prev
					</button>
					{#each Array(totalPages) as _, i}
						{@const page = i + 1}
						<button
							onclick={() => changePage(page)}
							class:bg-green-500={currentPage === page}
							class:text-white={currentPage === page}
							class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
						>
							{page}
						</button>
					{/each}
					<button
						onclick={() => changePage(currentPage + 1)}
						disabled={currentPage === totalPages}
						class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 disabled:opacity-50"
					>
						Next
					</button>
				</nav>
			</div>
		</div>
	</div>
</div>
