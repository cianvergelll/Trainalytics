<script>
	import { createEventDispatcher } from 'svelte';
	let { show = false, announcement = null } = $props();
	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
	}
</script>

{#if show && announcement}
	<div class="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-gray-300/85">
		<div class="w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl">
			<div class="mb-6 border-b pb-4">
				<h2 class="text-2xl font-bold text-gray-800">{announcement.Title}</h2>
				<p class="text-sm text-gray-500">
					Posted by {announcement.CreatedBy} on {announcement.CreatedAt}
				</p>
			</div>

			<div class="space-y-4">
				<div>
					<h3 class="font-semibold text-gray-700">Description</h3>
					<p class="whitespace-pre-wrap text-gray-600">{announcement.Description}</p>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<h3 class="font-semibold text-gray-700">Last Modified</h3>
						<p class="text-gray-600">{announcement.LastModified}</p>
					</div>
					<div>
						<h3 class="font-semibold text-gray-700">Updated By</h3>
						<p class="text-gray-600">{announcement.UpdatedBy}</p>
					</div>
				</div>
			</div>

			<div class="mt-8 flex justify-end">
				<button
					onclick={handleClose}
					class="rounded-lg bg-gray-100 px-6 py-2 font-medium text-gray-700 hover:bg-gray-200"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}
