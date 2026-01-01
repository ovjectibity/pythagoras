<script lang="ts">
  import { run, stopPropagation } from 'svelte/legacy';
  import DropdownList from './dropdownlist.svelte';
  import { 
    type DropdownCategory, 
    getItemFromKey,
    getItemsSize } from '../common';

  interface Props {
    items: Map<string,DropdownCategory>;
    selectedItemKey: string;
    onSelect: (key: string) => void;
    disabled?: boolean;
    position?: 'up' | 'down';
  }

  let {
    items,
    selectedItemKey,
    onSelect,
    disabled = false,
    position = 'down'
  }: Props = $props();

  let isOpen = $state(false);

  function toggleDropdown() {
    if (!disabled) {
      isOpen = !isOpen;
    }
  }

  function selectItem(key: string) {
    onSelect(key);
    isOpen = false;
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      isOpen = false;
    }
  }

  run(() => {
    selectedItemKey = selectedItemKey
  });
</script>

<svelte:window onclick={handleClickOutside} />

<div class="dropdown" class:disabled>
  <button
    class="dropdown-trigger"
    onclick={stopPropagation(toggleDropdown)}
    {disabled}
    type="button"
  >
    <span>
      {#if getItemsSize(items) > 0}
        {getItemFromKey(items,selectedItemKey).label}
      {/if}
    </span>
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" class="chevron" class:open={isOpen}>
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>

  {#if isOpen}
    <DropdownList
      {items}
      selectedItemKey={selectedItemKey}
      {position}
      onSelect={selectItem}
    />
  {/if}
</div>
