<script setup>
import { Moon, Sun, Wifi, WifiOff } from 'lucide-vue-next'

defineProps({ dark: Boolean, status: { type: String, default: 'loading' }, statusMessage: { type: String, default: 'Conectando' } })
defineEmits(['toggle-theme'])
</script>

<template>
  <header class="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
    <a href="#conversor" class="group flex items-center gap-3 rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-violet-500/30">
      <span class="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-emerald-400 text-lg font-black text-white shadow-lg shadow-violet-500/20 transition-transform duration-300 group-hover:-rotate-6">C</span>
      <span class="leading-tight"><strong class="block text-sm tracking-tight sm:text-base">Câmbio Agora</strong><small class="block text-[10px] font-bold uppercase tracking-[.18em] text-zinc-500 dark:text-zinc-400">finance, sem ruído</small></span>
    </a>
    <div class="flex items-center gap-2 sm:gap-3">
      <div class="hidden items-center gap-2 rounded-full border border-zinc-200 bg-white/60 px-3 py-1.5 text-[11px] font-semibold text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 sm:flex">
        <Wifi v-if="status === 'ready'" class="h-3.5 w-3.5 text-emerald-500" /><WifiOff v-else-if="status === 'offline' || status === 'error'" class="h-3.5 w-3.5 text-amber-500" /><span v-else class="h-2 w-2 animate-pulse rounded-full bg-violet-400" /> {{ statusMessage }}
      </div>
      <button @click="$emit('toggle-theme')" class="grid h-10 w-10 place-items-center rounded-full border border-zinc-200 bg-white/70 text-zinc-700 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/30 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200" :aria-label="dark ? 'Ativar tema claro' : 'Ativar tema escuro'"><Sun v-if="dark" class="h-[18px] w-[18px]" /><Moon v-else class="h-[18px] w-[18px]" /></button>
    </div>
  </header>
</template>
