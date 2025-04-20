<script lang="ts">
  import '$lib/styles/app.scss';
  import { onMount } from 'svelte';
  import { complianceMode, safeMode, modalStore } from '$lib/stores';
  import CookieWall from '$lib/components/CookieWall.svelte';
  
  // Zufälliges Auslösen des Cease & Desist Alerts
  onMount(() => {
    const timeout = setTimeout(() => {
      if (!$modalStore.open) {
        modalStore.set({
          open: true,
          title: 'Cease & Desist!',
          message: 'Ungenehmigte Aktivität erkannt. Bitte unterlassen Sie jede weitere Innovation.',
          showCancel: false
        });
      }
    }, Math.random() * 60000 + 30000); // Zwischen 30 und 90 Sekunden
    
    return () => clearTimeout(timeout);
  });

  // Compliance Mode Klasse auf body setzen
  $: if (typeof document !== 'undefined') {
    if ($complianceMode) {
      document.body.classList.add('compliance-mode');
    } else {
      document.body.classList.remove('compliance-mode');
    }
  }
  
  // Safe Mode Klasse auf body setzen
  $: if (typeof document !== 'undefined') {
    if ($safeMode) {
      document.body.classList.add('safe-mode');
    } else {
      document.body.classList.remove('safe-mode');
    }
  }
</script>

<div class="app-container">
  <slot />
</div>

<CookieWall />

<style lang="scss">
  .app-container {
    min-height: 100vh;
    background-color: #1e1e1e;
    position: relative;
  }
</style>