<script>
	import { createEventDispatcher } from 'svelte';

	// Props using Svelte 5 syntax
	let { show = false, complaint = null } = $props();

	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
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
		class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
	>
		<div class="animate-fade-in-up w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
			<div class="flex items-start justify-between border-b border-gray-100 bg-gray-50 px-8 py-6">
				<div>
					<h2 class="text-xl font-bold text-gray-800">{complaint.Concern || complaint.Title}</h2>
					<p class="mt-1 text-xs font-medium tracking-wider text-gray-400 uppercase">
						Reference ID: #{complaint.ID}
					</p>
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
					<div>
						<span class="block text-[10px] font-bold tracking-widest text-gray-400 uppercase"
							>Status</span
						>
						<span
							class={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusColor(complaint.Status)} capitalize`}
						>
							{complaint.Status}
						</span>
					</div>
					<div class="text-right">
						<span class="block text-[10px] font-bold tracking-widest text-gray-400 uppercase"
							>Date Filed</span
						>
						<p class="mt-1 text-sm font-semibold text-gray-700">{complaint.Date}</p>
					</div>
				</div>

				<hr class="border-gray-50" />

				<div>
					<label
						for="type"
						class="mb-2 block text-[10px] font-bold tracking-widest text-gray-400 uppercase"
					>
						Nature of Concern
					</label>
					<div class="rounded-xl border border-gray-100 bg-gray-50 p-5">
						<p class="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
							{complaint.Description || 'No detailed description provided.'}
						</p>
					</div>
				</div>

				{#if complaint.UpdatedAt && complaint.Status !== 'pending'}
					<div class="flex items-center gap-2 text-xs text-gray-400 italic">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						Last updated on {new Date(complaint.UpdatedAt).toLocaleDateString()}
					</div>
				{/if}
			</div>

			<div class="flex items-center justify-end border-t border-gray-50 bg-gray-50 px-8 py-4">
				<button
					onclick={handleClose}
					class="rounded-lg bg-gray-800 px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-gray-900 active:scale-95"
				>
					Close
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
