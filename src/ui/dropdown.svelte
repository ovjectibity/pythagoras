<script lang="ts">
  export let items: Array<{ value: string; label: string }>;
  export let selectedValue: string;
  export let onSelect: (value: string) => void;
  export let disabled: boolean = false;
  export let position: 'up' | 'down' = 'down';

  let isOpen = false;

  function toggleDropdown() {
    if (!disabled) {
      isOpen = !isOpen;
    }
  }

  function selectItem(value: string) {
    onSelect(value);
    isOpen = false;
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      isOpen = false;
    }
  }

  $: selectedLabel = items.find(item => item.value === selectedValue)?.label || '';
</script>

<svelte:window on:click={handleClickOutside} />

<div class="dropdown" class:disabled>
  <button
    class="dropdown-trigger"
    on:click|stopPropagation={toggleDropdown}
    {disabled}
    type="button"
  >
    <span>{selectedLabel}</span>
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" class="chevron" class:open={isOpen}>
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>

  {#if isOpen}
    <div class="dropdown-list" class:position-up={position === 'up'}>
      {#each items as item}
        <button
          class="dropdown-item"
          class:selected={item.value === selectedValue}
          on:click={() => selectItem(item.value)}
          type="button"
        >
          {item.label}
        </button>
      {/each}
    </div>
  {/if}
</div>
