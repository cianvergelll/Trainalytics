<script>
	import { createEventDispatcher, onMount } from 'svelte';

	let { show = false, sections = [] } = $props();

	let student = $state({
		studentId: '',
		firstName: '',
		middleName: '',
		lastName: '',
		email: '',
		contactNumber: '',
		classSection: '',
		username: '',
		password: ''
	});
	let modalElement = $state();

	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
	}

	function handleSubmit(event) {
		event.preventDefault();
		dispatch('add', { ...student });
		handleClose();
	}

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}

	function handleWindowClick(event) {
		if (event.target === modalElement) {
			handleClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} onclick={handleWindowClick} />

{#if show}
	<div
		bind:this={modalElement}
		class="fixed inset-0 z-50 flex items-center justify-center bg-gray-300/85"
	>
		<div
			class="w-full max-w-3xl rounded-lg border-4 border-green-200 bg-white p-8 shadow-xl"
			role="dialog"
			aria-modal="true"
		>
			<h2 class="mb-6 text-center text-2xl font-bold text-gray-800">Add New Student</h2>

			<div class="mb-6 flex justify-center">
				<div class="relative">
					<div
						class="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200 text-gray-400"
					>
						<svg class="h-20 w-20" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<button
						class="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-600 text-white hover:bg-gray-700"
						aria-label="Edit Button"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
							/>
						</svg>
					</button>
				</div>
			</div>

			<form onsubmit={handleSubmit}>
				<div class="space-y-4">
					<div>
						<label for="studentId" class="block text-sm font-medium text-gray-700">Student ID</label
						>
						<input
							type="text"
							id="studentId"
							bind:value={student.studentId}
							class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-green-500 focus:ring-green-500"
							placeholder="-"
							required
						/>
					</div>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div>
							<label for="firstName" class="block text-sm font-medium text-gray-700"
								>First Name</label
							>
							<input
								type="text"
								id="firstName"
								bind:value={student.firstName}
								class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-green-500 focus:ring-green-500"
								placeholder="-"
								required
							/>
						</div>
						<div>
							<label for="middleName" class="block text-sm font-medium text-gray-700"
								>Middle Name</label
							>
							<input
								type="text"
								id="middleName"
								bind:value={student.middleName}
								class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-green-500 focus:ring-green-500"
								placeholder="-"
							/>
						</div>
						<div>
							<label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label
							>
							<input
								type="text"
								id="lastName"
								bind:value={student.lastName}
								class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-green-500 focus:ring-green-500"
								placeholder="-"
								required
							/>
						</div>
					</div>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div>
							<label for="email" class="block text-sm font-medium text-gray-700"
								>Email Address</label
							>
							<input
								type="email"
								id="email"
								bind:value={student.email}
								class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-green-500 focus:ring-green-500"
								placeholder="-"
								required
							/>
						</div>
						<div>
							<label for="contactNumber" class="block text-sm font-medium text-gray-700"
								>Contact Number</label
							>
							<input
								type="text"
								id="contactNumber"
								bind:value={student.contactNumber}
								class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-green-500 focus:ring-green-500"
								placeholder="-"
							/>
						</div>
						<div>
							<label for="classSection" class="block text-sm font-medium text-gray-700"
								>Class Section</label
							>
							<select
								id="classSection"
								bind:value={student.classSection}
								class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-green-500 focus:ring-green-500"
								required
							>
								<option value="" disabled>Select Section</option>
								{#each sections as section}
									<option value={section}>{section}</option>
								{/each}
							</select>
						</div>
					</div>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label for="username" class="block text-sm font-medium text-gray-700">Username</label>
							<input
								type="text"
								id="username"
								bind:value={student.username}
								class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-green-500 focus:ring-green-500"
								placeholder="-"
								required
							/>
						</div>
						<div>
							<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
							<input
								type="password"
								id="password"
								bind:value={student.password}
								class="focus:ring-green-5Otheru-500 mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-green-500"
								placeholder="-"
								required
							/>
						</div>
					</div>
				</div>

				<div class="mt-8 flex justify-end gap-4">
					<button
						type="button"
						onclick={handleClose}
						class="rounded-lg bg-gray-100 px-6 py-2 font-medium text-gray-700 hover:bg-gray-200"
						>Cancel</button
					>
					<button
						type="submit"
						class="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2 font-medium text-white hover:bg-green-600"
					>
						<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path
								d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
							/>
						</svg>
						Add Student
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
