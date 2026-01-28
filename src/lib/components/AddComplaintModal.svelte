<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let { show = false, complaintToEdit = null } = $props();

	let title = $state('');
	let date = $state(new Date().toISOString().split('T')[0]);
	let description = $state('');
	let loading = $state(false);

	$effect(() => {
		if (show) {
			if (complaintToEdit) {
				title = complaintToEdit.Concern || complaintToEdit.Title || '';
				description = complaintToEdit.Description || '';
				try {
					date = new Date(complaintToEdit.Date).toISOString().split('T')[0];
				} catch (e) {
					date = new Date().toISOString().split('T')[0];
				}
			} else {
				resetForm();
			}
		}
	});

	async function handleSubmit() {
		if (!title || !description || !date) return alert('Please fill all fields');

		loading = true;
		try {
			const token = localStorage.getItem('sessionToken');

			const url = complaintToEdit
				? `/api/complaints/${complaintToEdit.ID}`
				: '/api/complaints/file';

			const method = complaintToEdit ? 'PUT' : 'POST';

			const res = await fetch(url, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ title, description, date })
			});

			if (res.ok) {
				dispatch('success');
				resetForm();
			} else {
				const err = await res.json();
				alert(err.error || 'Failed to submit complaint');
			}
		} catch (e) {
			alert('Network error');
		} finally {
			loading = false;
		}
	}

	function resetForm() {
		title = '';
		description = '';
		date = new Date().toISOString().split('T')[0];
	}
</script>

{#if show}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
		<div class="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
			<h2 class="mb-4 text-xl font-bold text-gray-800">
				{complaintToEdit ? 'Edit Complaint' : 'File a New Complaint'}
			</h2>

			<div class="space-y-4">
				<div>
					<label for="title" class="block text-sm font-medium text-gray-700">Concern Title</label>
					<input
						id="title"
						bind:value={title}
						type="text"
						class="mt-1 w-full rounded-lg border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-green-500"
						placeholder="e.g. Facility Issue"
					/>
				</div>

				<div>
					<label for="date" class="block text-sm font-medium text-gray-700">Date of Incident</label>
					<input
						id="date"
						bind:value={date}
						type="date"
						class="mt-1 w-full rounded-lg border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-green-500"
					/>
				</div>

				<div>
					<label for="description" class="block text-sm font-medium text-gray-700"
						>Description</label
					>
					<textarea
						id="description"
						bind:value={description}
						rows="4"
						class="mt-1 w-full rounded-lg border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-green-500"
						placeholder="Provide details..."
					></textarea>
				</div>
			</div>

			<div class="mt-6 flex justify-end gap-3">
				<button
					onclick={() => dispatch('close')}
					class="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
					>Cancel</button
				>
				<button
					onclick={handleSubmit}
					disabled={loading}
					class="rounded-lg bg-green-600 px-6 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50"
				>
					{loading ? 'Submitting...' : complaintToEdit ? 'Update' : 'Submit Complaint'}
				</button>
			</div>
		</div>
	</div>
{/if}
