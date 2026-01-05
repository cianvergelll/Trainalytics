<script>
	import SideNavAdmin from '$lib/components/SideNavAdmin.svelte';

	// Static Mock Data for Recent Reports
	let recentReports = [
		{
			id: 1,
			name: 'Weekly Attendance Summary - BSIT 4A',
			type: 'Attendance',
			date: 'Jan 05, 2026',
			generatedBy: 'Admin User',
			status: 'Ready'
		},
		{
			id: 2,
			name: 'Journal Compliance Report - Oct 2025',
			type: 'Journal',
			date: 'Jan 02, 2026',
			generatedBy: 'Coordinator',
			status: 'Ready'
		},
		{
			id: 3,
			name: 'Student Evaluation Results - Q4',
			type: 'Evaluation',
			date: 'Dec 28, 2025',
			generatedBy: 'Admin User',
			status: 'Archived'
		},
		{
			id: 4,
			name: 'System Error Logs - Dec 2025',
			type: 'System',
			date: 'Dec 25, 2025',
			generatedBy: 'System',
			status: 'Ready'
		}
	];
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
						<h1 class="text-3xl font-bold text-gray-800">Reports</h1>
						<p class="mt-1 text-sm text-gray-500">Pages / Reports / Overview</p>
					</div>
					<button
						class="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							class="h-5 w-5"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
						Generate Custom Report
					</button>
				</div>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					<div
						class="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
					>
						<div
							class="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-blue-50 transition-transform group-hover:scale-110"
						></div>
						<div class="relative">
							<div
								class="mb-4 inline-flex items-center justify-center rounded-lg bg-blue-100 p-3 text-blue-600"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									class="h-6 w-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
									/>
								</svg>
							</div>
							<h3 class="text-lg font-bold text-gray-800">Attendance</h3>
							<p class="mt-1 text-sm text-gray-500">
								Export student logs, summaries, and time-tracking sheets.
							</p>
							<button
								class="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
								>View Options &rarr;</button
							>
						</div>
					</div>

					<div
						class="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
					>
						<div
							class="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-emerald-50 transition-transform group-hover:scale-110"
						></div>
						<div class="relative">
							<div
								class="mb-4 inline-flex items-center justify-center rounded-lg bg-emerald-100 p-3 text-emerald-600"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									class="h-6 w-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 01-6 2.292m0-14.25v14.25"
									/>
								</svg>
							</div>
							<h3 class="text-lg font-bold text-gray-800">Journals</h3>
							<p class="mt-1 text-sm text-gray-500">
								Download journal entries, compliance reports, and narratives.
							</p>
							<button
								class="mt-4 text-sm font-semibold text-emerald-600 hover:text-emerald-800 hover:underline"
								>View Options &rarr;</button
							>
						</div>
					</div>

					<div
						class="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
					>
						<div
							class="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-amber-50 transition-transform group-hover:scale-110"
						></div>
						<div class="relative">
							<div
								class="mb-4 inline-flex items-center justify-center rounded-lg bg-amber-100 p-3 text-amber-600"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									class="h-6 w-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
									/>
								</svg>
							</div>
							<h3 class="text-lg font-bold text-gray-800">Evaluations</h3>
							<p class="mt-1 text-sm text-gray-500">
								Access performance reviews and company evaluation summaries.
							</p>
							<button
								class="mt-4 text-sm font-semibold text-amber-600 hover:text-amber-800 hover:underline"
								>View Options &rarr;</button
							>
						</div>
					</div>

					<div
						class="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
					>
						<div
							class="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-purple-50 transition-transform group-hover:scale-110"
						></div>
						<div class="relative">
							<div
								class="mb-4 inline-flex items-center justify-center rounded-lg bg-purple-100 p-3 text-purple-600"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									class="h-6 w-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
									/>
								</svg>
							</div>
							<h3 class="text-lg font-bold text-gray-800">System Logs</h3>
							<p class="mt-1 text-sm text-gray-500">
								View audit trails, system health, and user activity logs.
							</p>
							<button
								class="mt-4 text-sm font-semibold text-purple-600 hover:text-purple-800 hover:underline"
								>View Options &rarr;</button
							>
						</div>
					</div>
				</div>

				<div class="flex flex-col rounded-xl border border-gray-100 bg-white shadow-sm">
					<div class="border-b border-gray-100 px-6 py-4">
						<h3 class="text-lg font-bold text-gray-800">Recent Reports</h3>
					</div>

					<div class="overflow-x-auto">
						<table class="min-w-full divide-y divide-gray-200">
							<thead class="bg-gray-50">
								<tr>
									<th
										class="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-500 uppercase"
										>Report Name</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-500 uppercase"
										>Type</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-500 uppercase"
										>Date Generated</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-500 uppercase"
										>Generated By</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-500 uppercase"
										>Status</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-500 uppercase"
										>Action</th
									>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200 bg-white">
								{#each recentReports as report}
									<tr class="hover:bg-gray-50">
										<td class="px-6 py-4 whitespace-nowrap">
											<div class="flex items-center gap-3">
												<div
													class="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-gray-500"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke-width="1.5"
														stroke="currentColor"
														class="h-5 w-5"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
														/>
													</svg>
												</div>
												<span class="font-medium text-gray-900">{report.name}</span>
											</div>
										</td>
										<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-600">{report.type}</td>
										<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-600">{report.date}</td>
										<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-600"
											>{report.generatedBy}</td
										>
										<td class="px-6 py-4 whitespace-nowrap">
											<span
												class="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset"
											>
												{report.status}
											</span>
										</td>
										<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
											<button
												aria-label="button"
												class="text-gray-500 transition-colors hover:text-green-600"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="1.5"
													stroke="currentColor"
													class="h-5 w-5"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
													/>
												</svg>
											</button>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
