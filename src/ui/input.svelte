<script lang="ts">
  import Dropdown from './dropdown.svelte';

  interface Props {
    userInput: string;
    isLoading: boolean;
    onSend: () => void;
    onKeyPress: (event: KeyboardEvent) => void;
    selectedModel: string;
    onModelChange: (model: string) => void;
  }

  let {
    userInput = $bindable(),
    isLoading,
    onSend,
    onKeyPress,
    selectedModel,
    onModelChange
  }: Props = $props();

  const modelOptions = new Map([
    ['claude-opus-4', 'Claude Opus 4' ],
    ['claude-opus-4', 'Claude Sonnet 4' ],
    ['claude-haiku-4-5-20251001', 'Claude Haiku 4.5' ]
  ]);
</script>

<div class="input-container">
  <div class="textarea-wrapper">
    <div
    class="input-area"
    contenteditable="true"
    bind:textContent={userInput}
    onkeypress={onKeyPress}
    data-placeholder="Describe the changes you want to make..."
    class:disabled={isLoading}
    role="textbox"
    tabindex="0"
></div>
  </div>
  <div class="input-controls">
    <Dropdown
      items={modelOptions}
      selectedKey={selectedModel}
      onSelect={onModelChange}
      disabled={isLoading}
      position="up"
    />
    <button
      class="send-button"
      onclick={onSend}
      disabled={!userInput.trim() || isLoading}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</div>
