<script>
	import { onMount, onDestroy } from 'svelte';
	import SideNav from '$lib/components/SideNav.svelte';

	const userName = 'Diana';

	// --- Clock Logic ---
	let currentTime = $state(new Date());
	let clockInterval;

	// --- Calendar Logic ---
	let today = new Date();
	let currentMonth = $state(today.getMonth());
	let currentYear = $state(today.getFullYear());

	function getMonthName(monthIndex) {
		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];
		return monthNames[monthIndex];
	}

	function getDaysInMonth(year, month) {
		return new Date(year, month + 1, 0).getDate();
	}

	function getFirstDayOfMonth(year, month) {
		return new Date(year, month, 1).getDay();
	}

	function changeMonth(delta) {
		let newMonth = currentMonth + delta;
		let newYear = currentYear;
		if (newMonth < 0) {
			newMonth = 11;
			newYear--;
		} else if (newMonth > 11) {
			newMonth = 0;
			newYear++;
		}
		currentMonth = newMonth;
		currentYear = newYear;
	}

	let daysInCurrentMonth = $derived(getDaysInMonth(currentYear, currentMonth));
	let firstDayOffset = $derived(getFirstDayOfMonth(currentYear, currentMonth));
	let calendarDays = $derived(
		Array(firstDayOffset)
			.fill(null)
			.concat(Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1))
	);

	onMount(() => {
		clockInterval = setInterval(() => {
			currentTime = new Date();
		}, 1000);
	});

	onDestroy(() => {
		if (clockInterval) clearInterval(clockInterval);
	});
</script>

<div class="flex h-screen w-full gap-4 overflow-hidden bg-gray-50 p-4">
	<div class="h-full w-1/5 flex-shrink-0">
		<SideNav />
	</div>

	<div class="flex h-full flex-1 flex-col overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
		<div class="mb-6 flex flex-wrap items-center justify-between gap-4">
			<div>
				<h1 class="text-2xl font-bold text-gray-800">Welcome, {userName}!</h1>
				<p class="text-sm text-gray-500">Here's your activity overview.</p>
			</div>
		</div>

		<div class="mb-6 flex flex-wrap items-center gap-3">
			<a
				href="/student/profile"
				class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 font-medium text-white shadow transition-colors hover:bg-green-600"
			>
				<svg
					class="h-5 w-5"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
					/>
				</svg>
				View Profile
			</a>

			<a
				href="/student/attendance"
				class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 font-medium text-white shadow transition-colors hover:bg-green-600"
			>
				<svg
					class="h-5 w-5"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
					/>
				</svg>
				View Attendance
			</a>

			<a
				href="/student/journal"
				class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 font-medium text-white shadow transition-colors hover:bg-green-600"
			>
				<svg
					class="h-5 w-5"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
					/>
				</svg>
				View Journal
			</a>
		</div>

		<div class="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-3">
			<div class="flex min-h-0 flex-col gap-4 lg:col-span-2">
				<div class="grid flex-shrink-0 grid-cols-2 gap-4">
					<div class="rounded-lg border border-green-100 bg-green-50 p-5">
						<p class="text-xs font-bold tracking-wide text-gray-500 uppercase">Hours Rendered</p>
						<h2 class="mt-2 text-4xl font-bold text-green-700">280</h2>
					</div>
					<div class="rounded-lg border border-blue-100 bg-blue-50 p-5">
						<p class="text-xs font-bold tracking-wide text-gray-500 uppercase">Remaining Hours</p>
						<h2 class="mt-2 text-4xl font-bold text-blue-700">20</h2>
					</div>
				</div>

				<div class="flex min-h-0 flex-1 flex-col rounded-lg border border-gray-200 bg-white p-5">
					<div class="mb-4 flex flex-shrink-0 items-center gap-2 border-b border-gray-100 pb-3">
						<span
							class="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-500"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
								/></svg
							>
						</span>
						<h3 class="font-bold text-gray-700">Announcements</h3>
					</div>

					<div class="flex-1 overflow-y-auto pr-2">
						<div class="space-y-3">
							{#each Array(6) as _}
								<div class="group rounded-md bg-gray-50 p-3 transition-colors hover:bg-gray-100">
									<p class="line-clamp-2 text-sm font-medium text-gray-800">
										Classes will be suspended from Dec 20, 2025, to Jan 3, 2026, in observance of
										the holidays.
									</p>
									<div class="mt-2 flex items-center gap-2">
										<span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
										<span class="text-xs text-gray-400">Just now</span>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-col gap-4">
				<div class="grid flex-shrink-0 grid-cols-2 gap-4">
					<button
						class="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
					>
						Clock Out
					</button>
					<button
						class="flex w-full items-center justify-center rounded-lg bg-green-500 py-3 text-sm font-semibold text-white shadow transition-colors hover:bg-green-600"
					>
						Clock In
					</button>
				</div>

				<div
					class="flex flex-shrink-0 flex-col items-center justify-center rounded-lg bg-green-500 p-6 text-white shadow-md"
				>
					<p class="text-4xl font-bold tracking-tight">
						{currentTime.toLocaleTimeString('en-US', {
							hour: 'numeric',
							minute: '2-digit',
							hour12: true
						})}
					</p>
					<p class="mt-1 text-sm font-medium opacity-90">
						{currentTime.toLocaleDateString('en-US', {
							weekday: 'short',
							month: 'short',
							day: 'numeric'
						})}
					</p>
				</div>

				<div class="flex flex-1 flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
					<div class="mb-4 flex flex-shrink-0 items-center justify-between">
						<button
							onclick={() => changeMonth(-1)}
							class="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100">&lt;</button
						>
						<h3 class="text-sm font-bold tracking-wide text-gray-700 uppercase">
							{getMonthName(currentMonth)}
							{currentYear}
						</h3>
						<button
							onclick={() => changeMonth(1)}
							class="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100">&gt;</button
						>
					</div>

					<div
						class="mb-2 grid flex-shrink-0 grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-400"
					>
						<div>SUN</div>
						<div>MON</div>
						<div>TUE</div>
						<div>WED</div>
						<div>THU</div>
						<div>FRI</div>
						<div>SAT</div>
					</div>

					<div class="grid grid-cols-7 gap-1 overflow-y-auto text-center text-sm">
						{#each calendarDays as day}
							{#if day}
								<div
									class={`mx-auto flex h-8 w-8 cursor-default items-center justify-center rounded-full text-xs font-medium transition-all
									${
										day === today.getDate() &&
										currentMonth === today.getMonth() &&
										currentYear === today.getFullYear()
											? 'bg-green-500 text-white shadow-md'
											: 'text-gray-600 hover:bg-gray-100'
									}`}
								>
									{day}
								</div>
							{:else}
								<div></div>
							{/if}
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
