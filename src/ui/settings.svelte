<script lang="ts">
  export let apiKey: string;
  export let onClose: () => void;
  export let onSave: () => void;
</script>

<div class="modal-overlay" on:click={onClose}>
  <div class="modal" on:click|stopPropagation>
    <div class="modal-header">
      <h2>Settings</h2>
      <button class="icon-button" on:click={onClose}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    <div class="modal-body">
      <label for="apiKey">Anthropic API Key</label>
      <input
        id="apiKey"
        type="password"
        bind:value={apiKey}
        placeholder="sk-ant-..."
      />
      <p class="help-text">
        Get your API key from <a href="https://console.anthropic.com/" target="_blank">console.anthropic.com</a>
      </p>
    </div>
    <div class="modal-footer">
      <button class="secondary" on:click={onClose}>Cancel</button>
      <button class="primary" on:click={onSave}>Save</button>
    </div>
  </div>
</div>
