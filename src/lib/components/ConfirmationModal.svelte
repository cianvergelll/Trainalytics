<script>
	import { createEventDispatcher } from 'svelte';

	export let show = false;
	export let title = 'Confirm Action';
	export let message = 'Are you sure you want to proceed?';
	export let confirmText = 'Confirm';
	export let cancelText = 'Cancel';
	export let confirmColor = 'blue';

	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
	}

	function handleConfirm() {
		dispatch('confirm');
		dispatch('close');
	}

	$: confirmButtonClasses =
		{
			red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
			green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
			blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
		}[confirmColor] || 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
</script>

{#if show}
	<div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		<div class="bg-opacity-75 fixed inset-0 bg-gray-300/85 transition-opacity"></div>

		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
				<div
					class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
				>
					<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						<div class="sm:flex sm:items-start">
							<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
								<h3 class="text-xl leading-6 font-semibold text-gray-900" id="modal-title">
									{title}
								</h3>
								<div class="mt-2">
									<p class="text-sm text-gray-500">
										{message}
									</p>
								</div>
							</div>
						</div>
					</div>
					<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
						<button
							type="button"
							class="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 sm:ml-3 sm:w-auto {confirmButtonClasses}"
							on:click={handleConfirm}
						>
							{confirmText}
						</button>
						<button
							type="button"
							class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
							on:click={handleClose}
						>
							{cancelText}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
