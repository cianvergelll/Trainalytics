<script>
	import { goto } from '$app/navigation';
	import SideNavAdmin from '$lib/components/SideNavAdmin.svelte';

	// Static Data
	let journal = {
		studentName: 'Diana Barleta',
		company: 'Tech Solution',
		supervisor: 'Marlon Verzosa',
		taskName: 'QA Testing',
		taskDescription:
			'Testing results and any identified bugs have been documented in the project management.',
		date: '02-04-2025',
		status: 'Approved',
		q1: 'I learned how to carefully execute test cases and identify discrepancies between actual and expected results.',
		q2: 'I faced challenges with unclear requirements and some bugs that were hard to reproduce.',
		q3: 'I can improve on prioritizing critical test cases to save time.',
		filename: 'Journal.1stweek'
	};

	let feedback = '';

	function handleBack() {
		goto('/admin/main/journals');
	}

	function handleSubmitFeedback() {
		alert('Feedback submitted!');
	}
</script>

<div class="flex h-screen gap-4 bg-gray-50 p-4">
	<div class="h-full w-1/5 flex-shrink-0">
		<SideNavAdmin />
	</div>

	<div class="flex h-full flex-1 flex-col overflow-hidden rounded-xl bg-white px-8 py-6 shadow-lg">
		<div class="mb-4 flex flex-shrink-0 items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-800">View Journal</h1>
				<p class="text-sm text-gray-500">Pages / Journal / View Journal</p>
			</div>
			<button
				onclick={handleBack}
				class="rounded-full p-2 text-green-500 transition-colors hover:bg-green-50 hover:text-green-600"
				title="Go Back"
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

		<div class="flex flex-1 gap-6 overflow-hidden">
			<div class="flex flex-[2] flex-col gap-4 overflow-hidden rounded-xl bg-gray-50 p-5">
				<div class="flex flex-shrink-0 items-center justify-between border-b border-gray-200 pb-3">
					<h2 class="text-xl font-bold text-gray-800">{journal.studentName}</h2>
					<div class="flex gap-6 text-sm text-gray-600">
						<p><span class="font-bold text-gray-700">Company:</span> {journal.company}</p>
						<p><span class="font-bold text-gray-700">Supervisor:</span> {journal.supervisor}</p>
					</div>
				</div>

				<div class="flex min-h-0 flex-col rounded-xl bg-white p-5 shadow-sm">
					<h3 class="mb-3 text-base font-bold text-gray-700">Task Log</h3>

					<div class="mb-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
						<div class="grid grid-cols-[110px_1fr]">
							<span class="font-bold text-gray-700">Task Name:</span>
							<span class="truncate text-gray-600">{journal.taskName}</span>
						</div>
						<div class="grid grid-cols-[70px_1fr]">
							<span class="font-bold text-gray-700">Date:</span>
							<span class="text-gray-600">{journal.date}</span>
						</div>
						<div class="col-span-2 grid grid-cols-[110px_1fr]">
							<span class="font-bold text-gray-700">Description:</span>
							<span class="truncate text-gray-600">{journal.taskDescription}</span>
						</div>
						<div class="col-span-2 grid grid-cols-[110px_1fr]">
							<span class="font-bold text-gray-700">Status:</span>
							<span class="font-bold text-green-500">{journal.status}</span>
						</div>
					</div>

					<div class="flex-grow space-y-3 overflow-y-auto pr-2 text-sm">
						<div class="rounded-lg bg-gray-50 p-3">
							<p class="font-bold text-gray-700">What did you learn today?</p>
							<p class="mt-1 leading-relaxed text-gray-600">{journal.q1}</p>
						</div>
						<div class="rounded-lg bg-gray-50 p-3">
							<p class="font-bold text-gray-700">Challenges & Solutions:</p>
							<p class="mt-1 leading-relaxed text-gray-600">{journal.q2}</p>
						</div>
						<div class="rounded-lg bg-gray-50 p-3">
							<p class="font-bold text-gray-700">Areas for improvement:</p>
							<p class="mt-1 leading-relaxed text-gray-600">{journal.q3}</p>
						</div>
					</div>

					<div class="mt-4 flex flex-shrink-0 items-center gap-3 border-t pt-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="h-6 w-6 text-red-500"
						>
							<path
								fill-rule="evenodd"
								d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
								clip-rule="evenodd"
							/>
							<path
								d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z"
							/>
						</svg>
						<a
							href={journal.name}
							class="text-sm font-medium text-blue-600 underline hover:text-blue-800"
						>
							{journal.filename}
						</a>
					</div>
				</div>
			</div>

			<div class="flex flex-1 flex-col rounded-xl bg-gray-50 p-5 shadow-sm">
				<h2 class="mb-3 text-base font-bold text-gray-800">Adviser's Feedback</h2>
				<textarea
					id="feedback"
					bind:value={feedback}
					class="w-full flex-grow resize-none rounded-lg border border-gray-300 p-4 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
					placeholder="Type your feedback here..."
				></textarea>

				<button
					onclick={handleSubmitFeedback}
					class="mt-4 w-full rounded-lg bg-green-500 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-green-600"
				>
					Submit Feedback
				</button>
			</div>
		</div>
	</div>
</div>
