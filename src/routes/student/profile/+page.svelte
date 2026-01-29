<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import SideNav from '$lib/components/SideNav.svelte';

	let isLoading = $state(true);
	let isSaving = $state(false);
	let isEditing = $state(false);
	let error = $state('');

	let studentId = $state(null);
	let studentData = $state({});
	let originalData = $state({});

	let docToRemove = $state(null);

	let uploadModal = $state({
		show: false,
		title: '',
		message: '',
		isProcessing: false,
		isSuccess: false,
		isConfirmation: false
	});

	let documentList = [
		{ name: 'Memorandum of Agreement', key: 'HasMOA', fileKey: 'MOA_File' },
		{ name: 'Parent Waiver', key: 'HasWaiver', fileKey: 'Waiver_File' },
		{ name: 'Endorsement Letter', key: 'HasEndorsement', fileKey: 'Endorsement_File' },
		{ name: 'Evaluation Form', key: 'HasEvaluation', fileKey: 'Evaluation_File' },
		{ name: 'Certificate of Completion', key: 'HasCompletion', fileKey: 'Completion_File' }
	];

	function formatDateForInput(dateString) {
		if (!dateString) return '';
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return '';
		return date.toISOString().split('T')[0];
	}

	function formatDateDisplay(dateString) {
		if (!dateString) return 'TBA';
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return 'TBA';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formatValue(value) {
		return value ? value : 'TBA';
	}

	async function fetchStudentDetails() {
		try {
			studentData = {};
			isLoading = true;
			error = '';

			const token = localStorage.getItem('sessionToken');
			if (!token) {
				goto('/login');
				return;
			}

			const authRes = await fetch(`/api/auth/me?t=${Date.now()}`, {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (!authRes.ok) throw new Error('Failed to authenticate');

			const authData = await authRes.json();
			studentId = authData.studentId;

			if (!studentId) {
				error = 'Student record not linked to this account.';
				isLoading = false;
				return;
			}

			const res = await fetch(`/api/students/${studentId}?t=${Date.now()}`, {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (res.ok) {
				const data = await res.json();
				studentData = { ...data };
				originalData = { ...data };
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

	async function saveChanges() {
		isSaving = true;
		try {
			const token = localStorage.getItem('sessionToken');

			const res = await fetch(`/api/students/${studentId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(studentData)
			});

			if (res.ok) {
				originalData = { ...studentData };
				isEditing = false;
			} else {
				const err = await res.json();
				alert(err.error || 'Failed to save changes.');
			}
		} catch (e) {
			console.error(e);
			alert('Network error while saving.');
		} finally {
			isSaving = false;
		}
	}

	async function handleFileUpload(event, docItem) {
		const file = event.target.files[0];
		if (!file) return;

		uploadModal = {
			show: true,
			title: 'Uploading...',
			message: `Please wait while we process your ${docItem.name}.`,
			isProcessing: true,
			isSuccess: false
		};

		const formData = new FormData();
		formData.append('file', file);

		try {
			const token = localStorage.getItem('sessionToken');

			const uploadRes = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
				headers: { Authorization: `Bearer ${token}` }
			});

			if (!uploadRes.ok) throw new Error('Upload failed');

			const { url } = await uploadRes.json();

			studentData[docItem.fileKey] = url;
			studentData[docItem.key] = 1;

			await saveChanges();

			uploadModal = {
				show: true,
				title: 'Success!',
				message: `${docItem.name} has been uploaded successfully.`,
				isProcessing: false,
				isSuccess: true
			};
		} catch (e) {
			console.error('Upload error:', e);
			uploadModal = {
				show: true,
				title: 'Upload Failed',
				message: 'Something went wrong. Please try again.',
				isProcessing: false,
				isSuccess: false
			};
		}
	}

	function triggerRemoveFile(docItem) {
		docToRemove = docItem; // Remember which file

		// Show the Confirmation Modal
		uploadModal = {
			show: true,
			title: 'Remove Document?',
			message: `Are you sure you want to remove the ${docItem.name}? This cannot be undone.`,
			isProcessing: false,
			isSuccess: false,
			isConfirmation: true // Turn on confirmation mode
		};
	}

	async function proceedWithRemove() {
		if (!docToRemove) return;

		// Switch modal to "Processing" state
		uploadModal = {
			show: true,
			title: 'Removing File...',
			message: 'Please wait while we update your records.',
			isProcessing: true,
			isSuccess: false,
			isConfirmation: false
		};

		try {
			const token = localStorage.getItem('sessionToken');

			const updateBody = {
				[docToRemove.fileKey]: null,
				[docToRemove.key]: 0
			};

			const res = await fetch(`/api/students/${studentData.StudentID}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(updateBody)
			});

			if (!res.ok) throw new Error('Failed to remove file');

			// Update UI
			studentData[docToRemove.fileKey] = null;
			studentData[docToRemove.key] = 0;

			// Switch modal to "Success" state
			uploadModal = {
				show: true,
				title: 'Removed Successfully',
				message: 'The file has been removed.',
				isProcessing: false,
				isSuccess: true,
				isConfirmation: false
			};

			docToRemove = null; // Cleanup
		} catch (e) {
			console.error(e);
			uploadModal = {
				show: true,
				title: 'Error',
				message: 'Failed to remove the file. Please try again.',
				isProcessing: false,
				isSuccess: false,
				isConfirmation: false
			};
		}
	}

	function cancelEdit() {
		studentData = { ...originalData };
		isEditing = false;
	}

	function handleBack() {
		goto('/student/dashboard');
	}

	onMount(() => {
		fetchStudentDetails();
	});
</script>

<div class="flex h-screen gap-4 bg-gray-50 p-4">
	<div class="h-full w-1/5 flex-shrink-0">
		<SideNav />
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
					<button onclick={handleBack} class="text-blue-600 underline">Return to Dashboard</button>
				</div>
			{:else}
				<div class="mx-auto flex max-w-[1600px] flex-col gap-8">
					<div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
						<div class="mb-2">
							<h1 class="text-3xl font-bold text-gray-800">Student’s Profile</h1>
							<p class="mt-1 text-sm text-gray-500">
								Pages / My Profile / {studentData.StudentName || 'Student'}
							</p>
						</div>

						<div class="flex flex-wrap items-center gap-3">
							{#if isEditing}
								<button
									onclick={cancelEdit}
									class="rounded-md border border-gray-300 bg-white px-6 py-2.5 font-bold text-gray-700 shadow-sm hover:bg-gray-100"
								>
									Cancel
								</button>
								<button
									onclick={saveChanges}
									disabled={isSaving}
									class="flex items-center gap-2 rounded-md bg-green-600 px-6 py-2.5 font-bold text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
								>
									{#if isSaving}Saving...{:else}Save Changes{/if}
								</button>
							{:else}
								<button
									onclick={handleBack}
									class="flex h-12 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 shadow-sm transition hover:bg-gray-100"
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
									<span class="text-sm font-bold tracking-wide text-neutral-600 uppercase"
										>Back</span
									>
								</button>

								<button
									onclick={() => (isEditing = true)}
									class="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 shadow-sm ring-1 ring-green-200 transition hover:bg-green-500 hover:text-white"
									title="Edit Profile"
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
							{/if}
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
									Personal Information <span class="ml-2 text-xs font-normal text-gray-400"
										>(Editable)</span
									>
								</h3>
								<div class="grid grid-cols-1 gap-y-6 text-sm md:grid-cols-3 md:gap-y-0">
									<div class="space-y-4 border-gray-100 md:border-r md:pr-8">
										<div class="flex h-9 items-center justify-between">
											<span class="font-medium text-gray-500">Student ID:</span>
											<span class="font-semibold text-gray-900"
												>{formatValue(studentData.StudentID)}</span
											>
										</div>
										<div class="flex h-9 items-center justify-between">
											<span class="self-center font-medium text-gray-500">Name:</span>
											{#if isEditing}
												<input
													type="text"
													bind:value={studentData.StudentName}
													class="w-1/2 rounded border-gray-300 px-2 py-1 text-right text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
												/>
											{:else}
												<span class="font-semibold text-gray-900"
													>{formatValue(studentData.StudentName)}</span
												>
											{/if}
										</div>
										<div class="flex h-9 items-center justify-between">
											<span class="self-center font-medium text-gray-500">Gender:</span>
											{#if isEditing}
												<select
													bind:value={studentData.Gender}
													class="w-1/2 rounded border-gray-300 px-2 py-1 text-right text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
												>
													<option value="Male">Male</option>
													<option value="Female">Female</option>
													<option value="Other">Other</option>
												</select>
											{:else}
												<span class="font-semibold text-gray-900"
													>{formatValue(studentData.Gender)}</span
												>
											{/if}
										</div>
									</div>

									<div class="space-y-4 border-gray-100 md:border-r md:px-8">
										<div class="flex h-9 items-center justify-between">
											<span class="self-center font-medium text-gray-500">Birthday:</span>
											{#if isEditing}
												<input
													type="date"
													value={formatDateForInput(studentData.BirthDate)}
													oninput={(e) => (studentData.BirthDate = e.target.value)}
													class="w-1/2 rounded border-gray-300 px-2 py-1 text-right text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
												/>
											{:else}
												<span class="font-semibold text-gray-900"
													>{formatDateDisplay(studentData.BirthDate)}</span
												>
											{/if}
										</div>
										<div class="flex h-9 items-center justify-between">
											<span class="font-medium text-gray-500">Age:</span>
											<span class="font-semibold text-gray-900">{formatValue(studentData.Age)}</span
											>
										</div>
										<div class="flex h-9 items-center justify-between">
											<span class="self-center font-medium text-gray-500">Section:</span>
											{#if isEditing}
												<input
													type="text"
													bind:value={studentData.Section}
													class="w-1/2 rounded border-gray-300 px-2 py-1 text-right text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
												/>
											{:else}
												<span class="font-semibold text-gray-900"
													>{formatValue(studentData.Section)}</span
												>
											{/if}
										</div>
									</div>

									<div class="space-y-4 md:pl-8">
										<div class="flex h-9 items-center justify-between">
											<span class="self-center font-medium text-gray-500">Email:</span>
											{#if isEditing}
												<input
													type="email"
													bind:value={studentData.Email}
													class="w-1/2 rounded border-gray-300 px-2 py-1 text-right text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
												/>
											{:else}
												<span
													class="max-w-[150px] truncate font-semibold text-gray-900"
													title={studentData.Email}>{formatValue(studentData.Email)}</span
												>
											{/if}
										</div>
										<div class="flex h-9 items-center justify-between">
											<span class="self-center font-medium text-gray-500">Contact:</span>
											{#if isEditing}
												<input
													type="text"
													bind:value={studentData.ContactNumber}
													class="w-1/2 rounded border-gray-300 px-2 py-1 text-right text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
												/>
											{:else}
												<span class="font-semibold text-gray-900"
													>{formatValue(studentData.ContactNumber)}</span
												>
											{/if}
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
							Internship Details <span class="ml-2 text-xs font-normal text-red-400"
								>(Read-Only)</span
							>
						</h3>
						<div class="grid grid-cols-1 gap-y-6 text-sm md:grid-cols-3 md:gap-y-0">
							<div class="space-y-4 border-gray-100 md:border-r md:pr-8">
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">Company Name:</span>
									<span class="font-semibold text-gray-900"
										>{formatValue(studentData.CompanyName)}</span
									>
								</div>
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">Address:</span>
									<span
										class="max-w-[150px] truncate text-right font-semibold text-gray-900"
										title={studentData.CompanyAddress}
										>{formatValue(studentData.CompanyAddress)}</span
									>
								</div>
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">Department:</span>
									<span class="font-semibold text-gray-900"
										>{formatValue(studentData.AssignedDepartment)}</span
									>
								</div>
							</div>

							<div class="space-y-4 border-gray-100 md:border-r md:px-8">
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">Role/Position:</span>
									<span class="font-semibold text-gray-900"
										>{formatValue(studentData.Position)}</span
									>
								</div>
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">Supervisor:</span>
									<span class="font-semibold text-gray-900"
										>{formatValue(studentData.SupervisorName)}</span
									>
								</div>
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">Supervisor Email:</span>
									<span
										class="max-w-[150px] truncate font-semibold text-gray-900"
										title={studentData.SupervisorEmail}
										>{formatValue(studentData.SupervisorEmail)}</span
									>
								</div>
							</div>

							<div class="space-y-4 md:pl-8">
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">Start Date:</span>
									<span class="font-semibold text-gray-900"
										>{formatDateDisplay(studentData.StartDate)}</span
									>
								</div>
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">End Date:</span>
									<span class="font-semibold text-gray-900"
										>{formatDateDisplay(studentData.EndDate)}</span
									>
								</div>
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">Supervisor Contact:</span>
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
							Hours & Progress <span class="ml-2 text-xs font-normal text-red-400">(Read-Only)</span
							>
						</h3>
						<div class="grid grid-cols-1 gap-16 text-sm md:grid-cols-2">
							<div class="space-y-4 border-gray-100 md:border-r md:pr-16">
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">Target Hours:</span>
									<span class="font-semibold text-gray-900">{studentData.TargetHours}</span>
								</div>
								<div class="flex h-9 items-center justify-between">
									<span class="font-medium text-gray-500">Rendered Hours:</span>
									<span class="font-semibold text-gray-900"
										>{studentData.RenderedHours || '0.00'}</span
									>
								</div>
								<div class="flex h-9 items-center justify-between">
									<span class="font-medium text-gray-500">Remaining Hours:</span>
									<span class="font-bold text-green-600">
										{Math.max(
											0,
											(studentData.TargetHours || 0) - (studentData.RenderedHours || 0)
										).toFixed(2)}
									</span>
								</div>
							</div>
							<div class="space-y-4"></div>
						</div>
					</div>

					<div
						class="w-full overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
					>
						<div class="mb-6 flex items-start justify-between border-b border-gray-100 pb-4">
							<div>
								<h3 class="text-lg font-bold text-gray-800">Documents & Records</h3>
								<p class="mt-0.5 text-xs font-medium text-gray-400">Required Documents Checklist</p>
							</div>
						</div>

						<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
							{#each documentList as doc}
								<div
									class="group flex items-center justify-between rounded-lg border border-gray-100 bg-white p-3 transition-all hover:border-green-200 hover:bg-green-50/30"
								>
									<div class="flex items-center gap-3 overflow-hidden">
										<div
											class={`flex h-10 w-8 flex-shrink-0 flex-col items-center justify-center rounded text-[9px] font-bold ring-1 ${studentData[doc.key] ? 'bg-green-50 text-green-600 ring-green-100' : 'bg-red-50 text-red-600 ring-red-100'}`}
										>
											PDF
										</div>

										<div class="flex flex-col overflow-hidden">
											<span
												class="truncate text-sm leading-tight font-medium text-gray-700"
												title={doc.name}>{doc.name}</span
											>
											{#if studentData[doc.key]}
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
													Uploaded
												</span>
											{:else}
												<span class="flex items-center gap-1 text-[10px] font-medium text-red-400"
													>Missing</span
												>
											{/if}
										</div>
									</div>

									<div class="flex items-center gap-2">
										{#if studentData[doc.key]}
											<a
												href={studentData[doc.fileKey]}
												target="_blank"
												rel="noopener noreferrer"
												class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
												title="View Document"
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
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
													/>
												</svg>
											</a>

											<a
												href={studentData[doc.fileKey]?.replace(
													'/upload/',
													'/upload/fl_attachment/'
												)}
												download="{doc.name}_{studentData.StudentID || 'Document'}"
												class="flex h-8 w-8 items-center justify-center rounded-md bg-green-50 text-green-600 transition-colors hover:bg-green-100"
												title="Download File"
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
											</a>

											<button
												onclick={() => triggerRemoveFile(doc)}
												class="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
												title="Remove File"
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
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
											</button>
										{:else}
											<label
												class="flex h-8 cursor-pointer items-center justify-center rounded-md border border-blue-600 bg-blue-600 px-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
											>
												Upload
												<input
													type="file"
													accept=".pdf,image/*"
													class="hidden"
													onchange={(e) => handleFileUpload(e, doc)}
													disabled={isSaving}
												/>
											</label>
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

{#if uploadModal.show}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
	>
		<div
			class="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl ring-1 ring-gray-200"
		>
			{#if uploadModal.isProcessing}
				<div class="mb-4 flex justify-center">
					<div
						class="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"
					></div>
				</div>
			{:else if uploadModal.isConfirmation}
				<div class="mb-4 flex justify-center">
					<div class="rounded-full bg-yellow-100 p-3 text-yellow-600">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							class="h-8 w-8"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
							/>
						</svg>
					</div>
				</div>
			{:else}
				<div class="mb-4 flex justify-center">
					<div
						class={`rounded-full p-3 ${uploadModal.isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
					>
						{#if uploadModal.isSuccess}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="3"
								stroke="currentColor"
								class="h-8 w-8"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
							</svg>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="3"
								stroke="currentColor"
								class="h-8 w-8"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						{/if}
					</div>
				</div>
			{/if}

			<h3 class="text-xl font-bold text-gray-900">{uploadModal.title}</h3>
			<p class="mt-2 text-sm text-gray-500">{uploadModal.message}</p>

			<div class="mt-6 flex justify-center gap-3">
				{#if uploadModal.isConfirmation}
					<button
						onclick={() => (uploadModal.show = false)}
						class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						onclick={proceedWithRemove}
						class="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
					>
						Remove
					</button>
				{:else if !uploadModal.isProcessing}
					<button
						onclick={() => (uploadModal.show = false)}
						class={`w-full rounded-lg py-2.5 text-sm font-semibold text-white shadow-sm transition-colors ${uploadModal.isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
					>
						OK
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}
