<script>
	import { goto } from '$app/navigation';
  import { page } from '$app/stores';

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

<aside class="fixed inset-y-4 left-4 z-50 flex h-[calc(100vh-2rem)] w-64 flex-col rounded-3xl bg-white shadow-xl border border-gray-100">
  
  <div class="p-8 pb-4">
    <div class="flex items-center gap-3 px-4 py-3 rounded-2xl ">
      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1DB954] font-black text-white shadow-lg">
        T
      </div>
      <h1 class="text-sm font-black tracking-tighter text-[#0E6245] uppercase italic">Trainalytics</h1>
    </div>
  </div>

  <script>
  import { page } from '$app/stores'; // Import the page store to track current URL
</script>

<nav class="flex-1 px-3 py-4">
    <ul class="space-y-1">
      {#each [
        { name: 'Dashboard', icon: 'layout-grid', path: '/admin/main/dashboard' },
        { name: 'Students', icon: 'users', path: '/admin/main/students' },
        { name: 'Announcements', icon: 'megaphone', path: '/admin/main/announcements' },
        { name: 'Journals', icon: 'book-open', path: '/admin/main/journals' },
        { name: 'Attendance', icon: 'calendar-check', path: '/admin/main/attendance' },
        { name: 'Complaints', icon: 'alert-circle', path: '/admin/main/complaints' },
        { name: 'Reports', icon: 'bar-chart-3', path: '/admin/main/reports' },
        { name: 'Settings', icon: 'settings', path: '/admin/main/settings' }
      ] as item}
        {@const isActive = $page.url.pathname === item.path}
        
        <li>
            <a 
              href={item.path} 
              class="group relative flex items-center gap-4 rounded-xl px-4 py-3 text-sm transition-all
              {isActive ? 'bg-green-50 text-green-600 font-semibold' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600 font-medium'}"
            >
                {#if isActive}
                  <div class="absolute right-0 h-6 w-1 rounded-l-full bg-green-600"></div>
                {/if}

                <div class="{isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        {#if item.icon === 'layout-grid'}
                            <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
                        {:else if item.icon === 'users'}
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        {:else if item.icon === 'megaphone'}
                            <path d="m3 11 18-5v12L3 13v-2Z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
                        {:else if item.icon === 'book-open'}
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                        {:else if item.icon === 'calendar-check'}
                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/>
                        {:else if item.icon === 'alert-circle'}
                            <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
                        {:else if item.icon === 'bar-chart-3'}
                            <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
                        {:else if item.icon === 'settings'}
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
                        {/if}
                    </svg>
                </div>
                {item.name}
            </a>
        </li>
      {/each}
    </ul>
</nav>
  <div class="p-4 mt-auto">
    <button onclick={logout} class="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 py-4 text-sm font-bold text-white shadow-lg shadow-green-200 transition-transform active:scale-95">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-logout" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z"/>
  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M7 12h14l-3 -3m0 6l3 -3" />
</svg>
      Logout
    </button>
    
  </div>
</aside>