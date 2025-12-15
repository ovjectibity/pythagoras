<script lang="ts">
  import type { ModelMessage } from "../commands.js";

  export let messages: Array<ModelMessage>;
  export let isLoading: boolean;
</script>

<div class="messages">
  {#if messages.length === 0}
    <div class="empty-state">
      <p>Start a conversation to modify your Figma design</p>
    </div>
  {:else}
    {#each messages as message}
      <div class="message {message.role}">
        <div class="message-content">
          <!-- {message.content} -->
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
