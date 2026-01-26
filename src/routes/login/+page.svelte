<script>
    import { goto } from '$app/navigation';
    import { userSession } from '$lib/sessionStore.js';
    import { fly } from 'svelte/transition'; // Added transition import
    import { onMount } from 'svelte'; // Added onMount to trigger animation

    let email = $state('');
    let password = $state('');
    let error = $state('');
    let visible = $state(false); // Controls the entrance animation

    onMount(() => {
        visible = true; // Triggers the slide-in once the page loads
    });

<<<<<<< HEAD
				$userSession = { token: data.token, role: data.role, username: data.username };
				switch (data.role) {
					case 'SuperAdmin':
						goto('/admin/superadmin/dashboard');
						break;
					case 'Coordinator':
					case 'Staff':
						goto('/admin/main/dashboard');
						break;
					case 'student':
						goto('/student/dashboard');
						break;
					default:
						error = 'Unknown role received. Please contact support.';
						localStorage.removeItem('sessionToken');
						$userSession = null;
				}
			} else {
				const err = await response.json();
				error = err.error || 'Login failed';
				$userSession = null;
			}
		} catch (err) {
			console.error('Login error:', err);
			error = 'Network error';
			$userSession = null;
		}
	}
</script>

<title>Trainalytics Login</title>
<div class="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4">
	<div class="hidden flex-1 flex-col items-start justify-center md:flex">
		<p
			class="mb-5 bg-gradient-to-tr from-green-600 to-green-800 bg-clip-text pl-10 text-5xl font-bold text-transparent lg:pl-40 lg:text-7xl"
		>
			Trainalytics
		</p>
		<p class="pl-10 text-lg lg:pl-40 lg:text-xl">Manage and track student internships effectively.</p>
	</div>

	<div class="w-full max-w-md flex-shrink-0 p-4 md:p-8">
		<div class="rounded-2xl bg-white p-8 shadow-2xl">
			<p class="mb-5 text-left text-2xl font-bold">Log in to your account</p>
			{#if error}
				<p class="mb-4 w-full rounded bg-red-100 p-2 text-center text-sm text-red-700">{error}</p>
			{/if}
			<form onsubmit={handleLogin} class="w-full space-y-4">
				<div>
					<input
						bind:value={email}
						type="text"
						class="w-full rounded-lg border border-gray-400 py-2 pl-4 focus:border-green-500 focus:outline-none"
						placeholder="Username or Email"
						required
					/>
				</div>
				<div>
					<input
						bind:value={password}
						type="password"
						class="w-full rounded-lg border border-gray-400 py-2 pl-4 focus:border-green-500 focus:outline-none"
						placeholder="Password"
						required
					/>
				</div>
				<button
					type="submit"
					class="w-full rounded-lg bg-gradient-to-r from-green-500 to-green-800 p-3 font-bold text-white transition duration-300 hover:scale-105"
				>
					Login
				</button>
			</form>
		</div>
	</div>
=======
    async function handleLogin(event) {
        event.preventDefault();
        error = '';
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('sessionToken', data.token);

                $userSession = { token: data.token, role: data.role, username: data.username };

                switch (data.role) {
                    case 'SuperAdmin':
                        goto('/admin/superadmin/dashboard');
                        break;
                    case 'Coordinator':
                    case 'Staff':
                        goto('/admin/main/dashboard');
                        break;
                    case 'student':
                        goto('/student/dashboard');
                        break;
                    default:
                        error = 'Unknown role received. Please contact support.';
                        localStorage.removeItem('sessionToken');
                        $userSession = null;
                }
            } else {
                const err = await response.json();
                error = err.error || 'Login failed';
                $userSession = null;
            }
        } catch (err) {
            console.error('Login error:', err);
            error = 'Network error';
            $userSession = null;
        }
    }
</script>

<title>Trainalytics Login</title>
<div class="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#0E6245] px-6 py-12 md:px-20"
     style="background: radial-gradient(circle at 10% 95%, #1DB954 0%, #0E6245 70%);">
    
    <div class="absolute -left-10 top-10 h-64 w-64 rounded-full bg-[#1DB954] opacity-20 blur-[100px]"></div>
    <div class="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#191414] opacity-40 blur-[120px]"></div>

    <div class="z-10 flex w-full max-w-6xl flex-col items-center justify-between md:flex-row">
        
        {#if visible}
            <div in:fly={{ x: -100, duration: 1000, opacity: 0 }} class="mb-12 flex flex-col items-start justify-center text-white md:mb-0 md:w-1/2">
                <div class="mb-6 h-1 w-12 bg-white opacity-60"></div> 
                <h1 class="mb-4 text-6xl font-extrabold tracking-tight md:text-8xl text-[#FFFFFF]">
                    Trainalytics
                </h1>
                <p class="max-w-md text-lg leading-relaxed text-gray-200">
                    Trainalytics helps you manage and track student internships effectively with a seamless, data-driven experience.
                </p>
            </div>

            <div in:fly={{ y: 50, duration: 1000, delay: 300, opacity: 0 }} class="w-full max-w-md rounded-2xl border border-white/20 bg-[#3D3D3D]/20 p-10 shadow-2xl backdrop-blur-xl">
                <h2 class="mb-8 text-center text-4xl font-bold text-[#FFFFFF]">
                    Sign <span class="border-b-4 border-[#1DB954] pb-1">in</span>
                </h2>

                {#if error}
                    <p class="mb-4 w-full rounded bg-red-500/20 p-2 text-center text-sm text-red-200 border border-red-500/50">
                        {error}
                    </p>
                {/if}

                <form onsubmit={handleLogin} class="space-y-6">
                    <div>
                        <label class="mb-2 block text-sm font-medium text-gray-200">User Name</label>
                        <input
                            bind:value={email}
                            type="text"
                            class="w-full rounded-full border border-white/10 bg-white/90 py-3 pl-6 text-[#191414] placeholder-gray-400 outline-none focus:ring-4 focus:ring-[#1DB954]/50"
                            placeholder="virgie_admin"
                            required
                        />
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-medium text-gray-200">Password</label>
                        <input
                            bind:value={password}
                            type="password"
                            class="w-full rounded-full border border-white/10 bg-white/90 py-3 pl-6 text-[#191414] placeholder-gray-400 outline-none focus:ring-4 focus:ring-[#1DB954]/50"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        class="relative z-30 mt-4 w-full cursor-pointer rounded-full bg-[#1DB954] py-4 text-lg font-bold text-[#FFFFFF] shadow-lg transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] block"
                        style="cursor: pointer !important;"
                    >
                        Submit
                    </button>
                </form>
            </div>
        {/if}
    </div>
>>>>>>> origin/virgie
</div>