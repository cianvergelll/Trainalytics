<script>
	import SideNavAdmin from '$lib/components/SideNavAdmin.svelte';

	const student = {
		id: '1234567',
		name: 'Diana Barleta',
		gender: 'Female',
		birthday: '01-01-2000',
		age: 25,
		address: 'Kadasig Phase 4 Buhisan C.C',
		email: 'daina@gmail.com',
		contact: '+63 6587689875',
		section: 'Section 1',
		photo: 'https://placehold.co/182x182'
	};

	const internship = {
		company: 'Tech Solution',
		address: 'Minglanilla',
		contact: '+637 5136813',
		dept: 'IT Department',
		role: 'UI/UX Designer',
		supervisor: 'Marlon Vezosa',
		email: 'marvy@technavyphil.com'
	};

	const progress = {
		target: 600,
		rendered: 415,
		remaining: 185,
		start: '06-16-2025',
		end: '09-16-2025'
	};

	const documents = [
		{ name: 'Memorandum of Agreement', type: 'PDF', status: 'uploaded' },
		{ name: 'Parent Waiver', type: 'PDF', status: 'uploaded' },
		{ name: 'Endorsement Letter', type: 'PDF', status: 'uploaded' },
		{ name: 'Evaluation Form', type: 'PDF', status: 'uploaded' },
		{ name: 'Certificate of Completion', type: 'PDF', status: 'uploaded' },
		{ name: 'Medical Certificate', type: 'PDF', status: 'missing' }
	];
</script>

<div class="flex h-screen w-full overflow-hidden bg-gray-50 font-sans text-gray-800">
	<div class="h-full w-1/5 flex-shrink-0 border-r border-gray-200 bg-white">
		<SideNavAdmin />
	</div>

	<div class="flex h-full flex-1 flex-col overflow-hidden">
		<div class="flex-1 overflow-y-auto p-8">
			<div class="mx-auto flex max-w-[1600px] flex-col gap-8">
				<div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
					<div class="mb-2">
						<h1 class="text-3xl font-bold text-gray-800">Student’s Profile</h1>
						<p class="mt-1 text-sm text-gray-500">
							Pages / Students / Student’s Master List / Student Profile
						</p>
					</div>

					<div class="flex flex-wrap items-center gap-3">
						<button
							aria-label="Edit Student Profile"
							class="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 shadow-sm ring-1 ring-green-200 transition hover:bg-green-500 hover:text-white"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="h-5 w-5"
							>
								<path
									d="M21.731 2.269a2.625 2.625 0 11-3.713 3.712l-1.828 1.827 3.713 3.713 1.828-1.828a2.625 2.625 0 013.713-3.713zM15.135 6.857l-11.83 11.83a.375.375 0 00-.093.156l-1.25 4.543a.375.375 0 00.455.455l4.543-1.25a.375.375 0 00.156-.093l11.83-11.83-3.713-3.713z"
								/>
							</svg>
						</button>
						<button
							class="flex h-12 items-center justify-center rounded-md border border-green-500 bg-white px-6 shadow-md transition hover:bg-gray-50"
						>
							<span class="text-sm font-bold tracking-wide text-neutral-700 uppercase"
								>View Journal</span
							>
						</button>
						<button
							class="flex h-12 items-center justify-center rounded-md border border-green-600 bg-green-500 px-6 shadow-md transition hover:bg-green-600"
						>
							<span class="text-sm font-bold tracking-wide text-white uppercase"
								>View Attendance Sheet</span
							>
						</button>
					</div>
				</div>

				<div
					class="my-5 w-full overflow-hidden rounded-xl border border-gray-100 bg-white p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]"
				>
					<div class="flex flex-col items-center gap-10 lg:flex-row lg:items-start">
						<div class="flex-shrink-0">
							<img
								src={student.photo}
								alt={student.name}
								class="h-40 w-40 rounded-full border-4 border-gray-50 object-cover shadow-inner"
							/>
						</div>
						<div class="w-full flex-1">
							<h3 class="mb-6 border-b border-gray-100 pb-2 text-lg font-bold text-gray-800">
								Students Information
							</h3>
							<div class="grid grid-cols-1 gap-y-6 text-sm md:grid-cols-3 md:gap-y-0">
								<div class="space-y-4 border-gray-100 md:border-r md:pr-8">
									<div class="flex items-center justify-between">
										<span class="font-medium text-gray-500">Student ID:</span>
										<span class="font-semibold text-gray-900">{student.id}</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="font-medium text-gray-500">Student Name:</span>
										<span class="font-semibold text-gray-900">{student.name}</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="font-medium text-gray-500">Gender:</span>
										<span class="font-semibold text-gray-900">{student.gender}</span>
									</div>
								</div>
								<div class="space-y-4 border-gray-100 md:border-r md:px-8">
									<div class="flex items-center justify-between">
										<span class="font-medium text-gray-500">Birthday:</span>
										<span class="font-semibold text-gray-900">{student.birthday}</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="font-medium text-gray-500">Age:</span>
										<span class="font-semibold text-gray-900">{student.age}</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="font-medium text-gray-500">Address:</span>
										<span
											class="max-w-[150px] truncate text-right font-semibold text-gray-900"
											title={student.address}>{student.address}</span
										>
									</div>
								</div>
								<div class="space-y-4 md:pl-8">
									<div class="flex items-center justify-between">
										<span class="font-medium text-gray-500">Email:</span>
										<span class="truncate font-semibold text-gray-900">{student.email}</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="font-medium text-gray-500">Contact:</span>
										<span class="font-semibold text-gray-900">{student.contact}</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="font-medium text-gray-500">Section:</span>
										<span class="font-semibold text-gray-900">{student.section}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div
					class="w-full overflow-hidden rounded-xl border border-gray-100 bg-white p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]"
				>
					<h3 class="mb-6 border-b border-gray-100 pb-2 text-lg font-bold text-gray-800">
						Internship Details
					</h3>
					<div class="grid grid-cols-1 gap-y-6 text-sm md:grid-cols-3 md:gap-y-0">
						<div class="space-y-4 border-gray-100 md:border-r md:pr-8">
							<div class="flex items-center justify-between">
								<span class="font-medium text-gray-500">Company Name:</span>
								<span class="font-semibold text-gray-900">{internship.company}</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="font-medium text-gray-500">Address:</span>
								<span class="text-right font-semibold text-gray-900">{internship.address}</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="font-medium text-gray-500">Contact:</span>
								<span class="font-semibold text-gray-900">{internship.contact}</span>
							</div>
						</div>
						<div class="space-y-4 border-gray-100 md:border-r md:px-8">
							<div class="flex items-center justify-between">
								<span class="font-medium text-gray-500">Department:</span>
								<span class="font-semibold text-gray-900">{internship.dept}</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="font-medium text-gray-500">Role:</span>
								<span class="font-semibold text-gray-900">{internship.role}</span>
							</div>
						</div>
						<div class="space-y-4 md:pl-8">
							<div class="flex items-center justify-between">
								<span class="font-medium text-gray-500">Supervisor:</span>
								<span class="font-semibold text-gray-900">{internship.supervisor}</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="font-medium text-gray-500">Email:</span>
								<span
									class="max-w-[150px] truncate font-semibold text-gray-900"
									title={internship.email}>{internship.email}</span
								>
							</div>
						</div>
					</div>
				</div>

				<div
					class="w-full overflow-hidden rounded-xl border border-gray-100 bg-white p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]"
				>
					<h3 class="mb-6 border-b border-gray-100 pb-2 text-lg font-bold text-gray-800">
						Hours & Progress
					</h3>
					<div class="grid grid-cols-1 gap-16 text-sm md:grid-cols-2">
						<div class="space-y-4 border-gray-100 md:border-r md:pr-16">
							<div class="flex items-center justify-between">
								<span class="font-medium text-gray-500">Target Hours:</span>
								<span class="font-semibold text-gray-900">{progress.target}</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="font-medium text-gray-500">Rendered Hours:</span>
								<span class="font-semibold text-gray-900">{progress.rendered}</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="font-medium text-gray-500">Remaining Hours:</span>
								<span class="font-bold text-green-600">{progress.remaining}</span>
							</div>
						</div>
						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<span class="font-medium text-gray-500">Start Date:</span>
								<span class="font-semibold text-gray-900">{progress.start}</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="font-medium text-gray-500">Tentative End Date:</span>
								<span class="font-semibold text-gray-900">{progress.end}</span>
							</div>
						</div>
					</div>
				</div>

				<div
					class="w-full overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]"
				>
					<div class="mb-6 flex items-start justify-between border-b border-gray-100 pb-4">
						<div>
							<h3 class="text-lg font-bold text-gray-800">Documents & Records</h3>
							<p class="mt-0.5 text-xs font-medium text-gray-400">
								{documents.length} Total Files Attached
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
											<span class="flex items-center gap-1 text-[10px] font-medium text-green-600">
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
		</div>
	</div>
</div>
