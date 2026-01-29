<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	// Accept companyToEdit prop
	let { show = false, companyToEdit = null } = $props();

	let name = $state('');
	let address = $state('');
	let email = $state('');
	let contact = $state('');
	let timeout = $state('5:00 PM');
	let loading = $state(false);

	// Reactively populate form when modal opens or companyToEdit changes
	$effect(() => {
		if (show) {
			if (companyToEdit) {
				name = companyToEdit.CompanyName;
				address = companyToEdit.Address;
				email = companyToEdit.Email;
				contact = companyToEdit.ContactNumber;
				timeout = companyToEdit.TimeOut;
			} else {
				resetForm();
			}
		}
	});

	async function handleSubmit() {
		if (!name) return alert('Company Name is required');
		loading = true;

		try {
			const token = localStorage.getItem('sessionToken');

			// Determine URL and Method based on Edit Mode
			const url = companyToEdit ? `/api/companies/${companyToEdit.ID}` : '/api/companies';

			const method = companyToEdit ? 'PUT' : 'POST';

			const res = await fetch(url, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ name, address, email, contact, timeout })
			});

			if (res.ok) {
				dispatch('success'); // Parent refreshes list
				closeModal();
			} else {
				alert('Failed to save company');
			}
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	}

	function closeModal() {
		dispatch('close');
		// Small delay to prevent flickering reset while closing
		setTimeout(resetForm, 200);
	}

	function resetForm() {
		name = '';
		address = '';
		email = '';
		contact = '';
		timeout = '5:00 PM';
	}
</script>

{#if show}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
		<div class="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
			<h2 class="mb-4 text-xl font-bold text-gray-800">
				{companyToEdit ? 'Edit Company' : 'Add New Company'}
			</h2>

			<div class="space-y-4">
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700">Company Name</label>
					<input
						bind:value={name}
						type="text"
						class="w-full rounded border p-2 focus:ring-2 focus:ring-green-500"
						placeholder="e.g. Accenture"
					/>
				</div>
				<div>
					<label for="address" class="block text-sm font-medium text-gray-700">Address</label>
					<input
						bind:value={address}
						type="text"
						class="w-full rounded border p-2 focus:ring-2 focus:ring-green-500"
						placeholder="Business Address"
					/>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
						<input
							bind:value={email}
							type="email"
							class="w-full rounded border p-2 focus:ring-2 focus:ring-green-500"
						/>
					</div>
					<div>
						<label for="contact" class="block text-sm font-medium text-gray-700">Contact No.</label>
						<input
							bind:value={contact}
							type="text"
							class="w-full rounded border p-2 focus:ring-2 focus:ring-green-500"
						/>
					</div>
				</div>
				<div>
					<label for="timeout" class="block text-sm font-medium text-gray-700"
						>Standard Time Out</label
					>
					<input
						bind:value={timeout}
						type="text"
						class="w-full rounded border p-2 focus:ring-2 focus:ring-green-500"
						placeholder="e.g. 5:00 PM"
					/>
				</div>
			</div>

			<div class="mt-6 flex justify-end gap-3">
				<button onclick={closeModal} class="rounded px-4 py-2 text-gray-600 hover:bg-gray-100"
					>Cancel</button
				>
				<button
					onclick={handleSubmit}
					disabled={loading}
					class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
				>
					{loading ? 'Saving...' : companyToEdit ? 'Update' : 'Add Company'}
				</button>
			</div>
		</div>
	</div>
{/if}
