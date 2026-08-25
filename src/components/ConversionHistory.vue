<script setup>
import { Clock3, Trash2 } from 'lucide-vue-next'
defineProps({ history: { type: Array, required: true }, formatCurrency: { type: Function, required: true }, formatDate: { type: Function, required: true } })
defineEmits(['clear'])
</script>

<template>
  <section class="rounded-[1.75rem] border border-zinc-200/80 bg-white/50 p-5 dark:border-white/10 dark:bg-white/[.025] sm:p-7">
    <div class="flex items-center justify-between gap-4"><div><p class="text-[11px] font-bold uppercase tracking-[.16em] text-zinc-500 dark:text-zinc-400">Sua atividade</p><h2 class="mt-1 text-lg font-extrabold tracking-[-.03em]">Conversões recentes</h2></div><button v-if="history.length" @click="$emit('clear')" class="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400"><Trash2 class="h-3.5 w-3.5" /> Limpar</button></div>
    <ul v-if="history.length" class="mt-5 space-y-2.5" aria-label="Histórico de conversões"><li v-for="item in history" :key="item.id" class="flex items-center justify-between gap-4 rounded-2xl bg-zinc-100/70 px-4 py-3.5 transition hover:-translate-y-0.5 hover:bg-zinc-100 dark:bg-white/[.045] dark:hover:bg-white/[.075]"><div class="min-w-0"><p class="truncate text-sm font-bold">{{ formatCurrency(item.amount, item.from) }} <span class="mx-1 text-zinc-400">→</span> {{ item.to }}</p><p class="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400"><Clock3 class="h-3 w-3" />{{ formatDate(item.createdAt) }}</p></div><strong class="font-numbers shrink-0 text-sm tabular-nums text-zinc-800 dark:text-zinc-100">{{ formatCurrency(item.result, item.to) }}</strong></li></ul>
    <div v-else class="mt-5 rounded-2xl border border-dashed border-zinc-300 px-4 py-7 text-center text-sm text-zinc-500 dark:border-white/15 dark:text-zinc-400">Suas próximas conversões aparecerão aqui.</div>
  </section>
</template>
