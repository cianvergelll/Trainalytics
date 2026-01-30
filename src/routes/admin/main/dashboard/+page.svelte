<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { userSession } from '$lib/sessionStore.js';
	import SideNavAdmin from '$lib/components/SideNavAdmin.svelte';
	import AddStudentModal from '$lib/components/AddStudentModal.svelte';
	import Chart from 'chart.js/auto';
	import { notificationsStore, unreadCountStore } from '$lib/stores/socketStore';

	let stats = $state({
		totalStudents: 0,
		totalCompanies: 0,
		completionStats: { completed: 0, ongoing: 0, processing: 0 },
		internshipStats: { withInternship: 0, noInternship: 0 }
	});

	let error = $state('');
	let currentTime = $state(new Date());
	let clockInterval;

	let showAddStudentModal = $state(false);
	let schools = $state([]);
	let sections = $state([]);

	let completionChartCtx = $state();
	let internshipChartCtx = $state();
	let completionChartInstance = null;
	let internshipChartInstance = null;
	const adminUsername = $derived($userSession?.username || 'Admin');

	let recentNotifications = $derived($notificationsStore.slice(0, 5)); // Show top 5
	let unreadCount = $derived($unreadCountStore);

	function getIconColor(type) {
		if (type === 'success') return 'bg-green-500';
		if (type === 'warning') return 'bg-orange-500';
		if (type === 'error') return 'bg-red-500';
		return 'bg-blue-500';
	}

	async function handleNotificationClick(notif) {
		if (!notif.read) {
		}
		if (notif.targetUrl) {
			goto(notif.targetUrl);
		}
	}

	async function fetchFilterOptions() {
		const cachedOptions = sessionStorage.getItem('filterOptions');
		if (cachedOptions) {
			try {
				const data = JSON.parse(cachedOptions);
				schools = data.schools || [];
				sections = data.sections || [];
				return;
			} catch (e) {
				sessionStorage.removeItem('filterOptions');
			}
		}

		try {
			const token = localStorage.getItem('sessionToken');
			const schoolsRes = await fetch('/api/schools', {
				headers: { Authorization: `Bearer ${token}` }
			});
			const filtersRes = await fetch('/api/filters', {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (schoolsRes.status === 401 || filtersRes.status === 401) {
				goto('/login');
				return;
			}
			if (schoolsRes.ok && filtersRes.ok) {
				const schoolsData = await schoolsRes.json();
				const filtersData = await filtersRes.json();
				schools = schoolsData;
				sections = filtersData.sections;
				sessionStorage.setItem(
					'filterOptions',
					JSON.stringify({ schools: schools, sections: sections })
				);
			} else {
				console.error('Failed to fetch schools or sections');
			}
		} catch (e) {
			console.error('Failed to fetch modal options:', e);
		}
	}

	async function fetchDashboardStats() {
		error = '';
		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch('/api/dashboard/stats', {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (res.status === 401) {
				sessionStorage.clear();
				localStorage.removeItem('sessionToken');
				goto('/login');
				return;
			}

			if (res.ok) {
				const data = await res.json();
				stats = data;
				sessionStorage.setItem('dashboardStats', JSON.stringify(data));
				updateCharts();
			} else {
				const err = await res.json();
				console.error('Failed to fetch dashboard stats:', err);
				error = err.error || 'Failed to fetch stats.';
			}
		} catch (e) {
			console.error('An error occurred fetching stats:', e);
			error = 'An error occurred while fetching stats.';
		}
	}

	function updateCharts() {
		if (!completionChartCtx || !internshipChartCtx) {
			console.warn('Canvas context not ready for charts yet.');
			return;
		}

		if (completionChartInstance) completionChartInstance.destroy();
		if (internshipChartInstance) internshipChartInstance.destroy();

		completionChartInstance = new Chart(completionChartCtx, {
			type: 'pie',
			data: {
				labels: ['Completed', 'On-going', 'Processing'],
				datasets: [
					{
						label: 'Count',
						data: [
							stats.completionStats.completed,
							stats.completionStats.ongoing,
							stats.completionStats.processing
						],
						backgroundColor: ['#10B981', '#FCD34D', '#3B82F6'],
						hoverOffset: 4
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: { legend: { display: false } }
			}
		});

		internshipChartInstance = new Chart(internshipChartCtx, {
			type: 'pie',
			data: {
				labels: ['With Internship', 'No Internship'],
				datasets: [
					{
						label: 'Count',
						data: [stats.internshipStats.withInternship, stats.internshipStats.noInternship],
						backgroundColor: ['#10B981', '#EF4444'],
						hoverOffset: 4
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: { legend: { display: false } }
			}
		});
	}

	async function handleAddStudent(event) {
		const newStudentData = event.detail;
		error = '';
		console.log('Adding student:', newStudentData);

		try {
			const token = localStorage.getItem('sessionToken');
			const res = await fetch('/api/students', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(newStudentData)
			});

			if (res.ok) {
				console.log('Student added successfully');
				showAddStudentModal = false;
				sessionStorage.clear();
				fetchDashboardStats();
			} else {
				const err = await res.json();
				console.error('Failed to add student:', err);
				error = err.error || 'Failed to add student.';
			}
		} catch (e) {
			console.error('Error adding student:', e);
			error = 'A network error occurred while adding the student.';
		}
	}

	async function fetchNotifications() {
		const token = localStorage.getItem('sessionToken');
		try {
			const res = await fetch('/api/notifications', {
				headers: { Authorization: `Bearer ${token}` }
			});
			if (res.ok) {
				const history = await res.json();
				notificationsStore.set(history);
			}
		} catch (e) {
			console.error('Failed to load notifications:', e);
		}
	}

	onMount(() => {
		if (browser) {
			fetchDashboardStats();
			fetchFilterOptions();
			fetchNotifications();
			history;
			clockInterval = setInterval(() => {
				currentTime = new Date();
			}, 1000);
		}
	});

	onDestroy(() => {
		if (clockInterval) clearInterval(clockInterval);
		if (completionChartInstance) completionChartInstance.destroy();
		if (internshipChartInstance) internshipChartInstance.destroy();
	});

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

	const daysInCurrentMonth = $derived(getDaysInMonth(currentYear, currentMonth));
	const firstDayOffset = $derived(getFirstDayOfMonth(currentYear, currentMonth));
	const calendarDays = $derived(
		Array(firstDayOffset)
			.fill(null)
			.concat(Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1))
	);

	let isDarkMode = $state(false);
	function toggleTheme() {
		isDarkMode = !isDarkMode;
	}
</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>
</svelte:head>

{#if showAddStudentModal}
	<AddStudentModal
		show={showAddStudentModal}
		sections={sections ?? []}
		schools={schools ?? []}
		on:close={() => (showAddStudentModal = false)}
		on:add={handleAddStudent}
	/>
{/if}

<div
	class="flex h-screen w-full gap-2 overflow-hidden bg-gray-50 p-2 {showAddStudentModal
		? 'blur-[2px] transition-all'
		: ''}"
>
	<div class="h-full w-1/5 flex-shrink-0">
		<SideNavAdmin />
	</div>

	<div class="flex flex-1 flex-col space-y-2 overflow-hidden p-2">
		<h1 class="mb-6 border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800">
			Welcome, {adminUsername}!
		</h1>

		<div class="flex items-center justify-between">
			<div class="flex space-x-2">
				{#each ['Students', 'Attendance', 'Journal'] as label}
					<a
						href="/admin/main/{label.toLowerCase()}"
						class="flex items-center gap-2 rounded-lg bg-green-500 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-green-600"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
							/></svg
						>
						View {label}
					</a>
				{/each}
			</div>

			<button
				onclick={() => (showAddStudentModal = true)}
				class="flex items-center gap-2 rounded-lg border-2 border-[#1DB954] bg-transparent px-6 py-2 text-sm font-bold text-[#1DB954] shadow-sm transition-all duration-300 hover:bg-[#1DB954] hover:text-white active:scale-95"
			>
				<span class="text-xl font-light">+</span>
				Add Students
			</button>
		</div>

		<div class="grid grid-cols-3 gap-4">
			<div
				class="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
			>
				<div>
					<p class="text-xs font-medium text-gray-500 uppercase">Total Students</p>
					<p class="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
				</div>
				<div class="rounded-full bg-green-50 p-2 text-green-600">
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
						/></svg
					>
				</div>
			</div>
			<div
				class="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
			>
				<div>
					<p class="text-xs font-medium text-gray-500 uppercase">Total Companies</p>
					<p class="text-2xl font-bold text-gray-800">{stats.totalCompanies}</p>
				</div>
				<div class="rounded-full bg-green-50 p-2 text-green-600">
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
						/></svg
					>
				</div>
			</div>
			<div
				class="flex flex-col items-center justify-center rounded-lg bg-green-500 p-2 text-white shadow"
			>
				<p class="text-2xl leading-tight font-bold">
					{currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
				</p>
				<p class="text-xs opacity-90">
					{currentTime.toLocaleDateString('en-US', {
						weekday: 'short',
						month: 'short',
						day: 'numeric'
					})}
				</p>
			</div>
		</div>

		<div class="grid flex-1 grid-cols-3 gap-4 overflow-hidden">
			<div
				class="col-span-2 flex flex-col rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
			>
				<h2 class="text-md mb-2 font-semibold text-gray-700">Internship Count</h2>
				<div class="grid flex-1 grid-cols-2 gap-4">
					<div class="flex flex-col items-center justify-center">
						<h3 class="mb-1 text-[10px] font-medium text-gray-500 uppercase">
							Completed / On-going
						</h3>
						<div class="relative h-28 w-28">
							<canvas bind:this={completionChartCtx}></canvas>
						</div>
						<div class="mt-2 text-center text-[10px] text-gray-500">
							{stats.completionStats.completed} Completed | {stats.completionStats.ongoing} On-going
						</div>
					</div>
					<div class="flex flex-col items-center justify-center">
						<h3 class="mb-1 text-[10px] font-medium text-gray-500 uppercase">Status</h3>
						<div class="relative h-28 w-28">
							<canvas bind:this={internshipChartCtx}></canvas>
						</div>
						<div class="mt-2 text-center text-[10px] text-gray-500">
							{stats.internshipStats.withInternship} With | {stats.internshipStats.noInternship} Without
						</div>
					</div>
				</div>
			</div>

			<div class="flex h-full max-h-[calc(100vh-15rem)] flex-col gap-2">
				<div
					class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1rem] border border-gray-100 bg-white p-4 shadow-sm"
				>
					<div class="mb-3 flex items-center justify-between px-1">
						<h3 class="flex items-center gap-2 text-xs font-bold text-gray-800">
							<span
								class="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-[10px] text-red-500"
								>🔔</span
							>
							Notifications
						</h3>
						{#if unreadCount > 0}
							<span class="rounded-full bg-red-500 px-2 py-0.5 text-[9px] font-bold text-white"
								>{unreadCount}</span
							>
						{/if}
					</div>

					<div class="scrollbar-hide space-y-2 overflow-y-auto pr-1">
						{#if recentNotifications.length === 0}
							<div class="flex flex-col items-center justify-center py-4 text-center">
								<span class="text-xs text-gray-400">No new notifications</span>
							</div>
						{:else}
							{#each recentNotifications as note (note.id)}
								<button
									class="flex w-full cursor-pointer items-center justify-between rounded-2xl bg-gray-50 p-2.5 text-left transition hover:bg-gray-100"
									onclick={() => handleNotificationClick(note)}
								>
									<div class="flex w-full items-center gap-3">
										<div
											class="relative flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white text-[10px] font-bold shadow-sm"
										>
											{note.title.charAt(0)}
											<span
												class={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full border border-white ${getIconColor(note.type)}`}
											></span>
										</div>
										<div class="flex min-w-0 flex-col leading-tight">
											<p class="truncate text-[10px] font-bold text-gray-700">
												{note.title}
											</p>
											<span class="truncate text-[9px] text-gray-500">{note.message}</span>
											<span class="mt-0.5 text-[8px] text-gray-400">{note.time}</span>
										</div>
									</div>
									{#if !note.read}
										<div class="ml-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></div>
									{/if}
								</button>
							{/each}
						{/if}
					</div>
				</div>

				<div class="flex-shrink-0 rounded-[1rem] border border-gray-100 bg-white p-4 shadow-sm">
					<div class="mb-4 flex items-center justify-between text-xs">
						<button class="text-gray-400 hover:text-gray-800" onclick={() => changeMonth(-1)}
							>&lt;</button
						>
						<span class="font-bold text-gray-800">{getMonthName(currentMonth)} {currentYear}</span>
						<button class="text-gray-400 hover:text-gray-800" onclick={() => changeMonth(1)}
							>&gt;</button
						>
					</div>

					<div class="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-gray-300">
						<div>S</div>
						<div>M</div>
						<div>T</div>
						<div>W</div>
						<div>T</div>
						<div>F</div>
						<div>S</div>
					</div>

					<div class="mt-2 grid grid-cols-7 gap-2 text-center text-[11px]">
						{#each calendarDays as day}
							<div
								class="flex h-6 w-6 items-center justify-center rounded-full transition-all
                                {day === today.getDate() && currentMonth === today.getMonth()
									? 'bg-[#1DB954] font-bold text-white'
									: 'text-gray-600 hover:bg-gray-50'}"
							>
								{day || ''}
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
