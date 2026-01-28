<script>
	import SideNav from '$lib/components/SideNav.svelte';

	const companies = [
		{
			id: 'C-0001',
			name: 'Tech Solution',
			address: '123 Ayala Avenue',
			email: 'techSolution@gmail.com',
			contact: '(+63) 2 8123 4567',
			timeout: '3:00 PM'
		},
		{
			id: 'C-0002',
			name: 'TechNavyPhil',
			address: '45 Bonifacio Street',
			email: 'technavyPhil@gmail.com',
			contact: '(+63) 2 8123 4567',
			timeout: '4:00 PM'
		}
	];
</script>

<div class="flex h-screen gap-4 bg-gray-50 p-4 font-sans">
	<div class="h-full w-1/5 flex-shrink-0">
		<SideNav activePage="companies" />
	</div>

	<div class="flex h-full flex-1 flex-col rounded-xl bg-white p-8 shadow-lg">
		<div class="mb-6">
			<h1 class="text-3xl font-bold text-gray-800">Settings</h1>
			<p class="text-sm text-gray-500">Pages / Settings</p>
		</div>

		<div class="flex h-full gap-6 overflow-hidden">
			<aside class="w-64 flex-shrink-0 rounded-lg border border-gray-200 bg-gray-50 p-4">
				<h2 class="mb-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
					General Settings
				</h2>
				<ul class="space-y-1 text-sm">
					<li>
						<button
							class="w-full rounded-md bg-white px-3 py-2 text-left font-medium text-green-600 shadow-sm ring-1 ring-gray-200"
						>
							Company Management
						</button>
					</li>
					<li>
						<button
							class="w-full rounded-md px-3 py-2 text-left font-medium text-gray-600 hover:bg-white hover:text-green-600 hover:shadow-sm"
						>
							OJT Role Management
						</button>
					</li>
					<li>
						<button
							class="w-full rounded-md px-3 py-2 text-left font-medium text-gray-600 hover:bg-white hover:text-green-600 hover:shadow-sm"
						>
							Password
						</button>
					</li>
					<li>
						<button
							class="w-full rounded-md px-3 py-2 text-left font-medium text-gray-600 hover:bg-white hover:text-green-600 hover:shadow-sm"
						>
							Theme Preference
						</button>
					</li>
				</ul>
			</aside>

			<main
				class="flex flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
			>
				<div class="mb-6 flex items-center justify-between">
					<div>
						<h2 class="text-xl font-bold text-gray-800">Company Management</h2>
						<p class="text-sm text-gray-500">Manage OJT partner companies</p>
					</div>

					<div class="flex gap-3">
						<button
							class="rounded-lg border border-green-500 px-4 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-50"
						>
							Archived Companies
						</button>

						<button
							class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-600"
						>
							<span class="text-lg leading-none">+</span> Add Company
						</button>
					</div>
				</div>

				<div class="flex-grow overflow-auto rounded-lg border border-gray-400">
					<table class="min-w-full table-auto text-left">
						<thead class="sticky top-0 border-b border-gray-400 bg-gray-50 shadow-sm">
							<tr>
								<th class="px-6 py-4 text-left text-sm font-bold tracking-wider text-black"
									>Company ID</th
								>
								<th class="px-6 py-4 text-left text-sm font-bold tracking-wider text-black"
									>Company</th
								>
								<th class="px-6 py-4 text-left text-sm font-bold tracking-wider text-black"
									>Address</th
								>
								<th class="px-6 py-4 text-left text-sm font-bold tracking-wider text-black"
									>Email</th
								>
								<th class="px-6 py-4 text-left text-sm font-bold tracking-wider text-black"
									>Contact</th
								>
								<th class="px-6 py-4 text-left text-sm font-bold tracking-wider text-black"
									>Time Out</th
								>
								<th class="px-6 py-4 text-center text-sm font-bold tracking-wider text-black"
									>Action</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100 bg-white">
							{#each companies as company}
								<tr class="border-b border-gray-400 transition-colors hover:bg-gray-50">
									<td class="px-6 py-4 text-sm font-medium text-gray-900">{company.id}</td>
									<td class="px-6 py-4 text-sm font-bold text-gray-800">{company.name}</td>
									<td class="px-6 py-4 text-sm text-gray-500">{company.address}</td>
									<td class="px-6 py-4 text-sm text-gray-500">{company.email}</td>
									<td class="px-6 py-4 text-sm text-gray-500">{company.contact}</td>
									<td class="px-6 py-4 text-sm text-gray-500">
										<span
											class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
										>
											{company.timeout}
										</span>
									</td>
									<td class="px-6 py-4 text-center">
										<div class="flex justify-center gap-3">
											<button
												class="text-blue-600 transition-colors hover:text-blue-800"
												title="View Details"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="2"
													stroke="currentColor"
													class="h-5 w-5"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
													/>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
													/>
												</svg>
											</button>

											<button
												class="text-orange-500 transition-colors hover:text-orange-700"
												title="Edit"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="2"
													stroke="currentColor"
													class="h-5 w-5"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
													/>
												</svg>
											</button>

											<button
												class="text-red-600 transition-colors hover:text-red-800"
												title="Archive"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="2"
													stroke="currentColor"
													class="h-5 w-5"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
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
			</main>
		</div>
	</div>
</div>
