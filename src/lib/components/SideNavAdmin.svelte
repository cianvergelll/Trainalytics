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

<aside class="fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col overflow-hidden bg-white ">
  
  <div class="p-8 pb-4">
    <div class="flex items-center gap-3 px-4 py-3 rounded-2xl ">
      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1DB954] font-black text-white shadow-lg">
        T
      </div>
      <h1 class="text-sm font-black tracking-tighter text-[#0E6245] uppercase italic">Trainalytics</h1>
    </div>
  </div>

  <nav class="flex-1 py-4 pl-4"> 
    <ul class="flex flex-col space-y-1">
      
      <li class="relative">
        <a href="/admin/main/dashboard" 
           class="relative z-10 flex items-center gap-3 rounded-l-full bg-gray-100 px-8 py-4 text-[11px] font-black uppercase tracking-widest text-[#0E6245]">
          Dashboard
        </a>
      </li>

      {#each ['Students', 'Announcements', 'Journals', 'Attendance', 'Complaints', 'Reports', 'Settings'] as item}
      <li>
        <a href="/admin/main/{item.toLowerCase()}" class="flex items-center gap-3 px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-[#0E6245] transition-all hover:text-[#1DB954]">
          {item}
        </a>
      </li>
      {/each}
    </ul>
  </nav>

  <div class="p-10 mt-auto">
    <button 
      onclick={logout} 
      class="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#0E6245] hover:text-[#1DB954] transition-all"
    >
      <div class="h-1 w-4 bg-gray-200 rounded-full group-hover:bg-[#1DB954] group-hover:w-6 transition-all"></div>
      Logout
    </button>
  </div>
</aside>

<main class="ml-72 min-h-screen bg-[#f8fafc] p-8">
  </main>