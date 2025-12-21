// @ts-ignore
import App from './App.svelte';
import { mount } from 'svelte';
import './ui.css';

console.log('UI script loaded');
console.log('document.body:', document.body);

let app: any;

if (document.body) {
  console.log('Mounting app immediately');
  // @ts-ignore
  // app = new App({
  //   target: document.body,
  // });
  mount(App, { target: document.body });
} else {
  console.log('Waiting for DOM ready');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready, mounting app');
    // @ts-ignore
    // app = new App({
    //   target: document.body,
    // });
    mount(App, { target: document.body });
  });
}

export default app;
