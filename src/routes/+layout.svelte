<script lang="ts">
  import '$lib/styles/app.scss';
  import { onMount } from 'svelte';
  import { complianceMode, safeMode, modalStore } from '$lib/stores';
  
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
</script>

<div class="app-container" class:safe-mode={$safeMode}>
  <slot />
</div>

<style lang="scss">
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
  }
</style>