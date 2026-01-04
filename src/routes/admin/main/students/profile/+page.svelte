<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import SideNavAdmin from '$lib/components/SideNavAdmin.svelte';

	let studentId = $derived($page.url.searchParams.get('id'));
	let isLoading = $state(true);
	let error = $state('');
	let studentData = $state({});

	// Dynamic mapping of DB columns to Document List
	let documents = $derived([
		{
			name: 'Memorandum of Agreement',
			status: studentData.HasMOA ? 'uploaded' : 'missing'
		},
		{
			name: 'Parent Waiver',
			status: studentData.HasWaiver ? 'uploaded' : 'missing'
		},
		{
			name: 'Endorsement Letter',
			status: studentData.HasEndorsement ? 'uploaded' : 'missing'
		},
		{
			name: 'Evaluation Form',
			status: studentData.HasEvaluation ? 'uploaded' : 'missing'
		},
		{
			name: 'Certificate of Completion',
			status: studentData.HasCompletion ? 'uploaded' : 'missing'
		}
	]);

	function formatValue(value) {
		return value ? value : 'TBD';
	}

	function formatDate(dateString) {
		if (!dateString) return 'TBD';
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return 'TBD';
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	}

	function formatNumber(value) {
		return value ? parseFloat(value).toFixed(2) : '0.00';
	}

	async function fetchStudentDetails() {
		if (!studentId) {
			error = 'No Student ID provided in URL.';
			isLoading = false;
			return;
		}

		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch(`/api/students/${studentId}`, {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (res.ok) {
				studentData = await res.json();
			} else {
				error = 'Student not found.';
			}
		} catch (e) {
			console.error(e);
			error = 'An error occurred while loading profile.';
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		fetchStudentDetails();
	});

	function handleBack() {
		goto('/admin/main/students');
	}
</script>

<div class="flex h-screen gap-4 bg-gray-50 p-4">
	<div class="h-full w-1/5 flex-shrink-0">
		<SideNavAdmin />
	</div>

	<div class="flex h-full flex-1 flex-col overflow-hidden">
		<div class="flex-1 overflow-y-auto p-8">
			{#if isLoading}
				<div class="flex h-full items-center justify-center">
					<div
						class="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"
					></div>
				</div>
			{:else if error}
				<div class="flex h-full flex-col items-center justify-center gap-4 text-red-600">
					<p class="text-xl font-bold">{error}</p>
					<button onclick={handleBack} class="text-blue-600 underline">Return to List</button>
				</div>
			{:else}
				<div class="mx-auto flex max-w-[1600px] flex-col gap-8">
					<div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
						<div class="mb-2">
							<h1 class="text-3xl font-bold text-gray-800">Student’s Profile</h1>
							<p class="mt-1 text-sm text-gray-500">
								Pages / Students / {studentData.StudentName || 'Student'} / Profile
							</p>
						</div>

						<div class="flex flex-wrap items-center gap-3">
							<button
								onclick={handleBack}
								class="flex h-12 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 shadow-sm transition hover:bg-gray-100 active:scale-95"
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
					</div>

					<div
						class="my-5 w-full overflow-hidden rounded-xl border border-gray-100 bg-white p-8 shadow-sm"
					>
						<div class="flex flex-col items-center gap-10 lg:flex-row lg:items-start">
							<div class="flex-shrink-0">
								<img
									src={`https://i.pravatar.cc/150?u=${studentData.StudentID}`}
									alt={studentData.StudentName}
									class="h-40 w-40 rounded-full border-4 border-gray-50 object-cover shadow-inner"
								/>
							</div>
							<div class="w-full flex-1">
								<h3 class="mb-6 border-b border-gray-100 pb-2 text-lg font-bold text-gray-800">
									Personal Information
								</h3>
								<div class="grid grid-cols-1 gap-y-6 text-sm md:grid-cols-3 md:gap-y-0">
									<div class="space-y-4 border-gray-100 md:border-r md:pr-8">
										<div class="flex items-center justify-between">
											<span class="font-medium text-gray-500">Student ID:</span>
											<span class="font-semibold text-gray-900"
												>{formatValue(studentData.StudentID)}</span
											>
										</div>
										<div class="flex items-center justify-between">
											<span class="font-medium text-gray-500">Name:</span>
											<span class="font-semibold text-gray-900"
												>{formatValue(studentData.StudentName)}</span
											>
										</div>
										<div class="flex items-center justify-between">
											<span class="font-medium text-gray-500">Gender:</span>
											<span class="font-semibold text-gray-900"
												>{formatValue(studentData.Gender)}</span
											>
										</div>
									</div>
									<div class="space-y-4 border-gray-100 md:border-r md:px-8">
										<div class="flex items-center justify-between">
											<span class="font-medium text-gray-500">Birthday:</span>
											<span class="font-semibold text-gray-900"
												>{formatDate(studentData.BirthDate)}</span
											>
										</div>
										<div class="flex items-center justify-between">
											<span class="font-medium text-gray-500">Age:</span>
											<span class="font-semibold text-gray-900">{formatValue(studentData.Age)}</span
											>
										</div>
										<div class="flex items-center justify-between">
											<span class="font-medium text-gray-500">Section:</span>
											<span class="font-semibold text-gray-900"
												>{formatValue(studentData.Section)}</span
											>
										</div>
									</div>
									<div class="space-y-4 md:pl-8">
										<div class="flex items-center justify-between">
											<span class="font-medium text-gray-500">Email:</span>
											<span class="truncate font-semibold text-gray-900"
												>{formatValue(studentData.Email)}</span
											>
										</div>
										<div class="flex items-center justify-between">
											<span class="font-medium text-gray-500">Contact:</span>
											<span class="font-semibold text-gray-900"
												>{formatValue(studentData.ContactNumber)}</span
											>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div
						class="w-full overflow-hidden rounded-xl border border-gray-100 bg-white p-8 shadow-sm"
					>
						<h3 class="mb-6 border-b border-gray-100 pb-2 text-lg font-bold text-gray-800">
							Internship Details
						</h3>
						<div class="grid grid-cols-1 gap-y-6 text-sm md:grid-cols-3 md:gap-y-0">
							<div class="space-y-4 border-gray-100 md:border-r md:pr-8">
								<div class="flex items-center justify-between">
									<span class="font-medium text-gray-500">Company Name:</span>
									<span class="font-semibold text-gray-900"
										>{formatValue(studentData.CompanyName)}</span
									>
								</div>
								<div class="flex items-center justify-between">
									<span class="font-medium text-gray-500">Address:</span>
									<span
										class="max-w-[150px] truncate text-right font-semibold text-gray-900"
										title={studentData.CompanyAddress}
										>{formatValue(studentData.CompanyAddress)}</span
									>
								</div>
								<div class="flex items-center justify-between">
									<span class="font-medium text-gray-500">Department:</span>
									<span class="font-semibold text-gray-900"
										>{formatValue(studentData.AssignedDepartment)}</span
									>
								</div>
							</div>
							<div class="space-y-4 border-gray-100 md:border-r md:px-8">
								<div class="flex items-center justify-between">
									<span class="font-medium text-gray-500">Role/Position:</span>
									<span class="font-semibold text-gray-900"
										>{formatValue(studentData.Position)}</span
									>
								</div>
								<div class="flex items-center justify-between">
									<span class="font-medium text-gray-500">Supervisor:</span>
									<span class="font-semibold text-gray-900"
										>{formatValue(studentData.SupervisorName)}</span
									>
								</div>
								<div class="flex items-center justify-between">
									<span class="font-medium text-gray-500">Supervisor Email:</span>
									<span
										class="max-w-[150px] truncate font-semibold text-gray-900"
										title={studentData.SupervisorEmail}
										>{formatValue(studentData.SupervisorEmail)}</span
									>
								</div>
							</div>
							<div class="space-y-4 md:pl-8">
								<div class="flex items-center justify-between">
									<span class="font-medium text-gray-500">Start Date:</span>
									<span class="font-semibold text-gray-900"
										>{formatDate(studentData.StartDate)}</span
									>
								</div>
								<div class="flex items-center justify-between">
									<span class="font-medium text-gray-500">End Date:</span>
									<span class="font-semibold text-gray-900">{formatDate(studentData.EndDate)}</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="font-medium text-gray-500">Supervisor Contact:</span>
									<span class="font-semibold text-gray-900"
										>{formatValue(studentData.SupervisorContact)}</span
									>
								</div>
							</div>
						</div>
					</div>

					<div
						class="w-full overflow-hidden rounded-xl border border-gray-100 bg-white p-8 shadow-sm"
					>
						<h3 class="mb-6 border-b border-gray-100 pb-2 text-lg font-bold text-gray-800">
							Hours & Progress
						</h3>
						<div class="grid grid-cols-1 gap-16 text-sm md:grid-cols-2">
							<div class="space-y-4 border-gray-100 md:border-r md:pr-16">
								<div class="flex items-center justify-between">
									<span class="font-medium text-gray-500">Target Hours:</span>
									<span class="font-semibold text-gray-900"
										>{formatNumber(studentData.TargetHours)}</span
									>
								</div>
								<div class="flex items-center justify-between">
									<span class="font-medium text-gray-500">Rendered Hours:</span>
									<span class="font-semibold text-gray-900"
										>{formatNumber(studentData.TotalHours)}</span
									>
								</div>
								<div class="flex items-center justify-between">
									<span class="font-medium text-gray-500">Remaining Hours:</span>
									<span class="font-bold text-green-600"
										>{formatNumber(studentData.RemainingHours)}</span
									>
								</div>
							</div>

							<div class="space-y-4">
								<div class="flex items-center justify-between">
									<span class="font-medium text-gray-500">MOA Submitted:</span>
									<span class={studentData.HasMOA ? 'font-bold text-green-600' : 'text-red-500'}
										>{studentData.HasMOA ? 'Yes' : 'No'}</span
									>
								</div>
								<div class="flex items-center justify-between">
									<span class="font-medium text-gray-500">Endorsement Letter:</span>
									<span
										class={studentData.HasEndorsement ? 'font-bold text-green-600' : 'text-red-500'}
										>{studentData.HasEndorsement ? 'Yes' : 'No'}</span
									>
								</div>
								<div class="flex items-center justify-between">
									<span class="font-medium text-gray-500">Waiver:</span>
									<span class={studentData.HasWaiver ? 'font-bold text-green-600' : 'text-red-500'}
										>{studentData.HasWaiver ? 'Yes' : 'No'}</span
									>
								</div>
							</div>
						</div>
					</div>

					<div
						class="w-full overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
					>
						<div class="mb-6 flex items-start justify-between border-b border-gray-100 pb-4">
							<div>
								<h3 class="text-lg font-bold text-gray-800">Documents & Records</h3>
								<p class="mt-0.5 text-xs font-medium text-gray-400">
									{documents.length} Required Documents
								</p>
							</div>
							<button
								class="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-green-700"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2.5"
									stroke="currentColor"
									class="h-4 w-4"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
								</svg>
								UPLOAD NEW
							</button>
						</div>

						<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
							{#each documents as doc}
								<div
									class="group flex items-center justify-between rounded-lg border border-gray-100 bg-white p-3 transition-all hover:border-green-200 hover:bg-green-50/30"
								>
									<div class="flex items-center gap-3 overflow-hidden">
										<div
											class="flex h-10 w-8 flex-shrink-0 flex-col items-center justify-center rounded bg-red-50 text-[9px] font-bold text-red-600 ring-1 ring-red-100"
										>
											PDF
										</div>
										<div class="flex flex-col overflow-hidden">
											<span
												class="truncate text-sm leading-tight font-medium text-gray-700"
												title={doc.name}>{doc.name}</span
											>
											{#if doc.status === 'uploaded'}
												<span
													class="flex items-center gap-1 text-[10px] font-medium text-green-600"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 20 20"
														fill="currentColor"
														class="h-3 w-3"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													Verified
												</span>
											{/if}
										</div>
									</div>

									<div class="flex items-center gap-1">
										{#if doc.status === 'missing'}
											<span
												class="rounded bg-gray-100 px-2 py-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase"
												>Missing</span
											>
										{:else}
											<div
												class="flex items-center opacity-0 transition-opacity group-hover:opacity-100"
											>
												<button
													class="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-green-600"
													title="View"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke-width="2"
														stroke="currentColor"
														class="h-4 w-4"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
														/>
													</svg>
												</button>
												<button
													class="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-blue-600"
													title="Download"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke-width="2"
														stroke="currentColor"
														class="h-4 w-4"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
														/>
													</svg>
												</button>
											</div>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
