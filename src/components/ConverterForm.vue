<script setup>
import { ArrowDownUp, RefreshCw, Sparkles } from 'lucide-vue-next'

defineProps({
  amount: { type: [Number, String], required: true }, fromCurrency: { type: String, required: true }, toCurrency: { type: String, required: true },
  sourceCurrencies: { type: Array, required: true }, targetCurrencies: { type: Array, required: true }, loading: Boolean, canSwap: Boolean
})
const emit = defineEmits(['update:amount', 'update:from-currency', 'update:to-currency', 'refresh', 'swap'])
const selected = (options, code) => options.find((item) => item.code === code)
</script>

<template>
  <section id="conversor" class="glass-panel relative overflow-hidden rounded-[1.75rem] p-5 sm:p-7">
    <div class="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl"></div>
    <div class="relative mb-7 flex items-start justify-between gap-4"><div><div class="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.16em] text-violet-600 dark:text-violet-300"><Sparkles class="h-3.5 w-3.5" /> Conversão inteligente</div><h1 class="text-2xl font-extrabold tracking-[-.04em] sm:text-3xl">Seu dinheiro,<br><span class="text-zinc-500 dark:text-zinc-400">em qualquer direção.</span></h1></div>
      <button @click="emit('refresh')" :disabled="loading" class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-emerald-400 text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-violet-500/35 disabled:cursor-wait disabled:opacity-50" aria-label="Atualizar cotações"><RefreshCw class="h-[17px] w-[17px]" :class="{ 'animate-spin': loading }" /></button>
    </div>
    <div class="relative"><label class="field-label" for="amount">Você envia</label><div class="relative"><span class="absolute inset-y-0 left-4 flex items-center text-xl" aria-hidden="true">{{ selected(sourceCurrencies, fromCurrency)?.flag }}</span><input id="amount" :value="amount" @input="emit('update:amount', $event.target.value)" type="number" min="0" step="any" inputmode="decimal" class="field-control font-numbers text-xl tabular-nums !pl-12" placeholder="0,00" aria-describedby="amount-help" /></div><p id="amount-help" class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Sem tarifas ocultas. A taxa exibida é a taxa de mercado.</p></div>
    <div class="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
      <div><label class="field-label" for="from-currency">De</label><div class="relative"><span class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base" aria-hidden="true">{{ selected(sourceCurrencies, fromCurrency)?.flag }}</span><select id="from-currency" :value="fromCurrency" @change="emit('update:from-currency', $event.target.value)" class="field-control appearance-none !pl-11"><option v-for="currency in sourceCurrencies" :key="currency.code" :value="currency.code">{{ currency.label }} · {{ currency.code }}</option></select></div></div>
      <button @click="emit('swap')" :disabled="!canSwap" class="group mx-auto grid h-11 w-11 place-items-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-600 transition hover:border-violet-400 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-violet-500/10" :title="canSwap ? 'Inverter moedas' : 'Esta combinação não pode ser invertida nos seletores disponíveis'" aria-label="Inverter moedas"><ArrowDownUp class="h-[18px] w-[18px] transition-transform duration-500 group-hover:rotate-180" /></button>
      <div><label class="field-label" for="to-currency">Para</label><div class="relative"><span class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base" aria-hidden="true">{{ selected(targetCurrencies, toCurrency)?.flag }}</span><select id="to-currency" :value="toCurrency" @change="emit('update:to-currency', $event.target.value)" class="field-control appearance-none !pl-11"><option v-for="currency in targetCurrencies" :key="currency.code" :value="currency.code">{{ currency.label }} · {{ currency.code }}</option></select></div></div>
    </div>
  </section>
</template>
