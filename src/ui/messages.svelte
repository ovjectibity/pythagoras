<script lang="ts">
  import type { ModelMessage } from "../messages.js";

  interface Props {
    messages: Array<ModelMessage>;
    isLoading: boolean;
  }

  let { messages, isLoading }: Props = $props();
</script>

<div class="messages">
  {#if messages.length === 0}
    <div class="empty-state">
      <p>Start a conversation to modify your Figma design</p>
    </div>
  {:else}
    {#each messages as message}
      <div class="message {message.role}">
        {#each message.contents as content}
          {#if content.type === "user_input" || content.type === "user_output"}
            <div class="message-content">
              {content.content}
            </div>
          {/if}
        {/each}
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
