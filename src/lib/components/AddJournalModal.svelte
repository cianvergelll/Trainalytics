<script>
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	let { show = false, journalToEdit = null } = $props();

	let title = $state('');
	let description = $state('');
	let date = $state(new Date().toISOString().split('T')[0]);
	let q1 = $state('');
	let q2 = $state('');
	let q3 = $state('');

	$effect(() => {
		if (show) {
			if (journalToEdit) {
				title = journalToEdit.Title || journalToEdit.taskName || '';
				description = journalToEdit.Description || journalToEdit.taskDescription || '';
				if (journalToEdit.Date) {
					try {
						date = new Date(journalToEdit.Date).toISOString().split('T')[0];
					} catch (e) {
						date = new Date().toISOString().split('T')[0];
					}
				}
				q1 = journalToEdit.Reflection1 || journalToEdit.q1 || '';
				q2 = journalToEdit.Reflection2 || journalToEdit.q2 || '';
				q3 = journalToEdit.Reflection3 || journalToEdit.q3 || '';
			} else {
				title = '';
				description = '';
				date = new Date().toISOString().split('T')[0];
				q1 = '';
				q2 = '';
				q3 = '';
			}
		}
	});

	function handleClose() {
		dispatch('close');
	}

	function handleSubmit(event) {
		event.preventDefault();
		if (!title.trim() || !description.trim() || !date || !q1.trim() || !q2.trim() || !q3.trim()) {
			alert('Please fill out all fields, including the reflections.');
			return;
		}

		const formData = { title, description, date, q1, q2, q3 };

		if (journalToEdit) {
			dispatch('update', { id: journalToEdit.ID, ...formData });
		} else {
			dispatch('add', formData);
		}
	}

	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			handleClose();
		}
	}

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if show}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div
			class="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl"
			transition:scale={{ duration: 200, start: 0.95 }}
			role="document"
		>
			<div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
				<h2 class="text-xl font-bold text-gray-800">
					{journalToEdit ? 'Edit Journal Entry' : 'New Journal Entry'}
				</h2>

				<button
					onclick={handleClose}
					class="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
					aria-label="Close"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<div class="overflow-y-auto p-6">
				<form id="journalForm" onsubmit={handleSubmit} class="space-y-6">
					<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
						<div>
							<label for="date" class="mb-1 block text-sm font-medium text-gray-700">Date</label>
							<input
								type="date"
								id="date"
								bind:value={date}
								class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
							/>
						</div>
						<div class="md:col-span-2">
							<label for="title" class="mb-1 block text-sm font-medium text-gray-700"
								>Task Title</label
							>
							<input
								type="text"
								id="title"
								bind:value={title}
								placeholder="e.g. Database Optimization"
								class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
							/>
						</div>
					</div>

					<div>
						<label for="description" class="mb-1 block text-sm font-medium text-gray-700">
							Task Description
						</label>
						<textarea
							id="description"
							rows="3"
							bind:value={description}
							placeholder="Describe the tasks you accomplished today..."
							class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						></textarea>
					</div>

					<div class="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
						<h3 class="text-sm font-semibold tracking-wide text-gray-800 uppercase">
							Daily Reflections
						</h3>

						<div>
							<label for="q1" class="mb-1 block text-sm font-medium text-gray-700">
								1. What did you learn today?
							</label>
							<textarea
								id="q1"
								rows="2"
								bind:value={q1}
								class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
							></textarea>
						</div>

						<div>
							<label for="q2" class="mb-1 block text-sm font-medium text-gray-700">
								2. What challenges did you encounter?
							</label>
							<textarea
								id="q2"
								rows="2"
								bind:value={q2}
								class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
							></textarea>
						</div>

						<div>
							<label for="q3" class="mb-1 block text-sm font-medium text-gray-700">
								3. How can you improve?
							</label>
							<textarea
								id="q3"
								rows="2"
								bind:value={q3}
								class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
							></textarea>
						</div>
					</div>
				</form>
			</div>

			<div class="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
				<button
					type="button"
					onclick={handleClose}
					class="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
				>
					Cancel
				</button>
				<button
					type="submit"
					form="journalForm"
					class="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
				>
					{journalToEdit ? 'Update Journal' : 'Submit Entry'}
				</button>
			</div>
		</div>
	</div>
{/if}
