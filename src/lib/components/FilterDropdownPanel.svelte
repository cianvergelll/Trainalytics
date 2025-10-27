<script>
	import { createEventDispatcher } from 'svelte';
	let { options, selected } = $props();

	const dispatch = createEventDispatcher();
</script>

<div
	class="ring-opacity-5 absolute right-0 z-50 mt-2 w-96 rounded-lg bg-white p-6 shadow-xl ring-1 ring-black"
	role="dialog"
	aria-modal="true"
	tabindex="-1"
>
	<div class="space-y-6">
		<div>
			<h3 class="font-semibold text-gray-800">Status</h3>
			<div class="mt-2 flex flex-wrap gap-4">
				<label class="flex items-center gap-2"
					><input type="checkbox" bind:group={selected.status} value="On-going" /> On-going</label
				>
				<label class="flex items-center gap-2"
					><input type="checkbox" bind:group={selected.status} value="Completed" /> Completed</label
				>
				<label class="flex items-center gap-2"
					><input type="checkbox" bind:group={selected.status} value="None" /> None</label
				>
			</div>
		</div>

		<div>
			<h3 class="font-semibold text-gray-800">Target Hours</h3>
			<div class="mt-2 flex flex-wrap gap-4">
				<label class="flex items-center gap-2"
					><input type="checkbox" bind:group={selected.hours} value={600} /> 600</label
				>
				<label class="flex items-center gap-2"
					><input type="checkbox" bind:group={selected.hours} value={480} /> 480</label
				>
				<label class="flex items-center gap-2"
					><input type="checkbox" bind:group={selected.hours} value={300} /> 300</label
				>
			</div>
		</div>

		<div>
			<h3 class="font-semibold text-gray-800">Company</h3>
			<div class="mt-2 grid max-h-32 grid-cols-2 gap-2 overflow-y-auto">
				{#each options.companies as company}
					<label class="flex items-center gap-2"
						><input type="checkbox" bind:group={selected.companies} value={company} />
						{company}</label
					>
				{/each}
			</div>
		</div>

		<div>
			<h3 class="font-semibold text-gray-800">Section</h3>
			<div class="mt-2 grid grid-cols-3 gap-2">
				{#each options.sections as section}
					<label class="flex items-center gap-2"
						><input type="checkbox" bind:group={selected.sections} value={section} />
						{section}</label
					>
				{/each}
			</div>
		</div>
	</div>

	<div class="mt-8 flex items-center justify-between">
		<button onclick={() => dispatch('clear')} class="text-red-500 hover:underline"
			>Clear all filters</button
		>
		<div class="flex gap-4">
			<button
				onclick={() => dispatch('close')}
				class="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200">Cancel</button
			>
			<button
				onclick={() => dispatch('apply')}
				class="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600">Apply</button
			>
		</div>
	</div>
</div>
