<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import Header from './components/Header.vue'
import ConverterForm from './components/ConverterForm.vue'
import ResultDisplay from './components/ResultDisplay.vue'
import ConversionHistory from './components/ConversionHistory.vue'
import { sourceCurrencies, targetCurrencies, useCurrency } from './composables/useCurrency'

const THEME_KEY = 'cambio-agora-theme-v2'
const { amount, fromCurrency, toCurrency, history, conversion, fetchState, statusMessage, dataSource, fetchRates, saveConversion, clearHistory, formatCurrency, formatDate } = useCurrency()
const dark = ref(false)
let debounceTimer
const canSwap = computed(() => sourceCurrencies.some((currency) => currency.code === toCurrency.value) && targetCurrencies.some((currency) => currency.code === fromCurrency.value))

const applyTheme = (theme) => {
  dark.value = theme === 'dark'
  document.documentElement.classList.toggle('dark', dark.value)
  localStorage.setItem(THEME_KEY, theme)
}
const scheduleConversion = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => { await fetchRates(); saveConversion() }, 450)
}
const refresh = async () => { await fetchRates(true); saveConversion() }
const swapCurrencies = () => {
  if (!canSwap.value) return
  const from = fromCurrency.value
  fromCurrency.value = toCurrency.value
  toCurrency.value = from
}

watch([amount, fromCurrency, toCurrency], scheduleConversion)
onMounted(async () => {
  const storedTheme = localStorage.getItem(THEME_KEY)
  applyTheme(storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  await fetchRates()
  saveConversion()
})
</script>

<template>
  <div class="relative min-h-screen overflow-hidden">
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,.16),transparent_62%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,.18),transparent_62%)]"></div>
    <Header :dark="dark" :status="fetchState" :status-message="statusMessage" @toggle-theme="applyTheme(dark ? 'light' : 'dark')" />
    <main class="relative mx-auto w-full max-w-6xl px-5 pb-14 sm:px-8">
      <div class="mb-8 max-w-2xl sm:mb-10"><p class="mb-3 text-[11px] font-bold uppercase tracking-[.2em] text-violet-600 dark:text-violet-300">Cotação de mercado · BR</p><p class="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">Decida com clareza. Taxas convertidas pela ponte BRL, dados recentes e tudo o que importa em uma tela.</p></div>
      <div class="grid gap-4 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
        <ConverterForm v-model:amount="amount" v-model:from-currency="fromCurrency" v-model:to-currency="toCurrency" :source-currencies="sourceCurrencies" :target-currencies="targetCurrencies" :loading="fetchState === 'loading'" :can-swap="canSwap" @refresh="refresh" @swap="swapCurrencies" />
        <ResultDisplay :conversion="conversion" :loading="fetchState === 'loading'" :data-source="dataSource" :error="fetchState === 'error'" />
      </div>
      <div class="mt-4 max-w-[610px]"><ConversionHistory :history="history" :format-currency="formatCurrency" :format-date="formatDate" @clear="clearHistory" /></div>
    </main>
    <footer class="relative mx-auto w-full max-w-6xl px-5 pb-8 text-[11px] text-zinc-500 dark:text-zinc-500 sm:px-8">Dados fornecidos pela AwesomeAPI. Cotações informativas, sujeitas à variação do mercado.</footer>
  </div>
</template>
