<script>
	import { goto } from '$app/navigation';
	import SideNav from '$lib/components/SideNav.svelte';
	import SideNavAdmin from '$lib/components/SideNavAdmin.svelte';

	const students = [
		{
			id: '202310001',
			name: 'Maria Santos',
			avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
			status: 'Completed',
			section: 'BSIT-4A',
			hours: '600 Hours',
			company: 'ABC Tech Solutions'
		},
		{
			id: '202310002',
			name: 'Diana Barleta',
			avatar: 'https://randomuser.me/api/portraits/women/69.jpg',
			status: 'On-going',
			section: 'BSIT-4B',
			hours: '600 Hours',
			company: 'Tech Solutions'
		},
		{
			id: '202310003',
			name: 'Darlyn Caballero',
			avatar: 'https://randomuser.me/api/portraits/women/70.jpg',
			status: 'None',
			section: 'BSIT-4C',
			hours: '300 Hours',
			company: 'TechNavyPhil'
		},
		{
			id: '202310004',
			name: 'John Doe',
			avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
			status: 'On-going',
			section: 'BSIT-4B',
			hours: '600 Hours',
			company: 'Web Wizards'
		}
	];

	async function handleLogout() {
		const token = localStorage.getItem('sessionToken');
		if (token) {
			try {
				await fetch('/api/auth/logout', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ token })
				});
			} catch (err) {
				console.error('Server logout failed:', err);
			}
		}
		localStorage.removeItem('sessionToken');
		goto('/login');
	}
</script>

<div class="flex h-screen w-screen items-center justify-start bg-gray-50">
	<div class="ml-5 flex h-[95%] w-1/5 flex-col rounded-xl shadow-lg">
		<SideNavAdmin />
	</div>

	<div class="ml-5 flex h-[95%] w-[78%] flex-col rounded-xl bg-white p-8 shadow-lg">
		<div class="mb-6">
			<h1 class="text-3xl font-bold text-gray-800">Student's Master List</h1>
			<p class="text-sm text-gray-500">Pages / Students / Student's Master List</p>
		</div>

		<div class="flex h-full flex-col">
			<div class="mb-4 flex items-center justify-between">
				<div class="flex items-center gap-4">
					<div class="relative">
						<input
							type="text"
							placeholder="Search..."
							class="w-64 rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-green-500 focus:outline-none"
						/>
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg
								class="h-5 w-5 text-gray-400"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</div>
					<button
						class="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-100"
					>
						<svg
							class="h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.59L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
							/>
						</svg>
						Filter By
					</button>
				</div>
				<div class="flex items-center gap-4">
					<button
						class="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
						>Archived Student's</button
					>
					<button
						class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600"
					>
						<svg
							class="h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
							/>
						</svg>
						Add Student
					</button>
				</div>
			</div>

			<div class="flex-grow overflow-auto">
				<table class="min-w-full table-auto text-left">
					<thead class="sticky top-0 border-b bg-gray-50">
						<tr>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Student ID</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Status</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Student Name</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Section</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Target Hours</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Company</th>
							<th class="px-4 py-3 text-sm font-medium text-gray-600">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y">
						{#each students as student (student.id)}
							<tr class="hover:bg-gray-50">
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">{student.id}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap">
									{#if student.status === 'Completed'}
										<span
											class="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800"
											>{student.status}</span
										>
									{:else if student.status === 'On-going'}
										<span
											class="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800"
											>{student.status}</span
										>
									{:else}
										<span class="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800"
											>{student.status}</span
										>
									{/if}
								</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">
									<div class="flex items-center gap-3">
										<img
											src={student.avatar}
											alt={student.name}
											class="h-8 w-8 rounded-full object-cover"
										/>
										<span>{student.name}</span>
									</div>
								</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">{student.section}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">{student.hours}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">{student.company}</td>
								<td class="px-4 py-3 text-sm whitespace-nowrap text-gray-800">
									<div class="flex items-center gap-3">
										<button
											class="text-gray-500 hover:text-blue-600"
											aria-label="View student details"
										>
											<svg
												class="h-5 w-5"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
												<path
													fill-rule="evenodd"
													d="M.664 10.59a1.651 1.651 0 010-1.18l.879-1.148a1.651 1.651 0 011.087-.582l1.649-.033a1.651 1.651 0 011.53.86l.635 1.27a1.651 1.651 0 001.53.861l1.65-.033a1.651 1.651 0 001.086-.582l.88-1.148a1.651 1.651 0 000-1.18l-.88-1.147a1.651 1.651 0 00-1.086-.583l-1.65.033a1.651 1.651 0 00-1.53-.86l-.635-1.27a1.651 1.651 0 01-1.53-.86L6.22.842a1.651 1.651 0 01-1.087-.582L4.254.113a1.651 1.651 0 010 1.181l.88 1.147c.224.292.36.66.36 1.052v1.274a1.651 1.651 0 01-.36 1.052l-.88 1.148a1.651 1.651 0 01-1.086.582l-1.65-.033a1.651 1.651 0 01-1.53-.86l-.635-1.27a1.651 1.651 0 00-1.53-.86L.842 6.22a1.651 1.651 0 00-1.087.582L-.394 7.948a1.651 1.651 0 000 1.181l.394 1.147c.224.292.36.66.36 1.052v1.274a1.651 1.651 0 00.36 1.052l.88 1.148zM10 15a5 5 0 100-10 5 5 0 000 10z"
													clip-rule="evenodd"
												/>
											</svg>
										</button>
										<button class="text-gray-500 hover:text-green-600" aria-label="Edit student">
											<svg
												class="h-5 w-5"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z"
												/>
												<path
													d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z"
												/>
											</svg>
										</button>
										<button class="text-gray-500 hover:text-red-600" aria-label="Delete student">
											<svg
												class="h-5 w-5"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fill-rule="evenodd"
													d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
													clip-rule="evenodd"
												/>
											</svg>
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="mt-4 flex items-center justify-center pt-2">
				<nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
					<a
						href="/"
						class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
					>
						<span class="sr-only">Previous</span>
						<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
					<a
						href="/"
						class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
						>1</a
					>
					<a
						href="/"
						aria-current="page"
						class="relative z-10 inline-flex items-center bg-green-500 px-4 py-2 text-sm font-semibold text-white"
						>2</a
					>
					<a
						href="/"
						class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
						>3</a
					>
					<span
						class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset"
						>...</span
					>
					<a
						href="/"
						class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
						>67</a
					>
					<a
						href="/"
						class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
						>68</a
					>
					<a
						href="/"
						class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
					>
						<span class="sr-only">Next</span>
						<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
				</nav>
			</div>
		</div>
	</div>
</div>
