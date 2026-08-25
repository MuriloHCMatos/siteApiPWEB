<script setup>
import { ArrowUpRight, ArrowDownRight, Clock3, Database, TriangleAlert } from 'lucide-vue-next'
defineProps({ conversion: { type: Object, required: true }, loading: Boolean, dataSource: { type: String, default: '' }, error: Boolean })
</script>

<template>
  <section class="glass-panel relative overflow-hidden rounded-[1.75rem] p-5 sm:p-7" aria-live="polite">
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/70 to-transparent"></div>
    <div class="mb-7 flex items-start justify-between gap-4"><div><p class="text-[11px] font-bold uppercase tracking-[.16em] text-zinc-500 dark:text-zinc-400">Você recebe</p><p v-if="conversion.valid" class="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">{{ conversion.pair }}</p></div><span class="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.11em] text-violet-700 dark:text-violet-200"><Database class="h-3 w-3" /> {{ dataSource || 'dados' }}</span></div>
    <template v-if="loading"><div class="h-14 w-4/5 animate-soft-pulse rounded-2xl bg-zinc-200 dark:bg-white/10"></div><div class="mt-4 h-4 w-2/5 animate-soft-pulse rounded bg-zinc-200 dark:bg-white/10"></div></template>
    <template v-else-if="conversion.valid"><output class="block font-numbers text-[2.6rem] font-bold leading-none tracking-[-.075em] tabular-nums sm:text-5xl lg:text-6xl">{{ conversion.formattedResult }}</output><p class="mt-4 text-sm text-zinc-500 dark:text-zinc-400">1 {{ conversion.pair.split(' → ')[0] }} vale <strong class="font-semibold text-zinc-800 dark:text-zinc-200">{{ conversion.unitRate }}</strong></p></template>
    <div v-else class="flex min-h-20 items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400"><TriangleAlert v-if="error" class="h-5 w-5 text-amber-500" />{{ conversion.message }}</div>
    <div v-if="conversion.valid && !loading" class="mt-8 grid gap-5 border-t border-zinc-200 pt-5 dark:border-white/10 sm:grid-cols-2"><div><p class="text-[10px] font-bold uppercase tracking-[.14em] text-zinc-500 dark:text-zinc-400">Variação em 24h</p><p class="mt-1 flex items-center gap-1 font-numbers text-lg font-bold tabular-nums" :class="conversion.pctChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'"><ArrowUpRight v-if="conversion.pctChange >= 0" class="h-4 w-4" /><ArrowDownRight v-else class="h-4 w-4" />{{ conversion.pctChange >= 0 ? '+' : '' }}{{ conversion.pctChange.toFixed(2).replace('.', ',') }}%</p></div><div><p class="text-[10px] font-bold uppercase tracking-[.14em] text-zinc-500 dark:text-zinc-400">Atualizado em</p><p class="mt-1 flex items-center gap-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-200"><Clock3 class="h-3.5 w-3.5 text-zinc-400" />{{ conversion.updatedAt }}</p></div></div>
  </section>
</template>
