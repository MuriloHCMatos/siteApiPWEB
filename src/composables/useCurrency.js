import { computed, ref } from 'vue'

const API_URL = 'https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL,BTC-BRL,ARS-BRL,AUD-BRL,CAD-BRL,CHF-BRL,JPY-BRL,CNY-BRL,CLP-BRL,MXN-BRL'
const CACHE_KEY = 'cambio-agora-rates-v3'
const HISTORY_KEY = 'cambio-agora-history-v2'
const CACHE_MAX_AGE = 2 * 60 * 1000

export const sourceCurrencies = [
  { code: 'USD', label: 'Dólar americano', flag: '🇺🇸' }, { code: 'EUR', label: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', label: 'Libra esterlina', flag: '🇬🇧' }, { code: 'BTC', label: 'Bitcoin', flag: '₿' },
  { code: 'ARS', label: 'Peso argentino', flag: '🇦🇷' }
]
export const targetCurrencies = [
  { code: 'BRL', label: 'Real brasileiro', flag: '🇧🇷' }, { code: 'USD', label: 'Dólar americano', flag: '🇺🇸' }, { code: 'EUR', label: 'Euro', flag: '🇪🇺' }
]

const additionalCurrencies = [
  { code: 'AUD', label: 'D\u00f3lar australiano', flag: '\u{1F1E6}\u{1F1FA}' },
  { code: 'CAD', label: 'D\u00f3lar canadense', flag: '\u{1F1E8}\u{1F1E6}' },
  { code: 'CHF', label: 'Franco su\u00ed\u00e7o', flag: '\u{1F1E8}\u{1F1ED}' },
  { code: 'JPY', label: 'Iene japon\u00eas', flag: '\u{1F1EF}\u{1F1F5}' },
  { code: 'CNY', label: 'Yuan chin\u00eas', flag: '\u{1F1E8}\u{1F1F3}' },
  { code: 'CLP', label: 'Peso chileno', flag: '\u{1F1E8}\u{1F1F1}' },
  { code: 'MXN', label: 'Peso mexicano', flag: '\u{1F1F2}\u{1F1FD}' }
]

sourceCurrencies.unshift({ code: 'BRL', label: 'Real brasileiro', flag: '\u{1F1E7}\u{1F1F7}' })
sourceCurrencies.push(...additionalCurrencies)
targetCurrencies.push(...sourceCurrencies.slice(3))

const currencyMeta = {
  BRL: { locale: 'pt-BR' }, USD: { locale: 'en-US' }, EUR: { locale: 'de-DE' }, GBP: { locale: 'en-GB' }, BTC: { locale: 'pt-BR' }, ARS: { locale: 'es-AR' }, AUD: { locale: 'en-AU' }, CAD: { locale: 'en-CA' }, CHF: { locale: 'de-CH' }, JPY: { locale: 'ja-JP' }, CNY: { locale: 'zh-CN' }, CLP: { locale: 'es-CL' }, MXN: { locale: 'es-MX' }
}
const safeRead = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } }
const safeWrite = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* armazenamento indisponível */ } }
const formatCurrency = (value, currency) => new Intl.NumberFormat(currencyMeta[currency].locale, { style: 'currency', currency, maximumFractionDigits: currency === 'BTC' ? 8 : 2 }).format(value)
const formatDate = (timestamp) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(timestamp)

export function useCurrency() {
  const amount = ref(100)
  const fromCurrency = ref('USD')
  const toCurrency = ref('BRL')
  const rates = ref(null)
  const history = ref(safeRead(HISTORY_KEY, []))
  const fetchState = ref('loading')
  const statusMessage = ref('Preparando cotações')
  const dataSource = ref('')
  const cache = () => safeRead(CACHE_KEY, null)

  const fetchRates = async (force = false) => {
    const cached = cache()
    if (!force && cached?.rates && Date.now() - cached.savedAt < CACHE_MAX_AGE) {
      rates.value = cached.rates; fetchState.value = 'ready'; dataSource.value = 'Cache local'; statusMessage.value = 'Cotações sincronizadas'; return
    }
    fetchState.value = 'loading'; statusMessage.value = 'Atualizando cotações'
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error(`API respondeu ${response.status}`)
      const data = await response.json()
      const expectedPairs = ['USDBRL', 'EURBRL', 'GBPBRL', 'BTCBRL', 'ARSBRL', 'AUDBRL', 'CADBRL', 'CHFBRL', 'JPYBRL', 'CNYBRL', 'CLPBRL', 'MXNBRL']
      if (!data || !expectedPairs.every((pair) => data[pair]?.bid)) throw new Error('Dados de cotação incompletos')
      rates.value = data; safeWrite(CACHE_KEY, { rates: data, savedAt: Date.now() }); fetchState.value = 'ready'; dataSource.value = 'AwesomeAPI'; statusMessage.value = 'Mercado atualizado agora'
    } catch {
      if (cached?.rates) { rates.value = cached.rates; fetchState.value = 'offline'; dataSource.value = 'Cache offline'; statusMessage.value = 'Sem conexão — usando a última cotação salva'; return }
      fetchState.value = 'error'; statusMessage.value = 'Não foi possível carregar as cotações'
    }
  }

  const quoteInBRL = (currency) => {
    if (currency === 'BRL') return { rate: 1, pctChange: 0, timestamp: Date.now() }
    const quote = rates.value?.[`${currency}BRL`]
    if (!quote) throw new Error(`Cotação indisponível para ${currency}`)
    return { rate: Number(quote.bid), pctChange: Number(quote.pctChange), timestamp: Number(quote.timestamp) * 1000 }
  }

  const conversion = computed(() => {
    const numericAmount = Number(amount.value)
    if (!Number.isFinite(numericAmount) || numericAmount < 0 || amount.value === '') return { valid: false, message: 'Informe um valor válido para converter.' }
    if (!rates.value) return { valid: false, message: 'Aguardando dados de cotação.' }
    try {
      const source = quoteInBRL(fromCurrency.value); const target = quoteInBRL(toCurrency.value)
      const unitRate = source.rate / target.rate; const result = numericAmount * unitRate
      const pctChange = (((1 + source.pctChange / 100) / (1 + target.pctChange / 100)) - 1) * 100
      return { valid: true, amount: numericAmount, result, formattedResult: formatCurrency(result, toCurrency.value), unitRate: formatCurrency(unitRate, toCurrency.value), pctChange, updatedAt: formatDate(Math.min(source.timestamp, target.timestamp)), pair: `${fromCurrency.value} → ${toCurrency.value}` }
    } catch { return { valid: false, message: 'Esta cotação não está disponível no momento.' } }
  })

  const saveConversion = () => {
    if (!conversion.value.valid) return
    const item = { id: `${Date.now()}-${fromCurrency.value}-${toCurrency.value}`, amount: conversion.value.amount, from: fromCurrency.value, result: conversion.value.result, to: toCurrency.value, createdAt: Date.now() }
    const previous = history.value[0]
    if (!(previous && previous.amount === item.amount && previous.from === item.from && previous.to === item.to)) { history.value = [item, ...history.value].slice(0, 3); safeWrite(HISTORY_KEY, history.value) }
  }
  const clearHistory = () => { history.value = []; try { localStorage.removeItem(HISTORY_KEY) } catch { /* armazenamento indisponível */ } }

  return { amount, fromCurrency, toCurrency, history, conversion, fetchState, statusMessage, dataSource, fetchRates, saveConversion, clearHistory, formatCurrency, formatDate }
}
