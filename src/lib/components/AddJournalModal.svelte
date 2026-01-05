<script>
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	let { show = false } = $props();

	let title = $state('');
	let description = $state('');
	let date = $state(new Date().toISOString().split('T')[0]);
	let q1 = $state('');
	let q2 = $state('');
	let q3 = $state('');

	function handleClose() {
		dispatch('close');
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (!title || !description || !date || !q1 || !q2 || !q3) {
			alert('Please provide details for all fields and reflections.');
			return;
		}

		dispatch('add', {
			title,
			description,
			date,
			q1,
			q2,
			q3
		});

		title = '';
		description = '';
		q1 = '';
		q2 = '';
		q3 = '';
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
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm"
	>
		<div
			transition:scale={{ start: 0.95, duration: 200 }}
			class="flex h-full max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
			role="dialog"
		>
			<div class="flex items-center justify-between border-b border-gray-100 bg-white px-8 py-6">
				<div>
					<h2 class="text-2xl font-bold text-gray-800">New Journal Entry</h2>
					<p class="text-sm text-gray-500">
						Record your daily internship activities and reflections.
					</p>
				</div>
				<button
					onclick={handleClose}
					class="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
					aria-label="Close modal"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
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

			<form onsubmit={handleSubmit} class="flex-grow overflow-y-auto bg-gray-50/50 p-8">
				<div class="space-y-8">
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div class="flex flex-col gap-2">
							<label for="date" class="text-xs font-bold tracking-wider text-gray-500 uppercase"
								>Log Date</label
							>
							<input
								type="date"
								id="date"
								bind:value={date}
								required
								class="rounded-xl border border-gray-200 bg-white p-3 text-gray-700 shadow-sm transition-all outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
							/>
						</div>
						<div class="flex flex-col gap-2">
							<label for="title" class="text-xs font-bold tracking-wider text-gray-500 uppercase"
								>Task Title</label
							>
							<input
								type="text"
								id="title"
								bind:value={title}
								required
								placeholder="e.g., UI Design, Database Migration"
								class="rounded-xl border border-gray-200 bg-white p-3 text-gray-700 shadow-sm transition-all outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
							/>
						</div>
						<div class="flex flex-col gap-2 md:col-span-2">
							<label for="desc" class="text-xs font-bold tracking-wider text-gray-500 uppercase"
								>General Description</label
							>
							<textarea
								id="desc"
								bind:value={description}
								rows="2"
								required
								placeholder="What was your main objective today?"
								class="rounded-xl border border-gray-200 bg-white p-3 text-gray-700 shadow-sm transition-all outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
							></textarea>
						</div>
					</div>

					<div class="space-y-6 pt-4">
						<h3 class="text-sm font-bold tracking-widest text-gray-800 uppercase">
							Daily Reflections
						</h3>

						<div
							class="group flex flex-col gap-2 rounded-2xl border-l-4 border-blue-500 bg-white p-5 shadow-sm transition-all hover:shadow-md"
						>
							<label for="q1" class="text-xs font-bold tracking-widest text-blue-600 uppercase"
								>Learning Progress</label
							>
							<p class="text-[11px] text-gray-400">
								What specific skills or concepts did you learn today?
							</p>
							<textarea
								id="q1"
								bind:value={q1}
								rows="3"
								required
								class="mt-2 w-full resize-none border-none bg-transparent p-0 text-gray-700 outline-none placeholder:text-gray-300"
								placeholder="Share your insights..."
							></textarea>
						</div>

						<div
							class="group flex flex-col gap-2 rounded-2xl border-l-4 border-amber-500 bg-white p-5 shadow-sm transition-all hover:shadow-md"
						>
							<label for="q2" class="text-xs font-bold tracking-widest text-amber-600 uppercase"
								>Challenges Encountered</label
							>
							<p class="text-[11px] text-gray-400">
								What difficulties did you face and how did you solve them?
							</p>
							<textarea
								id="q2"
								bind:value={q2}
								rows="3"
								required
								class="mt-2 w-full resize-none border-none bg-transparent p-0 text-gray-700 outline-none placeholder:text-gray-300"
								placeholder="Describe the hurdles..."
							></textarea>
						</div>

						<div
							class="group flex flex-col gap-2 rounded-2xl border-l-4 border-emerald-500 bg-white p-5 shadow-sm transition-all hover:shadow-md"
						>
							<label for="q3" class="text-xs font-bold tracking-widest text-emerald-600 uppercase"
								>Self-Improvement</label
							>
							<p class="text-[11px] text-gray-400">
								What areas do you think you need to work on tomorrow?
							</p>
							<textarea
								id="q3"
								bind:value={q3}
								rows="3"
								required
								class="mt-2 w-full resize-none border-none bg-transparent p-0 text-gray-700 outline-none placeholder:text-gray-300"
								placeholder="Goals for next time..."
							></textarea>
						</div>
					</div>
				</div>
			</form>

			<div class="flex items-center justify-end gap-3 border-t border-gray-100 bg-white px-8 py-6">
				<button
					type="button"
					onclick={handleClose}
					class="rounded-xl px-6 py-2.5 text-sm font-bold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
				>
					Cancel
				</button>
				<button
					type="submit"
					onclick={handleSubmit}
					class="flex items-center gap-2 rounded-xl bg-green-500 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-200 transition-all hover:bg-green-600 active:scale-95"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
						/>
					</svg>
					Submit Journal
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Custom visible scrollbar for the form content */
	::-webkit-scrollbar {
		width: 10px;
	}

	::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 10px;
	}

	::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 10px;
		border: 2px solid #f1f1f1;
	}

	::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}

	form {
		scrollbar-width: thin;
		scrollbar-color: #cbd5e1 #f1f1f1;
	}
</style>
