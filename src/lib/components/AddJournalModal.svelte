<script>
	import { createEventDispatcher } from 'svelte';

	let { show = false } = $props();
	let modalElement = $state();

	let journal = $state({
		studentId: '',
		title: '',
		date: '',
		description: ''
	});

	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
	}

	function handleSubmit(event) {
		event.preventDefault();
		dispatch('add', { ...journal });
		handleClose();
	}

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}

	function handleWindowClick(event) {
		if (event.target === modalElement) {
			handleClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} onclick={handleWindowClick} />

{#if show}
	<div
		bind:this={modalElement}
		class="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-gray-900"
	>
		<div class="w-full max-w-lg rounded-lg bg-white p-8 shadow-xl" role="dialog">
			<h2 class="mb-6 text-center text-2xl font-bold text-gray-800">Add Journal Entry</h2>
			<form onsubmit={handleSubmit} class="space-y-4">
				<div>
					<label for="studentId" class="block text-sm font-medium text-gray-700">Student ID</label>
					<input
						type="text"
						id="studentId"
						bind:value={journal.studentId}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
						placeholder="e.g., 21-1001-234"
						required
					/>
				</div>
				<div>
					<label for="title" class="block text-sm font-medium text-gray-700"
						>Task Name / Title</label
					>
					<input
						type="text"
						id="title"
						bind:value={journal.title}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
						placeholder="What task did you do?"
						required
					/>
				</div>
				<div>
					<label for="date" class="block text-sm font-medium text-gray-700">Date</label>
					<input
						type="date"
						id="date"
						bind:value={journal.date}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
						required
					/>
				</div>
				<div>
					<label for="description" class="block text-sm font-medium text-gray-700"
						>Description</label
					>
					<textarea
						id="description"
						bind:value={journal.description}
						rows="3"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
						placeholder="Describe your work..."
					></textarea>
				</div>
				<div class="mt-8 flex justify-end gap-4">
					<button
						type="button"
						onclick={handleClose}
						class="rounded-lg bg-gray-100 px-6 py-2 font-medium text-gray-700 hover:bg-gray-200"
						>Cancel</button
					>
					<button
						type="submit"
						class="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2 font-medium text-white hover:bg-green-600"
					>
						Add Journal
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
