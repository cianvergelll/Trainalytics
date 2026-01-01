<script>
	import { onMount } from 'svelte';
	import SideNavAdmin from '$lib/components/SideNavAdmin.svelte';

	// --- MOCK DATA FOR UI TESTING ---
	const MOCK_DATA = [
		{
			ID: 1,
			StudentName: 'John Doe',
			Section: 'BSCS-4A',
			Company: 'Tech Solutions Inc.',
			Date: '2023-10-24',
			Status: 'approved',
			DateApproved: '2023-10-25'
		},
		{
			ID: 2,
			StudentName: 'Jane Smith',
			Section: 'BSIT-3B',
			Company: 'Creative Design Co.',
			Date: '2023-10-24',
			Status: 'pending',
			DateApproved: '-'
		},
		{
			ID: 3,
			StudentName: 'Michael Brown',
			Section: 'BSCS-4A',
			Company: 'Data Systems',
			Date: '2023-10-23',
			Status: 'denied',
			DateApproved: '-'
		},
		{
			ID: 4,
			StudentName: 'Emily White',
			Section: 'BSIS-3A',
			Company: 'Network Corp',
			Date: '2023-10-22',
			Status: 'approved',
			DateApproved: '2023-10-23'
		},
		{
			ID: 5,
			StudentName: 'Chris Green',
			Section: 'BSIT-4C',
			Company: 'SoftDev LLC',
			Date: '2023-10-22',
			Status: 'pending',
			DateApproved: '-'
		},
		{
			ID: 6,
			StudentName: 'Sarah Black',
			Section: 'BSCS-3A',
			Company: 'Web Wizards',
			Date: '2023-10-21',
			Status: 'approved',
			DateApproved: '2023-10-21'
		}
	];

	let journals = $state([...MOCK_DATA]); // Initialize with mock data
	let currentPage = $state(1);
	let totalPages = $state(5); // Hardcoded for UI check
	let searchTerm = $state('');
	let error = $state('');

	// Simulate Search locally
	function onSearchInput() {
		if (!searchTerm) {
			journals = [...MOCK_DATA];
		} else {
			journals = MOCK_DATA.filter(
				(j) =>
					j.StudentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					j.Company.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}
	}

	// Simulate Page Change (Visual only)
	function changePage(newPage) {
		if (newPage < 1 || newPage > totalPages) return;
		currentPage = newPage;
		// In a real app, you would fetch new data here.
		// For UI testing, we just update the number.
	}

	// Simulate Logout
	function handleLogout() {
		console.log('Logout triggered (Static Mode)');
		// goto('/login');
	}
</script>

<div class="flex h-screen gap-4 bg-gray-50 p-4">
	<div class="h-full w-1/5 flex-shrink-0">
		<SideNavAdmin />
	</div>

	<div class="flex h-full flex-1 flex-col rounded-xl bg-white p-8 shadow-lg">
		<div class="mb-6">
			<h1 class="text-3xl font-bold text-gray-800">Journal Entries List (UI Test)</h1>
			<p class="text-sm text-gray-500">Pages / Journal / Journal Entries List</p>
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
							placeholder="Search mock data..."
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
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Date</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Status</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Date Approved</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y">
						{#each journals as journal (journal.ID)}
							<tr class="hover:bg-gray-50">
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800"
									>{journal.StudentName}</td
								>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">{journal.Section}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">{journal.Company}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">{journal.Date}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap">
									{#if journal.Status === 'approved'}
										<span
											class="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800"
											>Approved</span
										>
									{:else if journal.Status === 'pending'}
										<span
											class="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800"
											>Pending</span
										>
									{:else if journal.Status === 'denied'}
										<span class="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800"
											>Denied</span
										>
									{/if}
								</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800"
									>{journal.DateApproved}</td
								>
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
