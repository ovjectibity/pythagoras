<script lang="ts">
  import Dropdown from './dropdown.svelte';

  export let selectedChat: string;
  export let onChatChange: (chat: string) => void;

  const chatOptions = [
    { value: 'chat-1', label: 'Chat 1' },
    { value: 'chat-2', label: 'Chat 2' },
    { value: 'chat-3', label: 'Chat 3' }
  ];

  const onSettings = () => void {
    
  };
</script>

<div class="header">
  <Dropdown
    items={chatOptions}
    selectedValue={selectedChat}
    onSelect={onChatChange}
    position="down"
  />
  <div class="header-actions">
    <button class="icon-button" title="New">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
    <button class="icon-button" title="More" on:click={onSettings}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="4" r="1" fill="currentColor"/>
        <circle cx="8" cy="8" r="1" fill="currentColor"/>
        <circle cx="8" cy="12" r="1" fill="currentColor"/>
      </svg>
    </button>
  </div>
</div>
