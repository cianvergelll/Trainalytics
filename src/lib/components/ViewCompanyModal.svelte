<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let { show = false, company = null } = $props();
</script>

{#if show && company}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
		<div class="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
			<div class="mb-6 flex items-start justify-between border-b border-gray-100 pb-4">
				<div>
					<h2 class="text-xl font-bold text-gray-800">{company.CompanyName}</h2>
					<span class="text-xs font-medium text-gray-500">{company.FormattedID}</span>
				</div>
				<span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
					Time Out: {company.TimeOut}
				</span>
			</div>

			<div class="space-y-4">
				<div>
					<label
						for="address"
						class="block text-xs font-bold tracking-wider text-gray-400 uppercase">Address</label
					>
					<p class="text-sm font-medium text-gray-800">{company.Address || 'N/A'}</p>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label
							for="email"
							class="block text-xs font-bold tracking-wider text-gray-400 uppercase">Email</label
						>
						<p class="text-sm font-medium text-gray-800">{company.Email || 'N/A'}</p>
					</div>
					<div>
						<label
							for="contact"
							class="block text-xs font-bold tracking-wider text-gray-400 uppercase">Contact</label
						>
						<p class="text-sm font-medium text-gray-800">{company.ContactNumber || 'N/A'}</p>
					</div>
				</div>
			</div>

			<div class="mt-8 flex justify-end">
				<button
					onclick={() => dispatch('close')}
					class="rounded-lg bg-gray-100 px-6 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}
