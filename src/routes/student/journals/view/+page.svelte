<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import SideNav from '$lib/components/SideNav.svelte';

	let journalId = $derived($page.url.searchParams.get('id'));

	let journal = $state({
		taskName: '',
		taskDescription: '',
		date: '',
		status: '',
		q1: '',
		q2: '',
		q3: '',
		filename: ''
	});

	let loading = $state(true);
	let error = $state('');

	onMount(async () => {
		if (!journalId) {
			error = 'No Journal ID specified.';
			loading = false;
			return;
		}
		await fetchJournalDetails();
	});

	async function fetchJournalDetails() {
		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch(`/api/journals/${journalId}`, {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (res.ok) {
				journal = await res.json();
			} else {
				const errData = await res.json();
				error = errData.error || 'Failed to load journal.';
			}
		} catch (e) {
			error = 'Network error.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex h-screen gap-4 bg-gray-50 p-4">
	<div class="h-full w-1/5 flex-shrink-0">
		<SideNav />
	</div>

	<div class="flex h-full flex-1 flex-col overflow-hidden rounded-xl bg-white px-8 py-6 shadow-lg">
		<div class="mb-4 flex flex-shrink-0 items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-800">My Journal Entry</h1>
				<p class="text-sm text-gray-500">Student / Journals / View</p>
			</div>
			<button
				aria-label="Back"
				onclick={() => goto('/student/journals')}
				class="rounded-full p-2 text-blue-500 transition-colors hover:bg-blue-50"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2.5"
					stroke="currentColor"
					class="h-7 w-7"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
					/>
				</svg>
			</button>
		</div>

		{#if loading}
			<div class="flex h-full items-center justify-center">
				<div
					class="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
				></div>
			</div>
		{:else if error}
			<div class="text-center text-red-500">{error}</div>
		{:else}
			<div class="flex flex-1 flex-col gap-6 overflow-hidden rounded-xl bg-gray-50 p-8">
				<div class="flex items-center justify-between border-b border-gray-200 pb-5">
					<h2 class="text-2xl font-bold text-gray-800">{journal.taskName}</h2>
					<span
						class="rounded-full px-4 py-1.5 text-sm font-bold capitalize shadow-sm
                {journal.status === 'approved'
							? 'border border-green-200 bg-green-100 text-green-700'
							: journal.status === 'pending'
								? 'border border-yellow-200 bg-yellow-100 text-yellow-700'
								: 'border border-red-200 bg-red-100 text-red-700'}"
					>
						{journal.status}
					</span>
				</div>

				<div class="grid grid-cols-2 gap-8 border-b border-gray-200 pb-5 text-sm">
					<div class="flex flex-col gap-1">
						<span class="text-xs font-semibold tracking-wider text-gray-400 uppercase"
							>Date Logged</span
						>
						<span class="text-base font-medium text-gray-700">{journal.date || '-'}</span>
					</div>
					<div class="flex flex-col gap-1">
						<span class="text-xs font-semibold tracking-wider text-gray-400 uppercase"
							>Date Approved</span
						>
						<span class="text-base font-medium text-gray-700">
							{#if journal.status?.toLowerCase() === 'approved' && journal.dateApproved}
								{journal.dateApproved}
							{:else}
								<span class="text-gray-400 italic">N/A</span>
							{/if}
						</span>
					</div>
				</div>

				<div class="flex flex-col gap-2">
					<span class="text-xs font-semibold tracking-wider text-gray-400 uppercase"
						>Task Description</span
					>
					<div
						class="rounded-lg border border-gray-200 bg-white p-4 leading-relaxed text-gray-700 shadow-sm"
					>
						{journal.taskDescription || 'No description provided.'}
					</div>
				</div>

				<div class="mt-2 flex-grow space-y-5 overflow-y-auto pr-2">
					<div class="flex flex-col gap-2">
						<span class="text-xs font-semibold tracking-wider text-gray-400 uppercase"
							>What did you learn today?</span
						>
						<div class="rounded-lg border-l-4 border-blue-400 bg-white p-5 shadow-sm">
							<p class="leading-relaxed text-gray-600">{journal.q1 || 'No response provided.'}</p>
						</div>
					</div>

					<div class="flex flex-col gap-2">
						<span class="text-xs font-semibold tracking-wider text-gray-400 uppercase"
							>Challenges & Solutions</span
						>
						<div class="rounded-lg border-l-4 border-amber-400 bg-white p-5 shadow-sm">
							<p class="leading-relaxed text-gray-600">{journal.q2 || 'No response provided.'}</p>
						</div>
					</div>

					<div class="flex flex-col gap-2">
						<span class="text-xs font-semibold tracking-wider text-gray-400 uppercase"
							>Areas for Improvement</span
						>
						<div class="rounded-lg border-l-4 border-emerald-400 bg-white p-5 shadow-sm">
							<p class="leading-relaxed text-gray-600">{journal.q3 || 'No response provided.'}</p>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
