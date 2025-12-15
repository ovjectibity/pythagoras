<script lang="ts">
  export let items: Array<{ value: string; label: string }>;
  export let selectedValue: string;
  export let onSelect: (value: string) => void;
  export let position: 'up' | 'down' = 'down';
</script>

<div class="dropdown-list" class:position-up={position === 'up'}>
  {#each items as item}
    <button
      class="dropdown-item"
      class:selected={item.value === selectedValue}
      on:click={() => onSelect(item.value)}
      type="button"
    >
      {item.label}
    </button>
  {/each}
</div>
