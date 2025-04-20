<script lang="ts">
  import { writable } from 'svelte/store';
  import { prQueue } from '$lib/stores';
  import { onMount, onDestroy } from 'svelte';
  
  // Erstelle lokale Stores für die fehlenden Store-Variablen
  const prQueueEnabled = writable<boolean>(true);
  const pullRequests = writable<any[]>([]);
  
  let prAddIntervalId: ReturnType<typeof setInterval>;
  let lastPrId = 0;
  
  // PR-Typen für zufällige Generierung
  const prTypes = [
    'feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci'
  ];
  
  // Zufällige PR-Namen
  const prSubjects = [
    'Update dependencies',
    'Fix edge case in rendering',
    'Add accessibility improvements',
    'Refactor legacy code',
    'Implement new feature',
    'Add unit tests',
    'Fix security vulnerability',
    'Improve documentation',
    'Optimize performance',
    'Fix typos',
    'Update README',
    'Add error handling',
    'Remove deprecated code',
    'Fix CSS issues',
    'Implement design changes',
    'Add internationalization',
    'Fix race condition',
    'Add analytics',
    'Improve error messages',
    'Add caching layer'
  ];
  
  // Zufällige Namen für PR-Autoren
  const authors = [
    'sarah.dev', 'mike-coder', 'elena_js', 'dev.master', 'coding_ninja', 
    'typescript_fan', 'webdev_pro', 'frontend_wizard', 'backend_guru', 'full_stack_dev',
    'ui_expert', 'bug_hunter', 'code_reviewer', 'perf_optimizer', 'security_expert'
  ];
  
  // Zufällige ehrliche Beschreibungen für PRs
  const descriptions = [
    'Ich habe keine Ahnung, ob das funktioniert',
    'Bitte vor Freitag mergen, ich bin dann im Urlaub',
    'Es funktioniert auf meinem Rechner',
    'Ich weiß, der Code ist schlecht, aber er funktioniert',
    'Keine Tests, aber sollte ok sein',
    'Hot fix für den Prod-Bug',
    'ASAP reviewen bitte!!!',
    'Ich musste alle Abhängigkeiten updaten, hoffe, nichts ist kaputt',
    'Funktioniert jetzt endlich',
    'Diese Änderung sollte eigentlich nicht notwendig sein',
    '4 AM Commit, Code könnte besser sein',
    'Ich kann das später aufräumen',
    'Legacy Code ist ein Albtraum',
    'Bitte nicht zu genau anschauen',
    'Keine Ahnung, warum das vorher nicht ging',
    'Letzte Änderung vor dem Release',
    'Lang ersehntes Feature, endlich fertig',
    'Mergen und hoffen',
    'Ich habe die Dokumentation aktualisiert... naja, ein bisschen',
    'Kann jemand diesen Teil des Codes komplett neu schreiben?'
  ];
  
  // Generiert einen neuen zufälligen PR
  function generateRandomPR() {
    const id = ++lastPrId;
    const type = prTypes[Math.floor(Math.random() * prTypes.length)];
    const subject = prSubjects[Math.floor(Math.random() * prSubjects.length)];
    const author = authors[Math.floor(Math.random() * authors.length)];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    const comments = Math.floor(Math.random() * 15);
    
    return {
      id,
      title: `${type}: ${subject}`,
      author,
      description,
      created: new Date().toISOString(),
      comments,
      approved: Math.random() > 0.7, // 30% Chance, dass der PR genehmigt wurde
      needsChanges: Math.random() < 0.2, // 20% Chance für Änderungsanforderungen
      isUrgent: Math.random() < 0.15, // 15% Chance für "Dringend"
    };
  }
  
  // Fügt einen neuen PR zur Queue hinzu
  function addRandomPR() {
    if (!$prQueueEnabled) return;
    
    const newPR = generateRandomPR();
    $pullRequests = [...$pullRequests, newPR];
    
    // Wenn mehr als 50 PRs, entferne die ältesten
    if ($pullRequests.length > 50) {
      $pullRequests = $pullRequests.slice(-50);
    }
  }
  
  // Startet die automatische PR-Hinzufügung
  function startPRQueue() {
    // PRs alle 5-20 Sekunden hinzufügen
    prAddIntervalId = setInterval(() => {
      if ($prQueueEnabled) {
        addRandomPR();
      }
    }, Math.random() * 15000 + 5000); // 5-20s
    
    // Initial einen PR hinzufügen
    setTimeout(() => {
      if ($prQueueEnabled) {
        addRandomPR();
      }
    }, 1000);
  }
  
  // Formatiert das Datum für die Anzeige
  function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  onMount(() => {
    // PR-Queue starten, wenn sie aktiviert ist
    if ($prQueueEnabled) {
      startPRQueue();
    }
  });
  
  onDestroy(() => {
    clearInterval(prAddIntervalId);
  });
  
  // Reaktion auf Änderungen des prQueueEnabled-Status
  $: {
    if ($prQueueEnabled) {
      if (!prAddIntervalId) {
        startPRQueue();
      }
    } else {
      clearInterval(prAddIntervalId);
      prAddIntervalId = undefined as unknown as ReturnType<typeof setInterval>;
    }
  }
</script>

{#if $prQueueEnabled}
  <div class="pr-queue-section">
    <h3>Pull Request-Queue ({$pullRequests.length})</h3>
    <div class="pr-queue-list">
      {#each $pullRequests as pr (pr.id)}
        <div class="pr-item" class:urgent={pr.isUrgent}>
          <div class="pr-header">
            <div class="pr-title" title={pr.title}>
              #{pr.id}: {pr.title}
              {#if pr.isUrgent}
                <span class="urgent-tag">DRINGEND</span>
              {/if}
            </div>
            <div class="pr-author">{pr.author}</div>
          </div>
          <div class="pr-description">{pr.description}</div>
          <div class="pr-footer">
            <div class="pr-date">{formatDate(pr.created)}</div>
            <div class="pr-stats">
              <span class="pr-comments" title="Kommentare">💬 {pr.comments}</span>
              {#if pr.approved}
                <span class="pr-approved" title="Genehmigt">✅</span>
              {:else if pr.needsChanges}
                <span class="pr-needs-changes" title="Änderungen erforderlich">❌</span>
              {:else}
                <span class="pr-pending" title="Review ausstehend">⏳</span>
              {/if}
            </div>
          </div>
        </div>
      {/each}
      
      {#if $pullRequests.length === 0}
        <div class="no-prs">Keine Pull Requests in der Queue</div>
      {/if}
    </div>
  </div>
{/if}

<style lang="scss">
  .pr-queue-section {
    margin-top: 15px;
    border-top: 1px solid #444;
    padding-top: 10px;
    
    h3 {
      margin: 0 0 10px 0;
      font-size: 1.1rem;
      color: #ddd;
    }
  }
  
  .pr-queue-list {
    max-height: 300px;
    overflow-y: auto;
    padding-right: 5px;
  }
  
  .pr-item {
    background-color: rgba(30, 30, 30, 0.6);
    border-left: 3px solid #0078d4;
    border-radius: 4px;
    margin-bottom: 8px;
    padding: 8px 12px;
    font-size: 0.9rem;
    
    &.urgent {
      border-left-color: #ff4500;
      background-color: rgba(50, 25, 20, 0.6);
    }
  }
  
  .pr-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }
  
  .pr-title {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 75%;
    
    .urgent-tag {
      display: inline-block;
      background-color: #ff4500;
      color: white;
      font-size: 0.7rem;
      padding: 2px 5px;
      border-radius: 3px;
      margin-left: 5px;
      vertical-align: middle;
      font-weight: bold;
    }
  }
  
  .pr-author {
    color: #999;
    font-size: 0.8rem;
  }
  
  .pr-description {
    font-size: 0.85rem;
    color: #bbb;
    margin-bottom: 6px;
    font-style: italic;
  }
  
  .pr-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
  }
  
  .pr-date {
    color: #888;
  }
  
  .pr-stats {
    display: flex;
    gap: 10px;
  }
  
  .pr-comments {
    color: #999;
  }
  
  .pr-approved {
    color: #4caf50;
  }
  
  .pr-needs-changes {
    color: #f44336;
  }
  
  .pr-pending {
    color: #ff9800;
  }
  
  .no-prs {
    color: #888;
    font-style: italic;
    text-align: center;
    padding: 20px 0;
  }
</style>