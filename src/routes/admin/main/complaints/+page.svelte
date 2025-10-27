<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import SideNavAdmin from '$lib/components/SideNavAdmin.svelte';

	let complaints = $state([]);
	let currentPage = $state(1);
	let totalPages = $state(1);
	let searchTerm = $state('');
	let debounceTimer;
	const limit = 10;

	let error = $state('');
	let successMessage = $state('');

	function getStatusClasses(status) {
		switch (status) {
			case 'resolved':
				return 'bg-green-100 text-green-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'urgent':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	async function fetchComplaints(page, search = '') {
		const params = new URLSearchParams({ page, limit, search: search });
		const queryString = params.toString();
		const cacheKey = `complaints?${queryString}`;
		const cachedData = sessionStorage.getItem(cacheKey);

		if (cachedData) {
			try {
				const data = JSON.parse(cachedData);
				complaints = data.complaints;
				currentPage = data.currentPage;
				totalPages = data.totalPages;
				return;
			} catch (e) {
				console.error('Failed to parse cached data:', e);
				sessionStorage.removeItem(cacheKey);
			}
		}

		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch(`/api/complaints?${queryString}`, {
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
				complaints = data.complaints;
				currentPage = data.currentPage;
				totalPages = data.totalPages;
				sessionStorage.setItem(cacheKey, JSON.stringify(data));
			} else {
				const err = await res.json();
				console.error('Failed to fetch complaints:', err);
				error = err.error || 'Failed to fetch complaints data.';
			}
		} catch (e) {
			console.error('An error occurred:', e);
			error = 'An error occurred while fetching data.';
		}
	}

	async function handleStatusChange(complaintId, newStatus) {
		error = '';
		successMessage = '';
		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch(`/api/complaints/${complaintId}/status`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ status: newStatus })
			});

			if (res.ok) {
				successMessage = `Complaint #${complaintId} status updated successfully.`;
				complaints = complaints.map((c) =>
					c.ID === complaintId ? { ...c, Status: newStatus } : c
				);
				const cacheKey = `complaints?page=${currentPage}&limit=${limit}&search=${searchTerm}`;
				const cachedData = sessionStorage.getItem(cacheKey);
				if (cachedData) {
					try {
						const data = JSON.parse(cachedData);
						data.complaints = complaints;
						sessionStorage.setItem(cacheKey, JSON.stringify(data));
					} catch (e) {
						console.error('Error updating cache after status change:', e);
						sessionStorage.clear();
					}
				} else {
					sessionStorage.clear();
				}
				setTimeout(() => (successMessage = ''), 3000);
			} else {
				const err = await res.json();
				console.error('Failed to update status:', err);
				error = err.error || 'Failed to update status.';
			}
		} catch (e) {
			console.error('Error updating status:', e);
			error = 'A network error occurred while updating status.';
		}
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

<div class="flex h-screen gap-4 bg-gray-50 p-4">
	<div class="h-full w-1/5 flex-shrink-0">
		<SideNavAdmin />
	</div>

	<div class="flex h-full flex-1 flex-col rounded-xl bg-white p-8 shadow-lg">
		<div class="mb-6">
			<h1 class="text-3xl font-bold text-gray-800">Complaints</h1>
			<p class="text-sm text-gray-500">Pages / Complaints / Complaint List</p>
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
			</div>

			<div class="flex-grow overflow-auto rounded-lg border">
				<table class="min-w-full table-auto text-left">
					<thead class="sticky top-0 border-b bg-gray-50">
						<tr class="bg-green-50">
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Student Name</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Section</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Company</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Concern</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Date</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Status</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y">
						{#each complaints as comp (comp.ID)}
							<tr class="hover:bg-gray-50">
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">{comp.StudentName}</td
								>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">{comp.Section}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">{comp.Company}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">{comp.Concern}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">{comp.Date}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap">
									<select
										value={comp.Status}
										onchange={(e) => handleStatusChange(comp.ID, e.target.value)}
										class="{getStatusClasses(
											comp.Status
										)} appearance-none rounded-md border-none px-2 py-1 text-center text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:outline-none"
									>
										<option value="pending">Pending</option>
										<option value="resolved">Resolved</option>
										<option value="urgent">Urgent</option>
									</select>
								</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">
									<div class="flex items-center gap-3">
										<button class="text-gray-500 hover:text-green-600" aria-label="View Details">
											<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
												<path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
												<path
													fill-rule="evenodd"
													d="M.664 10.59a1.651 1.651 0 010-1.18l.879-1.148a1.651 1.651 0 011.087-.582l1.649-.033a1.651 1.651 0 011.53.86l.635 1.27a1.651 1.651 0 001.53.861l1.65-.033a1.651 1.651 0 001.086-.582l.88-1.148a1.651 1.651 0 000-1.18l-.88-1.147a1.651 1.651 0 00-1.086-.583l-1.65.033a1.651 1.651 0 00-1.53-.86l-.635-1.27a1.651 1.651 0 01-1.53-.86L6.22.842a1.651 1.651 0 01-1.087-.582L4.254.113a1.651 1.651 0 010 1.181l.88 1.147c.224.292.36.66.36 1.052v1.274c.36.36.36.36.36.36v-1.274a1.651 1.651 0 01-.36-1.052l-.88-1.148a1.651 1.651 0 01-1.086-.582l-1.65-.033a1.651 1.651 0 01-1.53-.86l-.635-1.27a1.651 1.651 0 00-1.53-.86L.842 6.22a1.651 1.651 0 00-1.087.582L-.394 7.948a1.651 1.651 0 000 1.181l.394 1.147c.224.292.36.66.36 1.052v1.274a1.651 1.651 0 00.36 1.052l.88 1.148zM10 15a5 5 0 100-10 5 5 0 000 10z"
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
						{#if page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)}
							<button
								onclick={() => changePage(page)}
								class:bg-green-500={currentPage === page}
								class:text-white={currentPage === page}
								class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
								>{page}</button
							>
						{:else if page === currentPage - 2 || page === currentPage + 2}
							<span
								class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset"
								>...</span
							>
						{/if}
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
