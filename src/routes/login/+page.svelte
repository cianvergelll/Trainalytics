<script lang="ts">
</script>

<title>Kwenta</title>
<div class="flex h-screen w-screen items-center justify-center bg-gray-100">
	<div class="flex h-screen w-[70%] flex-col items-start justify-center">
		<p
			class="mb-5 bg-gradient-to-tr from-green-600 to-green-800 bg-clip-text pl-40 text-7xl font-bold text-transparent"
		>
			Kwenta
		</p>
		<p class="pl-40 text-xl">
			Stay on track of your daily business and personal finances, <br />See where your money goes.
		</p>
	</div>

	<div
		class="mr-40 flex h-[70%] w-[40%] flex-col items-start justify-center rounded-2xl bg-white shadow-2xl"
	>
		<p class="mb-15 ml-12 text-left text-xl font-bold">Log in to your account</p>
		<form class="mx-auto w-[80%] space-y-4">
			<div>
				<input
					class="mx-auto w-full rounded-lg border border-gray-500 py-2 pl-4"
					placeholder="Email"
					required
				/>
			</div>
			<div>
				<input
					type="password"
					class="mx-auto mb-2 w-full rounded-lg border border-gray-500 py-2 pl-4"
					placeholder="Password"
					required
				/>
			</div>
			<a href="/" class="mx-auto mt-2 font-thin text-black">Forgot password?</a>

			<p class="mx-auto">___________________________________________________________</p>
			<button
				type="submit"
				class="mt-1 w-full rounded-lg bg-gradient-to-r from-green-500 to-green-800 p-2 font-bold text-white transition duration-300 hover:scale-105 hover:from-green-800 hover:to-green-500"
			>
				Login
			</button>
		</form>
	</div>
</div>
