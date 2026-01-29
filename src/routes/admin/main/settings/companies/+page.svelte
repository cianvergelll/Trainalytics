<script>
	import { onMount } from 'svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import AddCompanyModal from '$lib/components/AddCompanyModal.svelte';
	import ViewCompanyModal from '$lib/components/ViewCompanyModal.svelte';

	let companies = $state([]);
	let searchTerm = $state('');
	let isArchivedView = $state(false);
	let showAddModal = $state(false);
	let loading = $state(false);
	let error = $state('');
	let debounceTimer;

	let showViewModal = $state(false);
	let selectedCompany = $state(null);

	function handleView(company) {
		selectedCompany = company;
		showViewModal = true;
	}

	function handleEdit(company) {
		selectedCompany = company;
		showAddModal = true;
	}

	onMount(() => {
		fetchCompanies();
	});

	async function fetchCompanies() {
		loading = true;
		try {
			const token = localStorage.getItem('sessionToken');
			const query = new URLSearchParams({
				search: searchTerm,
				archived: isArchivedView.toString()
			});

			const res = await fetch(`/api/companies?${query}`, {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (res.ok) {
				companies = await res.json();
				error = '';
			} else {
				error = 'Failed to load companies.';
			}
		} catch (e) {
			console.error(e);
			error = 'Network error.';
		} finally {
			loading = false;
		}
	}

	function handleSearchInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			fetchCompanies();
		}, 300);
	}

	function toggleView() {
		isArchivedView = !isArchivedView;
		fetchCompanies();
	}

	async function handleArchive(id) {
		if (!confirm('Are you sure you want to archive this company?')) return;
		await performAction(id, 'archive');
	}

	async function handleRestore(id) {
		if (!confirm('Are you sure you want to restore this company?')) return;
		await performAction(id, 'restore');
	}

	async function performAction(id, action) {
		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch(`/api/companies/${id}/${action}`, {
				method: 'PUT',
				headers: { Authorization: `Bearer ${token}` }
			});

			if (res.ok) {
				fetchCompanies();
			} else {
				alert(`Failed to ${action} company.`);
			}
		} catch (e) {
			alert('Network error.');
		}
	}

	function handleAddClick() {
		selectedCompany = null;
		showAddModal = true;
	}

	function handleSuccess() {
		fetchCompanies();
		showAddModal = false;
	}
</script>

<div class="flex h-screen gap-4 bg-gray-50 p-4 font-sans">
	<div class="h-full w-1/5 flex-shrink-0">
		<SideNav activePage="companies" />
	</div>

	<div class="flex h-full flex-1 flex-col rounded-xl bg-white p-8 shadow-lg">
		<div class="mb-6">
			<h1 class="text-3xl font-bold text-gray-800">Settings</h1>
			<p class="text-sm text-gray-500">Pages / Settings</p>
		</div>

		<div class="flex h-full gap-6 overflow-hidden">
			<aside class="w-64 flex-shrink-0 rounded-lg border border-gray-200 bg-gray-50 p-4">
				<h2 class="mb-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
					General Settings
				</h2>
				<ul class="space-y-1 text-sm">
					<li>
						<button
							class="w-full rounded-md bg-white px-3 py-2 text-left font-medium text-green-600 shadow-sm ring-1 ring-gray-200"
						>
							Company Management
						</button>
					</li>
					<li>
						<button
							class="w-full rounded-md px-3 py-2 text-left font-medium text-gray-600 hover:bg-white hover:text-green-600 hover:shadow-sm"
						>
							OJT Role Management
						</button>
					</li>
					<li>
						<button
							class="w-full rounded-md px-3 py-2 text-left font-medium text-gray-600 hover:bg-white hover:text-green-600 hover:shadow-sm"
						>
							Password
						</button>
					</li>
					<li>
						<button
							class="w-full rounded-md px-3 py-2 text-left font-medium text-gray-600 hover:bg-white hover:text-green-600 hover:shadow-sm"
						>
							Theme Preference
						</button>
					</li>
				</ul>
			</aside>

			<main
				class="flex flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
			>
				<div class="mb-6 flex items-center justify-between">
					<div>
						<h2 class="text-xl font-bold text-gray-800">Company Management</h2>
						<p class="text-sm text-gray-500">
							{isArchivedView ? 'Archived Companies' : 'Manage OJT partner companies'}
						</p>
					</div>

					<div class="flex gap-3">
						<div class="relative">
							<input
								type="text"
								placeholder="Search..."
								class="rounded-lg border border-gray-300 py-2 pr-8 pl-3 text-sm focus:border-green-500 focus:outline-none"
								bind:value={searchTerm}
								oninput={handleSearchInput}
							/>
						</div>

						<button
							onclick={toggleView}
							class="rounded-lg border border-green-500 px-4 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-50"
						>
							{isArchivedView ? 'View Active' : 'Archived Companies'}
						</button>

						{#if !isArchivedView}
							<button
								onclick={handleAddClick}
								class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-600"
							>
								<span class="text-lg leading-none">+</span> Add Company
							</button>
						{/if}
					</div>
				</div>

				{#if error}
					<div class="mb-4 rounded bg-red-100 p-2 text-center text-sm text-red-700">{error}</div>
				{/if}

				<div class="flex-grow overflow-auto rounded-lg border border-gray-400">
					<table class="min-w-full table-auto text-left">
						<thead class="sticky top-0 border-b border-gray-400 bg-gray-50 shadow-sm">
							<tr>
								<th class="px-6 py-4 text-left text-sm font-bold tracking-wider text-black"
									>Company ID</th
								>
								<th class="px-6 py-4 text-left text-sm font-bold tracking-wider text-black"
									>Company</th
								>
								<th class="px-6 py-4 text-left text-sm font-bold tracking-wider text-black"
									>Address</th
								>
								<th class="px-6 py-4 text-left text-sm font-bold tracking-wider text-black"
									>Email</th
								>
								<th class="px-6 py-4 text-left text-sm font-bold tracking-wider text-black"
									>Contact</th
								>
								<th class="px-6 py-4 text-left text-sm font-bold tracking-wider text-black"
									>Time Out</th
								>
								<th class="px-6 py-4 text-center text-sm font-bold tracking-wider text-black"
									>Action</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100 bg-white">
							{#if loading}
								<tr>
									<td colspan="7" class="py-10 text-center text-gray-500">Loading...</td>
								</tr>
							{:else if companies.length === 0}
								<tr>
									<td colspan="7" class="py-10 text-center text-gray-500">No companies found.</td>
								</tr>
							{:else}
								{#each companies as company (company.ID)}
									<tr class="border-b border-gray-400 transition-colors hover:bg-gray-50">
										<td class="px-6 py-4 text-sm font-medium text-gray-900"
											>{company.FormattedID}</td
										>
										<td class="px-6 py-4 text-sm font-bold text-gray-800">{company.CompanyName}</td>
										<td class="px-6 py-4 text-sm text-gray-500">{company.Address}</td>
										<td class="px-6 py-4 text-sm text-gray-500">{company.Email}</td>
										<td class="px-6 py-4 text-sm text-gray-500">{company.ContactNumber}</td>
										<td class="px-6 py-4 text-sm text-gray-500">
											<span
												class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
											>
												{company.TimeOut}
											</span>
										</td>
										<td class="px-6 py-4 text-center">
											<div class="flex justify-center gap-3">
												<button
													onclick={() => handleView(company)}
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

												{#if !isArchivedView}
													<button
														onclick={() => handleEdit(company)}
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
														onclick={() => handleArchive(company.ID)}
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
												{:else}
													<button
														onclick={() => handleRestore(company.ID)}
														class="text-green-600 transition-colors hover:text-green-800"
														title="Restore"
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
																d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
															/>
														</svg>
													</button>
												{/if}
											</div>
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			</main>
		</div>
	</div>
</div>

<ViewCompanyModal
	show={showViewModal}
	company={selectedCompany}
	on:close={() => {
		showViewModal = false;
		selectedCompany = null;
	}}
/>

<AddCompanyModal
	show={showAddModal}
	companyToEdit={selectedCompany}
	on:close={() => {
		showAddModal = false;
		selectedCompany = null;
	}}
	on:success={handleSuccess}
/>
