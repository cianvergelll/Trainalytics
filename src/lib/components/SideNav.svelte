<script>
	import { goto } from '$app/navigation';

	export const errorMessage = '';

	async function logout() {
		const token = localStorage.getItem('sessionToken');

		if (!token) {
			goto('/login');
			return;
		}

		try {
			const res = await fetch('/api/auth/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ token: token })
			});
		} catch (error) {
			console.error('Logout API call failed:', error);
		} finally {
			localStorage.removeItem('sessionToken');
			goto('/login');
		}
	}
</script>

<div class="flex h-full w-full flex-col rounded-2xl bg-white shadow-2xl">
	<ul class="flex flex-col items-center justify-start space-y-2 p-4">
		<li
			class="mt-3 w-[95%] rounded-lg py-3 text-center text-lg font-bold transition duration-250 hover:scale-105 hover:bg-gray-100"
		>
			<a href="/student/dashboard">Dashboard</a>
		</li>
		<li
			class="w-[95%] rounded-lg py-3 text-center text-lg font-bold transition duration-250 hover:scale-105 hover:bg-gray-100"
		>
			<a href="/student/profile">Profile</a>
		</li>
		<li
			class="w-[95%] rounded-lg py-3 text-center text-lg font-bold transition duration-250 hover:scale-105 hover:bg-gray-100"
		>
			<a href="/bill-reminder">Notification</a>
		</li>
		<li
			class="w-[95%] rounded-lg py-3 text-center text-lg font-bold transition duration-250 hover:scale-105 hover:bg-gray-100"
		>
			<a href="/student/journals">Journals</a>
		</li>
		<li
			class="w-[95%] rounded-lg py-3 text-center text-lg font-bold transition duration-250 hover:scale-105 hover:bg-gray-100"
		>
			<a href="/student/attendance">Attendance</a>
		</li>
		<li
			class="w-[95%] rounded-lg py-3 text-center text-lg font-bold transition duration-250 hover:scale-105 hover:bg-gray-100"
		>
			<a href="/notifications">Complains</a>
		</li>
		<li
			class="mt-40 w-[95%] rounded-lg py-3 text-center text-lg font-bold transition duration-250 hover:scale-105 hover:bg-gray-100"
		>
			<a href="foo">Settings</a>
		</li>
		<button
			onclick={logout}
			class="w-[95%] rounded-lg bg-red-500 py-3 text-lg font-bold text-white transition duration-250 hover:scale-105 hover:bg-red-600"
			>Logout</button
		>
	</ul>
</div>
