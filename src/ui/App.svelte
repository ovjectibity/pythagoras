<script lang="ts">
  import { onMount } from 'svelte';
  import type { ModelMessage } from "../messages.js";
  import Header from './header.svelte';
  import Messages from './messages.svelte';
  import Input from './input.svelte';

  // State management
  let apiKey: string = "";
  let userInput: string = "";
  let messages: Array<ModelMessage> = [];
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

  function saveApiKey() {
    localStorage.setItem('anthropic_api_key', apiKey);
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
      return;
    }

    const message = userInput.trim();
    userInput = '';
  }

  function clearChat() {
    messages = [];
  }

  function onModeChange(model: string) {

  }

  function onChatChange(chat: string) {

  }
</script>

<div class="app">
  <Header 
  selectedChat={"chat-1"}
  onChatChange={onChatChange} />

  <Messages {messages} {isLoading} />

  <Input
    bind:userInput={userInput}
    {isLoading}
    onSend={sendMessage}
    onKeyPress={handleKeyPress}
    selectedModel={"claude-opus-4"}
    onModelChange={onModeChange}
  />
</div>
