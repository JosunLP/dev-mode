<script lang="ts">
  import { writable } from 'svelte/store';
  import { prQueue } from '$lib/stores';
  import { onMount, onDestroy } from 'svelte';
  
  // Create local stores for the missing store variables
  const prQueueEnabled = writable<boolean>(true);
  const pullRequests = writable<any[]>([]);
  
  let prAddIntervalId: ReturnType<typeof setInterval>;
  let lastPrId = 0;
  
  // PR types for random generation
  const prTypes = [
    'feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci'
  ];
  
  // Random PR names
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
  
  // Random names for PR authors
  const authors = [
    'sarah.dev', 'mike-coder', 'elena_js', 'dev.master', 'coding_ninja', 
    'typescript_fan', 'webdev_pro', 'frontend_wizard', 'backend_guru', 'full_stack_dev',
    'ui_expert', 'bug_hunter', 'code_reviewer', 'perf_optimizer', 'security_expert'
  ];
  
  // Random honest descriptions for PRs
  const descriptions = [
    'I have no idea if this works',
    'Please merge before Friday, I\'ll be on vacation',
    'It works on my machine',
    'I know the code is bad, but it works',
    'No tests, but should be ok',
    'Hot fix for the prod bug',
    'Please review ASAP!!!',
    'I had to update all dependencies, hope nothing breaks',
    'Finally working now',
    'This change shouldn\'t be necessary',
    '4 AM commit, code could be better',
    'I can clean this up later',
    'Legacy code is a nightmare',
    'Please don\'t look too closely',
    'No clue why this wasn\'t working before',
    'Last change before release',
    'Long-awaited feature, finally done',
    'Merge and hope',
    'I updated the documentation... well, a bit',
    'Can someone completely rewrite this part of the code?'
  ];
  
  // Generates a new random PR
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
      approved: Math.random() > 0.7, // 30% chance that the PR was approved
      needsChanges: Math.random() < 0.2, // 20% chance for change requests
      isUrgent: Math.random() < 0.15, // 15% chance for "Urgent"
    };
  }
  
  // Adds a new PR to the queue
  function addRandomPR() {
    if (!$prQueueEnabled) return;
    
    const newPR = generateRandomPR();
    $pullRequests = [...$pullRequests, newPR];
    
    // If more than 50 PRs, remove the oldest
    if ($pullRequests.length > 50) {
      $pullRequests = $pullRequests.slice(-50);
    }
  }
  
  // Starts automatic PR addition
  function startPRQueue() {
    // Add PRs every 5-20 seconds
    prAddIntervalId = setInterval(() => {
      if ($prQueueEnabled) {
        addRandomPR();
      }
    }, Math.random() * 15000 + 5000); // 5-20s
    
    // Initially add a PR
    setTimeout(() => {
      if ($prQueueEnabled) {
        addRandomPR();
      }
    }, 1000);
  }
  
  // Format the date for display
  function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  onMount(() => {
    // Start PR queue if it's enabled
    if ($prQueueEnabled) {
      startPRQueue();
    }
  });
  
  onDestroy(() => {
    clearInterval(prAddIntervalId);
  });
  
  // React to changes in prQueueEnabled status
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
    <h3>Pull Request Queue ({$pullRequests.length})</h3>
    <div class="pr-queue-list">
      {#each $pullRequests as pr (pr.id)}
        <div class="pr-item" class:urgent={pr.isUrgent}>
          <div class="pr-header">
            <div class="pr-title" title={pr.title}>
              #{pr.id}: {pr.title}
              {#if pr.isUrgent}
                <span class="urgent-tag">URGENT</span>
              {/if}
            </div>
            <div class="pr-author">{pr.author}</div>
          </div>
          <div class="pr-description">{pr.description}</div>
          <div class="pr-footer">
            <div class="pr-date">{formatDate(pr.created)}</div>
            <div class="pr-stats">
              <span class="pr-comments" title="Comments">💬 {pr.comments}</span>
              {#if pr.approved}
                <span class="pr-approved" title="Approved">✅</span>
              {:else if pr.needsChanges}
                <span class="pr-needs-changes" title="Changes required">❌</span>
              {:else}
                <span class="pr-pending" title="Review pending">⏳</span>
              {/if}
            </div>
          </div>
        </div>
      {/each}
      
      {#if $pullRequests.length === 0}
        <div class="no-prs">No pull requests in the queue</div>
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