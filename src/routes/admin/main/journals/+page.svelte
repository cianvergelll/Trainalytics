<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import SideNavAdmin from '$lib/components/SideNavAdmin.svelte';

	let journals = $state([]);
	let currentPage = $state(1);
	let totalPages = $state(1);
	let searchTerm = $state('');
	let debounceTimer;
	const limit = 10;

	let error = $state('');

	async function fetchJournals(page, search = '') {
		const params = new URLSearchParams({ page, limit, search: search });
		const queryString = params.toString();
		const cacheKey = `journals?${queryString}`;
		const cachedData = sessionStorage.getItem(cacheKey);

		if (cachedData) {
			const data = JSON.parse(cachedData);
			journals = data.journals;
			currentPage = data.currentPage;
			totalPages = data.totalPages;
			return;
		}

		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch(`/api/journals?${queryString}`, {
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
				journals = data.journals;
				currentPage = data.currentPage;
				totalPages = data.totalPages;
				sessionStorage.setItem(cacheKey, JSON.stringify(data));
			} else {
				const err = await res.json();
				console.error('Failed to fetch journals:', err);
				error = err.error || 'Failed to fetch journals.';
			}
		} catch (e) {
			console.error('An error occurred:', e);
			error = 'An error occurred while fetching data.';
		}
	}

	onMount(() => {
		fetchJournals(1, searchTerm);
	});

	function onSearchInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			sessionStorage.clear();
			fetchJournals(1, searchTerm);
		}, 300);
	}

	function changePage(newPage) {
		if (newPage < 1 || newPage > totalPages) return;
		fetchJournals(newPage, searchTerm);
	}

	function handleView(journal) {
		goto(`/admin/main/journals/view?id=${journal.ID}`);
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
			<h1 class="text-3xl font-bold text-gray-500">Journal Entries List</h1>
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
							placeholder="Search..."
							class="w-64 rounded-lg border border-green-300 py-2 pr-10 pl-4focus:outline-none shadow-md"
							bind:value={searchTerm}
							oninput={onSearchInput}
						/>
						<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
							<svg class="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="green">
								<path
									fill-rule="evenodd"
									d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</div>
					<button
						class="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-100 shadow-md"
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

	<div class="flex-grow overflow-auto border-t border-green-100">
    <table class="min-w-full table-auto text-left">
        <thead class="sticky top-0 z-10 bg-green-50">
            <tr>
                <th class="border-b border-gray-100 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Student Name</th>
                <th class="border-b border-gray-100 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Section</th>
                <th class="border-b border-gray-100 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Company</th>
                <th class="border-b border-gray-100 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                <th class="border-b border-gray-100 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th class="border-b border-gray-100 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Date Approved</th>
                <th class="border-b border-gray-100 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">Action</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-50 bg-white">
            {#each journals as journal (journal.ID)}
                <tr class="group transition-all duration-200 hover:bg-gray-100 hover:text-[0.84rem]">
                    <td class="whitespace-nowrap px-1 py-1">
                        <div class="flex items-center gap-1">
                            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500 uppercase transition-colors group-hover:bg-green-100 group-hover:text-green-600">
                                {journal.StudentName.charAt(0)}
                            </div>
                            <span class="text-sm font-semibold text-gray-700">{journal.StudentName}</span>
                        </div>
                    </td>
                    <td class="whitespace-nowrap px-6 py-5 text-sm text-gray-500">{journal.Section}</td>
                    <td class="whitespace-nowrap px-6 py-5 text-sm text-gray-500">{journal.Company}</td>
                    <td class="whitespace-nowrap px-6 py-5 text-sm text-gray-500">{journal.Date}</td>
                    <td class="whitespace-nowrap px-6 py-5 text-sm">
                        {#if journal.Status === 'approved'}
                            <span class="inline-flex items-center gap-1.5 font-medium text-green-600">
                                <span class="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                                Approved
                            </span>
                        {:else if journal.Status === 'pending'}
                            <span class="inline-flex items-center gap-1.5 font-medium text-yellow-600">
                                <span class="h-1.5 w-1.5 rounded-full bg-yellow-600"></span>
                                Pending
                            </span>
                        {:else if journal.Status === 'denied'}
                            <span class="inline-flex items-center gap-1.5 font-medium text-red-600">
                                <span class="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                                Denied
                            </span>
                        {/if}
                    </td>
                    <td class="whitespace-nowrap px-6 py-5 text-sm text-gray-500">{journal.DateApproved}</td>
                    <td class="whitespace-nowrap px-6 py-5 text-right">
                        <button
											onclick={handleView(journal)}
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
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

			<div class="mt-auto flex items-center justify-center pt-10">
				<nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
					<button
						onclick={() => changePage(currentPage - 1)}
						disabled={currentPage === 1}
						class="relative inline-flex items-center rounded-l-md px-1 py-1 text-gray-400  hover:bg-gray-50 disabled:opacity-50"
						>Prev</button
					>
					{#each Array(totalPages) as _, i}
						{@const page = i + 1}
						{#if page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)}
							<button
								onclick={() => changePage(page)}
								class:bg-green-500={currentPage === page}
								class:text-white={currentPage === page}
								class="relative inline-flex items-center px-4 py-2 text-sm font-semibold  hover:bg-gray-50"
								>{page}</button
							>
						{:else if page === currentPage - 2 || page === currentPage + 2}
							<span
								class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 "
								>...</span
							>
						{/if}
					{/each}
					<button
						onclick={() => changePage(currentPage + 1)}
						disabled={currentPage === totalPages}
						class="relative inline-flex items-center rounded-r-md px-1 py-1 text-gray-400  hover:bg-gray-50 disabled:opacity-50"
						>Next</button
					>
				</nav>
			</div>
		</div>
	</div>
</div>
