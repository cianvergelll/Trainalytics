<script>
	import { createEventDispatcher } from 'svelte';

	let { show = false, complaint = null } = $props();

	const dispatch = createEventDispatcher();
	let selectedStatus = $state('');

	$effect(() => {
		if (complaint) {
			selectedStatus = complaint.Status;
		}
	});

	function handleClose() {
		dispatch('close');
	}

	function handleUpdate() {
		if (selectedStatus && complaint) {
			dispatch('updateStatus', { id: complaint.ID, status: selectedStatus });
			handleClose();
		}
	}

	function getStatusColor(status) {
		switch (status?.toLowerCase()) {
			case 'resolved':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'urgent':
				return 'bg-red-100 text-red-800 border-red-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	}
</script>

{#if show && complaint}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
	>
		<div class="animate-fade-in-up w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
			<div class="flex items-start justify-between border-b border-gray-100 bg-gray-50 px-8 py-6">
				<div>
					<h2 class="text-2xl font-bold text-gray-800">{complaint.Concern}</h2>
					<p class="mt-1 text-sm text-gray-500">Ref ID: #{complaint.ID}</p>
				</div>
				<button
					aria-label="Close modal"
					onclick={handleClose}
					class="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<div class="space-y-6 p-8">
				<div class="flex items-center justify-between">
					<span class="text-sm font-semibold tracking-wide text-gray-500 uppercase"
						>Current Status</span
					>
					<span
						class={`rounded-full border px-4 py-1.5 text-sm font-bold ${getStatusColor(complaint.Status)} capitalize`}
					>
						{complaint.Status}
					</span>
				</div>

				<hr class="border-gray-100" />

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label
							for="name"
							class="mb-1 block text-xs font-bold tracking-wider text-gray-500 uppercase"
							>Student Name</label
						>
						<p class="text-lg font-medium text-gray-900">{complaint.StudentName}</p>
					</div>
					<div>
						<label
							for="date"
							class="mb-1 block text-xs font-bold tracking-wider text-gray-500 uppercase"
							>Date Filed</label
						>
						<p class="text-lg font-medium text-gray-900">{complaint.Date}</p>
					</div>
					<div>
						<label
							for="section"
							class="mb-1 block text-xs font-bold tracking-wider text-gray-500 uppercase"
							>Section</label
						>
						<p class="font-medium text-gray-900">{complaint.Section}</p>
					</div>
					<div>
						<label
							for="company"
							class="mb-1 block text-xs font-bold tracking-wider text-gray-500 uppercase"
							>Company</label
						>
						<p class="font-medium text-gray-900">{complaint.Company}</p>
					</div>
				</div>

				<div class="rounded-lg border border-gray-100 bg-gray-50 p-5">
					<label
						for="description"
						class="mb-3 block text-xs font-bold tracking-wider text-gray-500 uppercase"
					>
						Nature of Complaint / Concern
					</label>
					<p class="leading-relaxed whitespace-pre-wrap text-gray-700">
						{complaint.Description || complaint.Concern}
					</p>
				</div>
			</div>

			<div
				class="flex items-center justify-end gap-4 border-t border-gray-100 bg-gray-50 px-8 py-4"
			>
				<div class="flex items-center gap-3">
					<label for="status-select" class="text-sm font-medium text-gray-600">Update Status:</label
					>
					<select
						id="status-select"
						bind:value={selectedStatus}
						class="rounded-lg border-gray-300 py-2 pr-8 pl-3 text-sm focus:border-green-500 focus:ring-green-500 focus:outline-none"
					>
						<option value="pending">Pending</option>
						<option value="resolved">Resolved</option>
						<option value="urgent">Urgent</option>
					</select>
				</div>
				<button
					onclick={handleUpdate}
					class="rounded-lg bg-green-600 px-6 py-2 font-medium text-white transition-colors hover:bg-green-700"
				>
					Update
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in-up {
		animation: fade-in-up 0.2s ease-out forwards;
	}
</style>
