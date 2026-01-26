<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import SideNavAdmin from '$lib/components/SideNavAdmin.svelte';

	let journalId = $derived($page.url.searchParams.get('id'));
	let fromPage = $derived($page.url.searchParams.get('from')); // 'student-list' or default
	let sourceStudentId = $derived($page.url.searchParams.get('studentId'));

	let journal = $state(null);
	let chatHistory = $state([]);
	let newMessage = $state('');
	let loading = $state(true);
	let submitting = $state(false);
	let chatContainer = $state(null); // Reference for auto-scrolling

	// Fetch Data on Mount
	onMount(async () => {
		await fetchJournalDetails();
	});

	async function fetchJournalDetails() {
		const token = localStorage.getItem('sessionToken');
		if (!token) {
			goto('/login');
			return;
		}

		try {
			const res = await fetch(`/api/journals/${journalId}`, {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (res.ok) {
				const data = await res.json();
				journal = data;
				chatHistory = data.allFeedback || [];
				loading = false;
				scrollToBottom();
			} else {
				console.error('Failed to load journal');
				loading = false;
			}
		} catch (error) {
			console.error('Error:', error);
			loading = false;
		}
	}

	async function scrollToBottom() {
		await tick();
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

	function handleBack() {
		if (fromPage === 'student-list' && sourceStudentId) {
			goto(`/admin/main/journals/student?id=${sourceStudentId}`);
		} else {
			goto('/admin/main/journals');
		}
	}

	async function sendMessage() {
		if (!newMessage.trim() || submitting) return;
		submitting = true;

		const token = localStorage.getItem('sessionToken');
		try {
			const res = await fetch(`/api/journals/${journalId}/feedback`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					message: newMessage,
					senderType: 'ADMIN'
				})
			});

			if (res.ok) {
				chatHistory = [
					...chatHistory,
					{
						Message: newMessage,
						SenderType: 'ADMIN',
						CreatedAt: new Date().toISOString()
					}
				];
				newMessage = '';
				scrollToBottom();
			} else {
				alert('Failed to send message.');
			}
		} catch (error) {
			console.error('Error sending feedback:', error);
		} finally {
			submitting = false;
		}
	}

	function formatTime(isoString) {
		if (!isoString) return '';
		return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}
</script>

<div class="flex h-screen gap-4 bg-gray-50 p-4">
	<div class="h-full w-1/5 flex-shrink-0">
		<SideNavAdmin />
	</div>

	<div class="flex h-full flex-1 flex-col overflow-hidden rounded-xl bg-white p-6 shadow-lg">
		<div class="mb-4 flex flex-shrink-0 items-center justify-between">
			<div class="flex items-center gap-3">
				<button
					aria-label="Go Back"
					onclick={handleBack}
					class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="h-4 w-4 text-gray-600"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
						/>
					</svg>
				</button>
				<h1 class="text-xl font-bold text-gray-800">Journal Review</h1>
			</div>
		</div>

		{#if loading}
			<div class="flex h-full items-center justify-center text-gray-500">
				Loading journal details...
			</div>
		{:else if journal}
			<div class="grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-3">
				<div class="overflow-y-auto pr-2 lg:col-span-2">
					<div class="mb-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
						<div class="mb-6 flex items-start gap-4 border-b border-gray-100 pb-6">
							<div
								class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600"
							>
								{journal.studentName?.charAt(0) || 'S'}
							</div>
							<div>
								<h2 class="text-lg font-bold text-gray-900">{journal.studentName}</h2>
								<div class="flex flex-col text-sm text-gray-500">
									<span>{journal.company}</span>
									<span class="text-xs">Supervisor: {journal.supervisor}</span>
								</div>
							</div>
							<div class="ml-auto text-right">
								<span
									class={`rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${
										journal.status === 'approved'
											? 'bg-green-100 text-green-700'
											: journal.status === 'pending'
												? 'bg-yellow-100 text-yellow-700'
												: 'bg-red-100 text-red-700'
									}`}
								>
									{journal.status}
								</span>
								<p class="mt-1 text-xs text-gray-400">{journal.date}</p>
							</div>
						</div>

						<div class="mb-8">
							<h3 class="mb-2 text-sm font-bold tracking-wider text-gray-400 uppercase">
								Task Accomplished
							</h3>
							<div class="rounded-lg bg-gray-50 p-4">
								<h4 class="mb-1 font-semibold text-gray-800">{journal.taskName}</h4>
								<p class="text-sm whitespace-pre-wrap text-gray-600">{journal.taskDescription}</p>
							</div>
						</div>

						<div class="space-y-6">
							<div>
								<h3 class="mb-2 text-sm font-bold tracking-wider text-gray-400 uppercase">
									1. What did you learn today?
								</h3>
								<p class="rounded-lg border border-gray-100 p-4 text-sm text-gray-700">
									{journal.q1}
								</p>
							</div>
							<div>
								<h3 class="mb-2 text-sm font-bold tracking-wider text-gray-400 uppercase">
									2. What challenges did you encounter?
								</h3>
								<p class="rounded-lg border border-gray-100 p-4 text-sm text-gray-700">
									{journal.q2}
								</p>
							</div>
							<div>
								<h3 class="mb-2 text-sm font-bold tracking-wider text-gray-400 uppercase">
									3. How can you improve?
								</h3>
								<p class="rounded-lg border border-gray-100 p-4 text-sm text-gray-700">
									{journal.q3}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div
					class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-1"
				>
					<div class="border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">
						Feedback & Discussion
					</div>

					<div bind:this={chatContainer} class="flex-1 space-y-4 overflow-y-auto bg-gray-50/50 p-4">
						{#if chatHistory.length === 0}
							<div class="mt-10 text-center text-sm text-gray-400">
								No feedback yet. Start the conversation!
							</div>
						{/if}

						{#each chatHistory as msg}
							<div class={`flex ${msg.SenderType === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
								<div
									class={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
										msg.SenderType === 'ADMIN'
											? 'rounded-br-none bg-blue-600 text-white'
											: 'rounded-bl-none border border-gray-200 bg-white text-gray-800'
									}`}
								>
									<p>{msg.Message}</p>
									<span
										class={`mt-1 block text-[10px] ${
											msg.SenderType === 'ADMIN' ? 'text-right text-blue-100' : 'text-gray-400'
										}`}
									>
										{formatTime(msg.CreatedAt)}
									</span>
								</div>
							</div>
						{/each}
					</div>

					<div class="border-t bg-white p-3">
						<form
							onsubmit={(e) => {
								e.preventDefault();
								sendMessage();
							}}
							class="flex gap-2"
						>
							<input
								type="text"
								bind:value={newMessage}
								placeholder="Write feedback..."
								class="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
							/>
							<button
								aria-label="Submit"
								type="submit"
								disabled={submitting}
								class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="ml-0.5 h-4 w-4"
								>
									<path
										d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"
									/>
								</svg>
							</button>
						</form>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
