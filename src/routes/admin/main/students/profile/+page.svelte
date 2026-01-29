<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import SideNavAdmin from '$lib/components/SideNavAdmin.svelte';

	let studentId = $derived($page.url.searchParams.get('id'));
	let companyOptions = $state([]);
	let autoEdit = $derived($page.url.searchParams.get('edit') === 'true');

	let isLoading = $state(true);
	let isSaving = $state(false);
	let isEditing = $state(false);
	let error = $state('');

	let studentData = $state({});
	let originalData = $state({});

	let isCompanyInvalid = $derived(
		studentData.CompanyName &&
			studentData.CompanyName !== 'None' &&
			studentData.CompanyName !== 'N/A' &&
			companyOptions.length > 0 &&
			!companyOptions.some((c) => c.CompanyName === studentData.CompanyName)
	);

	let documentList = [
		{ name: 'Memorandum of Agreement', key: 'HasMOA' },
		{ name: 'Parent Waiver', key: 'HasWaiver' },
		{ name: 'Endorsement Letter', key: 'HasEndorsement' },
		{ name: 'Evaluation Form', key: 'HasEvaluation' },
		{ name: 'Certificate of Completion', key: 'HasCompletion' }
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
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	}

	function formatValue(value) {
		return value ? value : 'TBA';
	}

	async function fetchStudentDetails() {
		if (!studentId) {
			error = 'No Student ID provided.';
			isLoading = false;
			return;
		}

		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch(`/api/students/${studentId}`, {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (res.ok) {
				const data = await res.json();
				studentData = { ...data };
				originalData = { ...data };
				if (autoEdit) isEditing = true;
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

	function handleCompanyChange(e) {
		const val = e.target.value;
		studentData.CompanyName = val;

		const match = companyOptions.find((c) => c.CompanyName === val);

		if (match) {
			studentData.CompanyAddress = match.Address || '';
		} else if (val === 'None' || val === 'N/A' || val === '') {
			studentData.CompanyAddress = '';
		}
	}

	async function saveChanges() {
		const inputName = (studentData.CompanyName || '').trim();

		const isValid =
			inputName === '' ||
			inputName === 'None' ||
			inputName === 'N/A' ||
			companyOptions.some((c) => c.CompanyName === inputName);

		if (!isValid) {
			alert(`"${inputName}" is not in the Company List.\nPlease select a valid company or "None".`);
			return;
		}

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
				alert('Failed to save changes.');
			}
		} catch (e) {
			console.error(e);
			alert('Network error while saving.');
		} finally {
			isSaving = false;
		}
	}

	function cancelEdit() {
		studentData = { ...originalData };
		isEditing = false;
	}

	async function fetchCompanyOptions() {
		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch('/api/companies?archived=false', {
				headers: { Authorization: `Bearer ${token}` }
			});
			if (res.ok) {
				companyOptions = await res.json();
			}
		} catch (e) {
			console.error('Failed to load companies', e);
		}
	}

	onMount(() => {
		fetchStudentDetails();
		fetchCompanyOptions();
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
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
										/></svg
									>
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
									Personal Information
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
							Internship Details
						</h3>
						<div class="grid grid-cols-1 gap-y-6 text-sm md:grid-cols-3 md:gap-y-0">
							<div class="space-y-4 border-gray-100 md:border-r md:pr-8">
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">Company Name:</span>
									{#if isEditing}
										<div class="relative w-1/2">
											<input
												type="text"
												list="company-list"
												value={studentData.CompanyName}
												oninput={handleCompanyChange}
												placeholder="Select company..."
												class="w-full rounded border px-2 py-1 text-right text-sm shadow-sm focus:ring-green-500
                {isCompanyInvalid
													? 'border-red-500 focus:border-red-500 focus:ring-red-500'
													: 'border-gray-300 focus:border-green-500'}"
											/>
											{#if isCompanyInvalid}
												<p class="absolute top-full right-0 mt-1 text-[10px] text-red-500">
													Must select from list
												</p>
											{/if}
										</div>

										<datalist id="company-list">
											<option value="None">Unassigned / No Company</option>
											{#each companyOptions as company}
												<option value={company.CompanyName}>{company.Address || ''}</option>
											{/each}
										</datalist>
									{:else}
										<span class="font-semibold text-gray-900">
											{formatValue(studentData.CompanyName)}
										</span>
									{/if}
								</div>
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">Address:</span>
									{#if isEditing}
										<input
											type="text"
											bind:value={studentData.CompanyAddress}
											class="w-1/2 rounded border-gray-300 px-2 py-1 text-right text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
										/>
									{:else}
										<span
											class="max-w-[150px] truncate text-right font-semibold text-gray-900"
											title={studentData.CompanyAddress}
											>{formatValue(studentData.CompanyAddress)}</span
										>
									{/if}
								</div>
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">Department:</span>
									{#if isEditing}
										<input
											type="text"
											bind:value={studentData.AssignedDepartment}
											class="w-1/2 rounded border-gray-300 px-2 py-1 text-right text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
										/>
									{:else}
										<span class="font-semibold text-gray-900"
											>{formatValue(studentData.AssignedDepartment)}</span
										>
									{/if}
								</div>
							</div>

							<div class="space-y-4 border-gray-100 md:border-r md:px-8">
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">Role/Position:</span>
									{#if isEditing}
										<input
											type="text"
											bind:value={studentData.Position}
											class="w-1/2 rounded border-gray-300 px-2 py-1 text-right text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
										/>
									{:else}
										<span class="font-semibold text-gray-900"
											>{formatValue(studentData.Position)}</span
										>
									{/if}
								</div>
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">Supervisor:</span>
									{#if isEditing}
										<input
											type="text"
											bind:value={studentData.SupervisorName}
											class="w-1/2 rounded border-gray-300 px-2 py-1 text-right text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
										/>
									{:else}
										<span class="font-semibold text-gray-900"
											>{formatValue(studentData.SupervisorName)}</span
										>
									{/if}
								</div>
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">Supervisor Email:</span>
									{#if isEditing}
										<input
											type="text"
											bind:value={studentData.SupervisorEmail}
											class="w-1/2 rounded border-gray-300 px-2 py-1 text-right text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
										/>
									{:else}
										<span
											class="max-w-[150px] truncate font-semibold text-gray-900"
											title={studentData.SupervisorEmail}
											>{formatValue(studentData.SupervisorEmail)}</span
										>
									{/if}
								</div>
							</div>

							<div class="space-y-4 md:pl-8">
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">Start Date:</span>
									{#if isEditing}
										<input
											type="date"
											value={formatDateForInput(studentData.StartDate)}
											oninput={(e) => (studentData.StartDate = e.target.value)}
											class="w-1/2 rounded border-gray-300 px-2 py-1 text-right text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
										/>
									{:else}
										<span class="font-semibold text-gray-900"
											>{formatDateDisplay(studentData.StartDate)}</span
										>
									{/if}
								</div>
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">End Date:</span>
									{#if isEditing}
										<input
											type="date"
											value={formatDateForInput(studentData.EndDate)}
											oninput={(e) => (studentData.EndDate = e.target.value)}
											class="w-1/2 rounded border-gray-300 px-2 py-1 text-right text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
										/>
									{:else}
										<span class="font-semibold text-gray-900"
											>{formatDateDisplay(studentData.EndDate)}</span
										>
									{/if}
								</div>
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">Supervisor Contact:</span>
									{#if isEditing}
										<input
											type="text"
											bind:value={studentData.SupervisorContact}
											class="w-1/2 rounded border-gray-300 px-2 py-1 text-right text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
										/>
									{:else}
										<span class="font-semibold text-gray-900"
											>{formatValue(studentData.SupervisorContact)}</span
										>
									{/if}
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
								<div class="flex h-9 items-center justify-between">
									<span class="self-center font-medium text-gray-500">Target Hours:</span>
									{#if isEditing}
										<input
											type="number"
											bind:value={studentData.TargetHours}
											class="w-1/2 rounded border-gray-300 px-2 py-1 text-right text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
										/>
									{:else}
										<span class="font-semibold text-gray-900">{studentData.TargetHours}</span>
									{/if}
								</div>
								<div class="flex h-9 items-center justify-between">
									<span class="font-medium text-gray-500">Rendered Hours:</span>
									<span class="font-semibold text-gray-900">{studentData.TotalHours || '0.00'}</span
									>
								</div>
								<div class="flex h-9 items-center justify-between">
									<span class="font-medium text-gray-500">Remaining Hours:</span>
									<span class="font-bold text-green-600"
										>{studentData.RemainingHours || '0.00'}</span
									>
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
							{#if !isEditing}
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
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M12 4.5v15m7.5-7.5h-15"
										/>
									</svg>
									UPLOAD NEW
								</button>
							{/if}
						</div>

						<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
							{#each documentList as doc}
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

											{#if !isEditing}
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
														Verified
													</span>
												{:else}
													<span
														class="flex items-center gap-1 text-[10px] font-medium text-gray-400"
													>
														Missing
													</span>
												{/if}
											{/if}
										</div>
									</div>

									<div class="flex items-center gap-1">
										{#if isEditing}
											<div class="flex items-center gap-2">
												<span class="text-xs text-gray-500"
													>{studentData[doc.key] ? 'Submitted' : 'Missing'}</span
												>
												<input
													type="checkbox"
													checked={!!studentData[doc.key]}
													onchange={(e) => (studentData[doc.key] = e.target.checked ? 1 : 0)}
													class="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
												/>
											</div>
										{:else if studentData[doc.key]}
											<div
												class="flex items-center opacity-0 transition-opacity group-hover:opacity-100"
											>
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
										{:else}
											<span
												class="rounded bg-gray-100 px-2 py-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase"
												>Missing</span
											>
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
