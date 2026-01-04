<script>
	import { createEventDispatcher } from 'svelte';
	let { show = false, announcementToEdit = null } = $props();
	let modalElement = $state();
	let announcement = $state({
		title: '',
		description: '',
		startDate: '',
		endDate: '',
		startTime: '09:00',
		endTime: '16:00',
		attachment: null
	});

	function extractDate(dateVal) {
		if (!dateVal) return '';
		const d = new Date(dateVal);
		return d.toISOString().split('T')[0];
	}

	function extractTime(dateVal) {
		if (!dateVal) return '09:00';
		const d = new Date(dateVal);
		return d.toTimeString().slice(0, 5);
	}

	$effect(() => {
		if (show && announcementToEdit) {
			announcement.title = announcementToEdit.Title || '';
			announcement.description = announcementToEdit.Description || '';
			announcement.startDate = extractDate(announcementToEdit.StartDate);
			announcement.startTime = extractTime(announcementToEdit.StartDate);
			announcement.endDate = extractDate(announcementToEdit.EndDate);
			announcement.endTime = extractTime(announcementToEdit.EndDate);
		} else if (show && !announcementToEdit) {
			announcement = {
				title: '',
				description: '',
				startDate: '',
				endDate: '',
				startTime: '09:00',
				endTime: '16:00',
				attachment: null
			};
		}
	});

	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
	}

	function handleSubmit(event) {
		event.preventDefault();
		if (announcementToEdit) {
			dispatch('update', { id: announcementToEdit.ID, ...announcement });
		} else {
			dispatch('set', { ...announcement });
		}
		handleClose();
	}

	function handleKeydown(event) {
		if (event.key === 'Escape') handleClose();
	}

	function handleWindowClick(event) {
		if (event.target === modalElement) handleClose();
	}

	function handleFileDrop(e) {
		if (e.dataTransfer.files) announcement.attachment = e.dataTransfer.files[0];
	}

	function handleFileInput(e) {
		if (e.target.files) announcement.attachment = e.target.files[0];
	}
</script>

<svelte:window onkeydown={handleKeydown} onclick={handleWindowClick} />

{#if show}
	<div
		bind:this={modalElement}
		class="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-gray-300/85"
	>
		<div
			class="w-full max-w-2xl rounded-lg border-4 border-green-200 bg-white p-6 shadow-xl"
			role="dialog"
		>
			<h2 class="mb-4 text-center text-2xl font-bold text-gray-800">
				{announcementToEdit ? 'Edit Announcement' : 'Set Announcement'}
			</h2>

			<form onsubmit={handleSubmit} class="space-y-4">
				<div>
					<label for="title" class="block text-sm font-medium text-gray-700"
						>Announcement Title</label
					>
					<input
						type="text"
						id="title"
						bind:value={announcement.title}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
						placeholder="Enter Announcement Title..."
						required
					/>
				</div>

				<div>
					<label for="description" class="block text-sm font-medium text-gray-700"
						>Description</label
					>
					<textarea
						id="description"
						bind:value={announcement.description}
						rows="3"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
						placeholder="Enter details..."
						required
					></textarea>
				</div>

				<div>
					<p class="block text-sm font-medium text-gray-700">When:</p>
					<div class="mt-2 grid grid-cols-2 gap-x-4 gap-y-3">
						<fieldset>
							<legend class="block text-xs font-medium text-gray-500">Date Range:</legend>
							<div class="mt-1 grid grid-cols-2 gap-2">
								<div>
									<label for="startDate" class="block text-xs text-gray-500">Start Date</label>
									<input
										type="date"
										id="startDate"
										bind:value={announcement.startDate}
										class="mt-1 block w-full rounded-md border-gray-300 text-xs shadow-sm focus:border-green-500 focus:ring-green-500"
										required
									/>
								</div>
								<div>
									<label for="endDate" class="block text-xs text-gray-500">End Date</label>
									<input
										type="date"
										id="endDate"
										bind:value={announcement.endDate}
										class="mt-1 block w-full rounded-md border-gray-300 text-xs shadow-sm focus:border-green-500 focus:ring-green-500"
										required
									/>
								</div>
							</div>
						</fieldset>

						<fieldset>
							<legend class="block text-xs font-medium text-gray-500">Time:</legend>
							<div class="mt-1 grid grid-cols-2 gap-2">
								<div>
									<label for="startTime" class="block text-xs text-gray-500">From</label>
									<input
										type="time"
										id="startTime"
										bind:value={announcement.startTime}
										class="mt-1 block w-full rounded-md border-gray-300 text-xs shadow-sm focus:border-green-500 focus:ring-green-500"
										required
									/>
								</div>
								<div>
									<label for="endTime" class="block text-xs text-gray-500">To</label>
									<input
										type="time"
										id="endTime"
										bind:value={announcement.endTime}
										class="mt-1 block w-full rounded-md border-gray-300 text-xs shadow-sm focus:border-green-500 focus:ring-green-500"
										required
									/>
								</div>
							</div>
						</fieldset>
					</div>
				</div>

				<div>
					<label for="file-upload" class="block text-sm font-medium text-gray-700">Attachment</label
					>
					<div
						role="button"
						tabindex="0"
						aria-label="File upload"
						class="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-4 py-4"
						ondragover={(event) => {
							event.preventDefault();
							event.currentTarget.classList.add('border-green-500', 'bg-gray-50');
						}}
						ondragleave={(event) => {
							event.currentTarget.classList.remove('border-green-500', 'bg-gray-50');
						}}
						ondrop={(event) => {
							event.preventDefault();
							event.currentTarget.classList.remove('border-green-500', 'bg-gray-50');
							handleFileDrop(event);
						}}
					>
						<div class="space-y-1 text-center">
							<svg
								class="mx-auto h-8 w-8 text-gray-400"
								stroke="currentColor"
								fill="none"
								viewBox="0 0 48 48"
							>
								<path
									d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							<div class="flex justify-center text-sm text-gray-600">
								<label
									for="file-upload"
									class="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500"
								>
									<span>Drop file or browse</span>
									<input
										id="file-upload"
										name="file-upload"
										type="file"
										class="sr-only"
										onchange={handleFileInput}
									/>
								</label>
							</div>
							<p class="text-xs text-gray-500">Format: .jpeg, .png & Max: 25 MB</p>
							{#if announcement.attachment}
								<p class="text-sm font-medium text-green-700">
									Selected: {announcement.attachment.name}
								</p>
							{/if}
						</div>
					</div>
				</div>

				<div class="mt-4 flex justify-end gap-3 pt-2">
					<button
						type="button"
						onclick={handleClose}
						class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
					>
						<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
							<path
								d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
							/>
						</svg>
						{announcementToEdit ? 'Update' : 'Set Announcement'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
