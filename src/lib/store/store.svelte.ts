import { writable } from 'svelte/store';

export const image = $state<{ value: File | undefined }>({ value: undefined });