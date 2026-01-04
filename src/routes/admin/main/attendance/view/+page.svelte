<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import SideNavAdmin from '$lib/components/SideNavAdmin.svelte';

	let studentId = $derived($page.url.searchParams.get('id'));

	let studentInfo = $state({
		name: '',
		studentId: '',
		company: '',
		supervisor: '',
		targetHours: 0,
		totalRendered: 0,
		remainingHours: 0,
		isActive: 0
	});

	let attendanceRecords = $state([]);
	let currentPage = $state(1);
	let totalPages = $state(1);
	let limit = 10;
	let loading = $state(true);
	let error = $state('');

	async function fetchStudentAttendance(page) {
		if (!studentId) {
			error = 'No Student ID provided.';
			loading = false;
			return;
		}

		const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
		const queryString = params.toString();
		const cacheKey = `attendance_view_${studentId}?${queryString}`;
		const cachedData = sessionStorage.getItem(cacheKey);

		if (cachedData) {
			const data = JSON.parse(cachedData);
			studentInfo = data.student;
			attendanceRecords = data.records;
			currentPage = data.currentPage;
			totalPages = data.totalPages;
			loading = false;
			return;
		}

		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch(`/api/attendances/student/${studentId}?${queryString}`, {
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
				studentInfo = data.student;
				attendanceRecords = data.records;
				currentPage = data.currentPage;
				totalPages = data.totalPages;
				sessionStorage.setItem(cacheKey, JSON.stringify(data));
			} else {
				const err = await res.json();
				error = err.error || 'Failed to load attendance records.';
			}
		} catch (e) {
			console.error(e);
			error = 'Network error loading data.';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		fetchStudentAttendance(1);
	});

	function changePage(newPage) {
		if (newPage < 1 || newPage > totalPages) return;
		fetchStudentAttendance(newPage);
	}

	function handleBack() {
		goto('/admin/main/attendance');
	}

	function getStatusColor(status) {
		switch (status?.toLowerCase()) {
			case 'approved':
				return 'bg-green-100 text-green-700 ring-1 ring-green-600/20';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20';
			case 'denied':
				return 'bg-red-100 text-red-700 ring-1 ring-red-600/20';
			default:
				return 'bg-gray-100 text-gray-700 ring-1 ring-gray-600/20';
		}
	}

	function getProgressPercentage() {
		if (!studentInfo.targetHours || studentInfo.targetHours == 0) return 0;
		const pct = (studentInfo.totalRendered / studentInfo.targetHours) * 100;
		return pct > 100 ? 100 : pct.toFixed(0);
	}
</script>

<div class="flex h-screen gap-4 bg-gray-50 p-4">
	<div class="h-full w-1/5 flex-shrink-0">
		<SideNavAdmin />
	</div>

	<div class="flex h-full flex-1 flex-col overflow-hidden">
		<div class="flex-1 overflow-y-auto p-8">
			<div class="mx-auto flex max-w-[1600px] flex-col gap-6">
				<div class="flex items-center justify-between">
					<div>
						<h1 class="text-3xl font-bold text-gray-800">View Attendance</h1>
						<p class="mt-1 text-sm text-gray-500">
							Pages / Attendance / {studentInfo.name || 'Student'} / Records
						</p>
					</div>
					<button
						onclick={handleBack}
						class="flex h-10 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 shadow-sm transition hover:bg-gray-100"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2.5"
							stroke="currentColor"
							class="h-4 w-4 text-gray-600"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
							/>
						</svg>
						<span class="text-sm font-bold tracking-wide text-neutral-600 uppercase">Back</span>
					</button>
				</div>

				{#if loading}
					<div class="flex h-64 w-full items-center justify-center">
						<div
							class="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"
						></div>
					</div>
				{:else if error}
					<div class="flex h-64 w-full flex-col items-center justify-center text-red-600">
						<p class="text-xl font-bold">{error}</p>
					</div>
				{:else}
					<div
						class="w-full overflow-hidden rounded-xl border border-gray-100 bg-white p-8 shadow-sm"
					>
						<div class="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
							<div>
								<h3 class="text-lg font-bold text-gray-800">{studentInfo.name}</h3>
								<p class="text-xs font-medium text-gray-500">
									Student ID: {studentInfo.studentId}
								</p>
							</div>
							<div
								class="flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-3 py-1.5"
							>
								<span class="text-xs font-bold text-green-700 uppercase">Progress:</span>
								<span class="text-sm font-bold text-green-800">{getProgressPercentage()}%</span>
							</div>
						</div>

						<div class="grid grid-cols-1 gap-y-6 text-sm md:grid-cols-3 md:gap-y-0">
							<div class="space-y-4 border-gray-100 md:border-r md:pr-8">
								<div class="flex h-9 items-center justify-between">
									<span class="font-medium text-gray-500">Company:</span>
									<span class="font-semibold text-gray-900">{studentInfo.company}</span>
								</div>
								<div class="flex h-9 items-center justify-between">
									<span class="font-medium text-gray-500">Supervisor:</span>
									<span class="font-semibold text-gray-900">{studentInfo.supervisor}</span>
								</div>
							</div>
							<div class="space-y-4 border-gray-100 md:border-r md:px-8">
								<div class="flex h-9 items-center justify-between">
									<span class="font-medium text-gray-500">Target Hours:</span>
									<span class="font-semibold text-gray-900">{studentInfo.targetHours} Hrs</span>
								</div>
								<div class="flex h-9 items-center justify-between">
									<span class="font-medium text-gray-500">Rendered Hours:</span>
									<span class="font-semibold text-gray-900">{studentInfo.totalRendered} Hrs</span>
								</div>
							</div>
							<div class="space-y-4 md:pl-8">
								<div class="flex h-9 items-center justify-between">
									<span class="font-medium text-gray-500">Remaining Hours:</span>
									<span class="font-bold text-green-600">{studentInfo.remainingHours} Hrs</span>
								</div>
								<div class="flex h-9 items-center justify-between">
									<span class="font-medium text-gray-500">Status:</span>
									{#if studentInfo.isActive}
										<span
											class="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset"
											>Active</span
										>
									{:else}
										<span
											class="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset"
											>Inactive</span
										>
									{/if}
								</div>
							</div>
						</div>
					</div>

					<div
						class="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-8 shadow-sm"
					>
						<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
							<div>
								<h3 class="text-lg font-bold text-gray-800">Daily Attendance Logs</h3>
								<p class="text-sm text-gray-500">
									View and monitor daily time-in and time-out records.
								</p>
							</div>
						</div>

						<div class="overflow-hidden rounded-lg border border-gray-200">
							<table class="min-w-full divide-y divide-gray-200">
								<thead class="bg-gray-50">
									<tr>
										<th
											class="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-500 uppercase"
											>Date</th
										>
										<th
											class="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-500 uppercase"
											>Time In</th
										>
										<th
											class="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-500 uppercase"
											>Time Out</th
										>
										<th
											class="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-500 uppercase"
											>Hours</th
										>
										<th
											class="px-6 py-3 text-center text-xs font-bold tracking-wider text-gray-500 uppercase"
											>Status</th
										>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200 bg-white">
									{#if attendanceRecords.length === 0}
										<tr>
											<td
												colspan="5"
												class="px-6 py-8 text-center text-sm font-medium text-gray-500"
											>
												No attendance records found.
											</td>
										</tr>
									{:else}
										{#each attendanceRecords as record}
											<tr class="transition-colors hover:bg-gray-50">
												<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900"
													>{record.date}</td
												>
												<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-600"
													>{record.timeIn}</td
												>
												<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-600"
													>{record.timeOut}</td
												>
												<td class="px-6 py-4 text-sm font-semibold whitespace-nowrap text-gray-700"
													>{record.totalHours} Hrs</td
												>
												<td class="px-6 py-4 text-center whitespace-nowrap">
													<span
														class={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(record.status)}`}
													>
														{record.status}
													</span>
												</td>
											</tr>
										{/each}
									{/if}
								</tbody>
							</table>
						</div>

						<div class="mt-8 flex items-center justify-center">
							<nav
								class="isolate inline-flex -space-x-px rounded-md shadow-sm"
								aria-label="Pagination"
							>
								<button
									onclick={() => changePage(currentPage - 1)}
									disabled={currentPage === 1}
									class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 disabled:opacity-50"
								>
									Prev
								</button>

								{#each Array(totalPages) as _, i}
									{@const pageNum = i + 1}
									<button
										onclick={() => changePage(pageNum)}
										class:bg-green-500={currentPage === pageNum}
										class:text-white={currentPage === pageNum}
										class:hover:bg-green-600={currentPage === pageNum}
										class:text-gray-900={currentPage !== pageNum}
										class:hover:bg-gray-50={currentPage !== pageNum}
										class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset"
									>
										{pageNum}
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
				{/if}
			</div>
		</div>
	</div>
</div>
