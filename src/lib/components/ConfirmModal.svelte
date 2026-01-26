<script>
	import { fade, scale } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	export let isOpen = false;
	export let title = 'Are you sure?';
	export let message = 'Please confirm your action.';
	export let type = 'info';
	export let loading = false;

	const dispatch = createEventDispatcher();

	function onConfirm() {
		dispatch('confirm');
	}

	function onCancel() {
		dispatch('close');
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
	>
		<div
			class="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<div class="flex flex-col items-center px-6 pt-8 pb-4 text-center">
				<div
					class="mb-4 rounded-full p-3 {type === 'danger'
						? 'bg-red-100 text-red-600'
						: 'bg-blue-100 text-blue-600'}"
				>
					{#if type === 'danger'}
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
								d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
							/>
						</svg>
					{:else}
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
								d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					{/if}
				</div>

				<h3 class="text-xl font-bold text-gray-900">{title}</h3>
				<p class="mt-2 text-sm text-gray-500">{message}</p>
			</div>

			<div class="flex gap-3 border-t border-gray-100 bg-gray-50/50 p-4">
				<button
					on:click={onCancel}
					disabled={loading}
					class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
				>
					Cancel
				</button>

				<button
					on:click={onConfirm}
					disabled={loading}
					class="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm focus:ring-2 focus:ring-offset-1 disabled:opacity-70
                    {type === 'danger'
						? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
						: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}"
				>
					{#if loading}
						<svg
							class="h-4 w-4 animate-spin text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Processing...
					{:else}
						Confirm
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
