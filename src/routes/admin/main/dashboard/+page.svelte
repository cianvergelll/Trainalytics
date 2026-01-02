<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { userSession } from '$lib/sessionStore.js';
	import SideNavAdmin from '$lib/components/SideNavAdmin.svelte';
	import AddStudentModal from '$lib/components/AddStudentModal.svelte';
	import Chart from 'chart.js/auto';

	// Updated stats structure to include processing
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
		// Note: removed caching here temporarily so you see live updates immediately
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
				// Update session storage if needed
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

		// Destroy old charts
		if (completionChartInstance) completionChartInstance.destroy();
		if (internshipChartInstance) internshipChartInstance.destroy();

		// 1. Completion Status Chart (Now with 3 Segments: Completed, Ongoing, Processing)
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
						// Colors: Green, Yellow, Blue
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

		// 2. Internship Status Chart (With Internship vs No Internship)
		internshipChartInstance = new Chart(internshipChartCtx, {
			type: 'pie',
			data: {
				labels: ['With Internship', 'No Internship'],
				datasets: [
					{
						label: 'Count',
						data: [stats.internshipStats.withInternship, stats.internshipStats.noInternship],
						// Colors: Green, Red
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

	onMount(() => {
		if (browser) {
			fetchDashboardStats();
			fetchFilterOptions();
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
</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>
</svelte:head>

<AddStudentModal
	show={showAddStudentModal}
	sections={sections ?? []}
	schools={schools ?? []}
	on:close={() => (showAddStudentModal = false)}
	on:add={handleAddStudent}
/>

<div class="flex h-screen gap-4 bg-gray-100 p-4">
	<div class="h-[95vh] w-1/5 flex-shrink-0 self-center">
		<SideNavAdmin />
	</div>

	<div class="flex-1 space-y-3 overflow-y-auto p-4">
		<h1 class="text-3xl font-bold text-gray-800">Welcome, {adminUsername}!</h1>

		<div class="flex items-center justify-between">
			<div class="flex space-x-4">
				<a
					href="/admin/main/students"
					class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 font-medium text-white shadow hover:bg-green-600"
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
					View Students
				</a>
				<a
					href="/admin/main/attendance"
					class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 font-medium text-white shadow hover:bg-green-600"
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
					href="/admin/main/journals"
					class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 font-medium text-white shadow hover:bg-green-600"
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
			<button
				onclick={() => (showAddStudentModal = true)}
				class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 font-medium text-white shadow hover:bg-green-600"
			>
				<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"
					><path
						d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
					/></svg
				>
				Add Students
			</button>
		</div>

		{#if error}
			<p class="mb-4 w-full rounded bg-red-100 p-2 text-center text-sm text-red-700">{error}</p>
		{/if}

		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			<div class="flex items-center justify-between rounded-lg bg-white p-6 shadow">
				<div>
					<p class="text-sm font-medium text-gray-500">Total No. of Students</p>
					<p class="text-3xl font-bold text-gray-800">{stats.totalStudents}</p>
				</div>
				<div class="rounded-full bg-green-100 p-3 text-green-600">
					<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
						/></svg
					>
				</div>
			</div>
			<div class="flex items-center justify-between rounded-lg bg-white p-6 shadow">
				<div>
					<p class="text-sm font-medium text-gray-500">Total Companies</p>
					<p class="text-3xl font-bold text-gray-800">{stats.totalCompanies}</p>
				</div>
				<div class="rounded-full bg-green-100 p-3 text-green-600">
					<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
						/></svg
					>
				</div>
			</div>
			<div
				class="flex flex-col items-center justify-center rounded-lg bg-green-500 p-6 text-white shadow"
			>
				<p class="text-4xl font-bold">
					{currentTime.toLocaleTimeString('en-US', {
						hour: 'numeric',
						minute: '2-digit',
						hour12: true
					})}
				</p>
				<p class="text-sm">
					{currentTime.toLocaleDateString('en-US', {
						weekday: 'short',
						month: 'short',
						day: 'numeric'
					})}
				</p>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
			<div class="rounded-lg bg-white p-4 shadow lg:col-span-2">
				<h2 class="mb-2 text-lg font-semibold text-gray-700">Internship Count</h2>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2" style="height: 220px;">
					<div class="flex flex-col items-center">
						<h3 class="mb-1 text-xs font-medium text-gray-600">Completed / On-going</h3>
						<div class="relative h-32 w-32">
							<canvas bind:this={completionChartCtx}></canvas>
						</div>
						<div class="mt-4 flex w-full justify-around text-xs">
							<div class="flex items-center gap-1">
								<span class="h-3 w-3 rounded-full bg-green-500"></span>
								<span>Completed: {stats.completionStats.completed}</span>
							</div>
							<div class="flex items-center gap-1">
								<span class="h-3 w-3 rounded-full bg-yellow-400"></span>
								<span>On-going: {stats.completionStats.ongoing}</span>
							</div>
							<div class="flex items-center gap-1">
								<span class="h-3 w-3 rounded-full bg-blue-500"></span>
								<span>Processing: {stats.completionStats.processing}</span>
							</div>
						</div>
						<div class="mt-1 text-center text-xs text-gray-500">
							({(
								(stats.completionStats.completed /
									(stats.completionStats.completed + stats.completionStats.ongoing || 1)) *
								100
							).toFixed(1)}% /
							{(
								(stats.completionStats.ongoing /
									(stats.completionStats.completed + stats.completionStats.ongoing || 1)) *
								100
							).toFixed(1)}%)
						</div>
					</div>
					<div class="flex flex-col items-center">
						<h3 class="mb-1 text-xs font-medium text-gray-600">With / No Internship</h3>
						<div class="relative h-32 w-32">
							<canvas bind:this={internshipChartCtx}></canvas>
						</div>
						<div class="mt-4 flex w-full justify-around text-xs">
							<div class="flex items-center gap-1">
								<span class="h-3 w-3 rounded-full bg-green-500"></span>
								<span>With Internship: {stats.internshipStats.withInternship}</span>
							</div>
							<div class="flex items-center gap-1">
								<span class="h-3 w-3 rounded-full bg-red-500"></span>
								<span>No Internship: {stats.internshipStats.noInternship}</span>
							</div>
						</div>
						<div class="mt-1 text-center text-xs text-gray-500">
							({(
								(stats.internshipStats.withInternship /
									(stats.internshipStats.withInternship + stats.internshipStats.noInternship ||
										1)) *
								100
							).toFixed(1)}% /
							{(
								(stats.internshipStats.noInternship /
									(stats.internshipStats.withInternship + stats.internshipStats.noInternship ||
										1)) *
								100
							).toFixed(1)}%)
						</div>
					</div>
				</div>
			</div>

			<div class="space-y-4">
				<div class="rounded-lg bg-white p-4 shadow">
					<div class="mb-3 flex items-center justify-between">
						<button onclick={() => changeMonth(-1)} class="rounded p-1 hover:bg-gray-100"
							>&lt;</button
						>
						<h3 class="text-sm font-semibold">{getMonthName(currentMonth)} {currentYear}</h3>
						<button onclick={() => changeMonth(1)} class="rounded p-1 hover:bg-gray-100"
							>&gt;</button
						>
					</div>
					<div class="grid grid-cols-7 gap-1 text-center text-xs text-gray-500">
						<div>SUN</div>
						<div>MON</div>
						<div>TUE</div>
						<div>WED</div>
						<div>THU</div>
						<div>FRI</div>
						<div>SAT</div>
					</div>
					<div class="mt-1 grid grid-cols-7 gap-1 text-center text-sm">
						{#each calendarDays as day}
							{#if day}
								<div
									class={`flex h-7 w-7 items-center justify-center rounded-full ${day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() ? 'bg-green-500 text-white' : 'hover:bg-gray-100'}`}
								>
									{day}
								</div>
							{:else}
								<div></div>
							{/if}
						{/each}
					</div>
				</div>

				<div class="rounded-lg bg-white p-4 shadow">
					<h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
						<svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"
							><path
								fill-rule="evenodd"
								d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
								clip-rule="evenodd"
							/></svg
						>
						Notifications
					</h3>
					<div class="space-y-2 text-xs text-gray-600">
						<p>Diana Barleta Filed a complaint <span class="text-gray-400">Just now</span></p>
						<p>Diana Barleta Filed a complaint <span class="text-gray-400">Just now</span></p>
						<p>Diana Barleta Filed a complaint <span class="text-gray-400">2 min ago</span></p>
						<p>Ethan Barleta Submitted a journal <span class="text-gray-400">1 hour ago</span></p>
						<p>New Student Added <span class="text-gray-400">Yesterday</span></p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
