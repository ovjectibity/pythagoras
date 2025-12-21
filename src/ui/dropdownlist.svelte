<script lang="ts">
  interface Props {
    items: Map<string,string>;
    selectedKey: string;
    onSelect: (value: string) => void;
    position?: 'up' | 'down';
    align?: 'left' | 'right';
  }

  let {
    items,
    selectedKey,
    onSelect,
    position = 'down',
    align = 'left'
  }: Props = $props();
</script>

<div class="dropdown-list" class:position-up={position === 'up'} class:align-right={align === 'right'}>
  {#each items as [key,val] (key)}
    <button
      class="dropdown-item"
      class:selected={key === selectedKey}
      onclick={() => onSelect(key)}
      type="button"
    >
      {val}
    </button>
  {/each}
</div>
