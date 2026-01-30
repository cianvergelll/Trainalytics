<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import SideNavAdmin from '$lib/components/SideNavAdmin.svelte';
	import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';

	let students = $state([]);
	let currentPage = $state(1);
	let totalPages = $state(1);
	let searchTerm = $state('');
	let debounceTimer;
	const limit = 10;

	let error = $state('');
	let successMessage = $state('');

	let showRestoreModal = $state(false);
	let studentToRestoreId = $state(null);

	function clearSessionCache(prefix) {
		if (typeof sessionStorage === 'undefined') return;
		Object.keys(sessionStorage).forEach((key) => {
			if (key.startsWith(prefix)) {
				sessionStorage.removeItem(key);
			}
		});
	}

	function handleManualRefresh() {
		clearSessionCache('students_archived');
		fetchArchivedStudents(currentPage, searchTerm);
	}

	async function fetchArchivedStudents(page, search = '') {
		const params = new URLSearchParams({
			page,
			limit,
			search: search,
			archived: 'true'
		});
		const queryString = params.toString();
		const cacheKey = `students_archived?${queryString}`;
		const cachedData = sessionStorage.getItem(cacheKey);

		if (cachedData) {
			const data = JSON.parse(cachedData);
			students = data.students;
			currentPage = data.currentPage;
			totalPages = data.totalPages;
			return;
		}

		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch(`/api/students?${queryString}`, {
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
				students = data.students;
				currentPage = data.currentPage;
				totalPages = data.totalPages;
				sessionStorage.setItem(cacheKey, JSON.stringify(data));
			}
		} catch (e) {
			console.error('An error occurred:', e);
			error = 'Failed to load archived students.';
		}
	}

	function handleRestore(studentId) {
		studentToRestoreId = studentId;
		showRestoreModal = true;
	}

	async function confirmRestore() {
		if (!studentToRestoreId) return;

		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch(`/api/students/${studentToRestoreId}/archive`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ archived: false })
			});

			if (res.ok) {
				successMessage = 'Student restored successfully.';
				setTimeout(() => (successMessage = ''), 3000);

				clearSessionCache('students_archived');
				clearSessionCache('students');

				fetchArchivedStudents(currentPage, searchTerm);
			} else {
				const err = await res.json();
				error = err.error || 'Failed to restore student.';
			}
		} catch (e) {
			console.error('Error restoring student:', e);
			error = 'Network error while restoring student.';
		} finally {
			showRestoreModal = false;
			studentToRestoreId = null;
		}
	}

	onMount(() => {
		fetchArchivedStudents(1, searchTerm);
	});

	function onSearchInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			clearSessionCache('students_archived');
			currentPage = 1;
			fetchArchivedStudents(1, searchTerm);
		}, 300);
	}

	function changePage(newPage) {
		if (newPage < 1 || newPage > totalPages) return;
		fetchArchivedStudents(newPage, searchTerm);
	}
</script>

<ConfirmationModal
	show={showRestoreModal}
	title="Restore Student"
	message="Are you sure you want to restore this student? They will be moved back to the main student list."
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
			<h1 class="text-3xl font-bold text-gray-800">Archived Students</h1>
			<p class="text-sm text-gray-500">Pages / Students / Archived Students</p>
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
							placeholder="Search by Name or ID..."
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
				<div class="flex items-center gap-2">
					<button
						onclick={handleManualRefresh}
						class="rounded-lg border border-gray-300 bg-white p-2 text-gray-600 transition-colors hover:bg-gray-50"
						title="Refresh Data"
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
								d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
							/>
						</svg>
					</button>

					<button
						onclick={() => goto('/admin/main/students')}
						class="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
					>
						Back to Master List
					</button>
				</div>
			</div>

			<div class="flex-grow overflow-auto">
				<table class="min-w-full table-auto text-left">
					<thead class="sticky top-0 border-b bg-gray-50">
						<tr>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Student ID</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Status</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Student Name</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Section</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Target Hours</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Company</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y">
						{#each students as student (student.StudentID)}
							<tr class="hover:bg-gray-50">
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800"
									>{student.StudentID}</td
								>
								<td class="px-4 py-3 text-sm whitespace-nowrap">
									<span class="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-600"
										>Archived</span
									>
								</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">
									<div class="flex items-center gap-3">
										<img
											src={student.avatar}
											alt={student.StudentName}
											class="h-8 w-8 rounded-full object-cover"
										/>
										<span>{student.StudentName}</span>
									</div>
								</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">{student.section}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800"
									>{student.TargetHours}</td
								>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800"
									>{student.CompanyName}</td
								>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">
									<div class="flex items-center gap-2">
										<button
											class="text-blue-700 transition-colors duration-200 hover:text-blue-900"
											aria-label="View Profile"
											title="View Profile"
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
													d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
												/>
											</svg>
										</button>

										<button
											class="text-emerald-700 transition-colors duration-200 hover:text-emerald-900"
											aria-label="View Attendance"
											title="View Attendance"
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
													d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3.75h.008v.008H6.75V15.75Zm0 3.75h.008v.008H6.75V19.5Z"
												/>
											</svg>
										</button>

										<button
											class="text-lime-600 transition-colors duration-200 hover:text-lime-800"
											aria-label="View Journals"
											title="View Journals"
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
													d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 01-6 2.292m0-14.25v14.25"
												/>
											</svg>
										</button>

										<button
											class="text-indigo-900 transition-colors duration-200 hover:text-indigo-700"
											aria-label="Edit Student"
											title="Edit Student"
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
											onclick={() => handleRestore(student.StudentID)}
											class="flex items-center gap-1 text-green-600 transition-colors duration-200 hover:text-green-800"
											title="Restore Student"
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
