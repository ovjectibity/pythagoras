<script lang="ts">
  import { onMount } from 'svelte';

  // State management
  let apiKey = '';
  let messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  let userInput = '';
  let showSettings = false;
  let isLoading = false;

  // Load API key from localStorage on mount
  onMount(() => {
    try {
      console.log('App mounted');
      const savedKey = localStorage.getItem('anthropic_api_key');
      if (savedKey) {
        apiKey = savedKey;
      }
    } catch (error) {
      console.error('Error in onMount:', error);
    }
  });

  function toggleSettings() {
    showSettings = !showSettings;
  }

  function saveApiKey() {
    localStorage.setItem('anthropic_api_key', apiKey);
    showSettings = false;
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  async function sendMessage() {
    if (!userInput.trim() || isLoading) return;

    if (!apiKey) {
      alert('Please set your API key in settings first');
      showSettings = true;
      return;
    }

    const message = userInput.trim();
    userInput = '';

    // Add user message to chat
    messages = [...messages, { role: 'user', content: message }];
    isLoading = true;

    // TODO: Call Anthropic API here and process response
    // For now, just add a placeholder response
    setTimeout(() => {
      messages = [...messages, {
        role: 'assistant',
        content: 'AI response will be implemented here'
      }];
      isLoading = false;
    }, 500);
  }

  function clearChat() {
    messages = [];
  }
</script>

<div class="app">
  <!-- Header -->
  <div class="header">
    <h1>Pythagoras</h1>
    <div class="header-actions">
      <button class="icon-button" on:click={toggleSettings} title="Settings">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" stroke-width="1.5"/>
          <path d="M13.5 8C13.5 8.38 13.47 8.75 13.42 9.11L14.54 9.93C14.63 10 14.66 10.13 14.6 10.23L13.54 12.27C13.48 12.37 13.35 12.41 13.24 12.37L11.94 11.86C11.68 12.07 11.39 12.24 11.08 12.38L10.89 13.77C10.87 13.89 10.77 13.98 10.64 13.98H8.53C8.4 13.98 8.3 13.89 8.28 13.77L8.09 12.38C7.78 12.24 7.49 12.07 7.23 11.86L5.93 12.37C5.82 12.41 5.69 12.37 5.63 12.27L4.57 10.23C4.51 10.13 4.54 10 4.63 9.93L5.75 9.11C5.7 8.75 5.67 8.38 5.67 8C5.67 7.62 5.7 7.25 5.75 6.89L4.63 6.07C4.54 6 4.51 5.87 4.57 5.77L5.63 3.73C5.69 3.63 5.82 3.59 5.93 3.63L7.23 4.14C7.49 3.93 7.78 3.76 8.09 3.62L8.28 2.23C8.3 2.11 8.4 2.02 8.53 2.02H10.64C10.77 2.02 10.87 2.11 10.89 2.23L11.08 3.62C11.39 3.76 11.68 3.93 11.94 4.14L13.24 3.63C13.35 3.59 13.48 3.63 13.54 3.73L14.6 5.77C14.66 5.87 14.63 6 14.54 6.07L13.42 6.89C13.47 7.25 13.5 7.62 13.5 8Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- Chat Messages -->
  <div class="messages">
    {#if messages.length === 0}
      <div class="empty-state">
        <p>Start a conversation to modify your Figma design</p>
      </div>
    {:else}
      {#each messages as message}
        <div class="message {message.role}">
          <div class="message-content">
            {message.content}
          </div>
        </div>
      {/each}
    {/if}
    {#if isLoading}
      <div class="message assistant">
        <div class="message-content loading">
          <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
        </div>
      </div>
    {/if}
  </div>

  <!-- Input Area -->
  <div class="input-area">
    <textarea
      bind:value={userInput}
      on:keypress={handleKeyPress}
      placeholder="Describe the changes you want to make..."
      rows="1"
      disabled={isLoading}
    />
    <button
      class="send-button"
      on:click={sendMessage}
      disabled={!userInput.trim() || isLoading}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 8L14 2L8 14L7 10L2 8Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
      </svg>
    </button>
  </div>

  <!-- Settings Modal -->
  {#if showSettings}
    <div class="modal-overlay" on:click={toggleSettings}>
      <div class="modal" on:click|stopPropagation>
        <div class="modal-header">
          <h2>Settings</h2>
          <button class="icon-button" on:click={toggleSettings}>
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
          <button class="secondary" on:click={toggleSettings}>Cancel</button>
          <button class="primary" on:click={saveApiKey}>Save</button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    margin: 0;
    padding: 0;
    background: white;
    overflow: hidden;
  }

  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #e5e5e5;
    background: white;
  }

  h1 {
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    color: #333;
  }

  .header-actions {
    display: flex;
    gap: 8px;
  }

  .icon-button {
    padding: 6px;
    border: none;
    background: transparent;
    border-radius: 4px;
    cursor: pointer;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s, color 0.2s;
  }

  .icon-button:hover {
    background-color: #f0f0f0;
    color: #333;
  }

  /* Messages Area */
  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #999;
    font-size: 12px;
  }

  .message {
    max-width: 85%;
    display: flex;
  }

  .message.user {
    align-self: flex-end;
  }

  .message.assistant {
    align-self: flex-start;
  }

  .message-content {
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 12px;
    line-height: 1.5;
    word-wrap: break-word;
  }

  .message.user .message-content {
    background-color: #18a0fb;
    color: white;
  }

  .message.assistant .message-content {
    background-color: #f0f0f0;
    color: #333;
  }

  .message-content.loading {
    display: flex;
    gap: 4px;
  }

  .dot {
    animation: blink 1.4s infinite;
  }

  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes blink {
    0%, 60%, 100% {
      opacity: 0.3;
    }
    30% {
      opacity: 1;
    }
  }

  /* Input Area */
  .input-area {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid #e5e5e5;
    background: white;
    align-items: flex-end;
  }

  textarea {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 12px;
    font-family: inherit;
    resize: none;
    min-height: 36px;
    max-height: 120px;
  }

  textarea:focus {
    outline: none;
    border-color: #18a0fb;
  }

  textarea:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  .send-button {
    padding: 8px;
    border: none;
    background-color: #18a0fb;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
    flex-shrink: 0;
    width: 36px;
    height: 36px;
  }

  .send-button:hover:not(:disabled) {
    background-color: #0d8ce8;
  }

  .send-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #e5e5e5;
  }

  .modal-header h2 {
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    color: #333;
  }

  .modal-body {
    padding: 16px;
  }

  .modal-body label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    margin-bottom: 6px;
    color: #333;
  }

  .modal-body input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 12px;
    font-family: inherit;
  }

  .modal-body input:focus {
    outline: none;
    border-color: #18a0fb;
  }

  .help-text {
    font-size: 11px;
    color: #666;
    margin: 8px 0 0 0;
  }

  .help-text a {
    color: #18a0fb;
    text-decoration: none;
  }

  .help-text a:hover {
    text-decoration: underline;
  }

  .modal-footer {
    display: flex;
    gap: 8px;
    padding: 16px;
    border-top: 1px solid #e5e5e5;
    justify-content: flex-end;
  }

  button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button.primary {
    background-color: #18a0fb;
    color: white;
  }

  button.primary:hover {
    background-color: #0d8ce8;
  }

  button.secondary {
    background-color: #f0f0f0;
    color: #333;
  }

  button.secondary:hover {
    background-color: #e5e5e5;
  }
</style>
