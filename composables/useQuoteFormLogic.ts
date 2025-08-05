import { ref, computed } from 'vue'
import type { Database } from '~/types/database.types'
import type { QuoteItemForm } from '~/types/quote'
import { mapFormToQuoteItem } from '~/types/quote'
import { useQuoteStore } from '~/stores/quote'
import { useFormatting } from './useFormatting'
import { useToast } from '@/components/ui/toast'
import { useSupabaseClient } from '#imports'

/**
 * Tato verze kódu interpretuje `quoteStore.taxIncluded` tím způsobem,
 * že pokud je `taxIncluded = false`, NEpočítá se žádná daň (DPH = 0).
 * Pokud je `taxIncluded = true`, připočítá se DPH k zadané ceně.
 * 
 * Tedy:
 * - taxIncluded = false => total = itemPrice
 * - taxIncluded = true  => total = itemPrice + (itemPrice * taxRate/100)
 */
export function useQuoteFormLogic() {
  const quoteStore = useQuoteStore()
  const { formatCurrency } = useFormatting()
  const supabase = useSupabaseClient<Database>()
  const { toast } = useToast()

  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)

  /**
   * Vrátí částku DPH.
   * - Nyní vždy počítá daň, bez ohledu na taxIncluded
   * - Pokud je položka `isTaxExempt`, daň je 0.
   */
  function calculateActualTax(item: QuoteItemForm): number {
    if (item.isTaxExempt) return 0;
    const basePrice = item.quantity * item.unitPrice;
    return basePrice * (item.taxRate / 100);
  }

  /**
   * Vrátí celkovou cenu (price + daň).
   * - taxIncluded = false => total = itemPrice (daň 0).
   * - taxIncluded = true  => total = itemPrice + tax.
   * - isTaxExempt => daň je 0, total = itemPrice.
   */
  function calculateTotalPrice(item: QuoteItemForm): number {
    const basePrice = item.quantity * item.unitPrice;
    // Přidáme daň pouze pokud je taxIncluded = true
    const tax = quoteStore.taxIncluded ? calculateActualTax(item) : 0;
    return basePrice + tax;
  }

  /**
   * V této variantě se "NET" stává prostě tou cenou, kterou uživatel zadal (protože není "odkud" extrahovat).
   * - Pokud taxIncluded=false, itemPrice zůstává beze změny.
   * - Pokud taxIncluded=true, net i tak interpretujeme jako "základ", ke kterému se přičte daň.
   * 
   * Tzn. pokud chceme nějakou "čistou" cenu, bude to stejná logika, jen se vezme tax = 0 když je false.
   * Hodí se to, pokud jinde v kódu něco vyžaduje "net price".
   */
  const calculateNetPrice = (item: QuoteItemForm) => {
    // Pokud byste chtěli, aby "net" = (basePrice + 0) vždy,
    // a při taxIncluded=true by to *extrahovalo* net, tu logiku 
    // byste museli upravit; ale to jde proti požadavku "daň přičíst až po zaškrtnutí".
    // Takže pro konzistenci bereme net = basePrice.
    return item.quantity * item.unitPrice
  }

  /**
   * Spočítá agregované hodnoty (subtotal, taxTotal, total) pro celý quote.
   * - Subtotal = součet "základní ceny", tedy sum(itemPrice).
   * - taxTotal = součet daní napříč položkami (podle `calculateTax`).
   * - total = pokud je taxIncluded = false, součet = jen itemPrice.
   *           pokud je taxIncluded = true, součet = itemPrice + daň.
   */
  const calculateTotals = computed(() => {
    const items = quoteStore.items

    // Subtotal = prostý součet itemPrice * quantity
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice)
    }, 0)

    // Tax total - vždy počítáme, bez ohledu na taxIncluded
    const taxTotal = items.reduce((sum, item) => sum + calculateActualTax(item), 0)

    // Total: pokud taxIncluded=false => jen součet base. 
    //         pokud true => base + daň.
    const total = subtotal + (quoteStore.taxIncluded ? taxTotal : 0)

    return {
      subtotal: Number(subtotal.toFixed(2)),
      taxTotal: Number(taxTotal.toFixed(2)),
      total: Number(total.toFixed(2))
    }
  })

  /**
   * Základní validace položky
   */
  const validateItem = (item: QuoteItemForm): string[] => {
    const errors: string[] = []
    if (!item.description) errors.push('Description is required')
    if (item.quantity <= 0) errors.push('Quantity must be greater than 0')
    if (item.unitPrice < 0) errors.push('Price cannot be negative')
    return errors
  }

  /**
   * Uložení (update) položek do DB pro danou quoteId
   */
  const supabaseClient = useSupabaseClient<Database>()
  const updateQuoteItems = async (quoteId: string, formItems: QuoteItemForm[], showToast = true) => {
    try {
      isLoading.value = true
      errorMessage.value = null

      // Před uložením spočítáme price (net - nebo prostě basePrice) a total (base + daň)
      const itemsToUpdate = formItems.map(item => ({
        ...mapFormToQuoteItem(item),
        price: calculateNetPrice(item),
        amount: calculateTotalPrice(item)
      }))

      // 1) Nejprve ověříme, jestli quote existuje
      const { data: currentQuote, error: fetchError } = await supabaseClient
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .single()

      if (fetchError) throw fetchError
      if (!currentQuote) {
        throw new Error(`Quote with ID=${quoteId} not found`)
      }

      // 2) Update jen pole "items" + "updated_at"
      const { data, error: updateError } = await supabaseClient
        .from('quotes')
        .update({
          items: itemsToUpdate,
          updated_at: new Date().toISOString()
        })
        .eq('id', quoteId)
        .select()
        .single()

      if (updateError) throw updateError

      if (data && showToast) {
        // Informujeme uživatele (toast)
        toast({
          title: 'Success',
          description: 'Quote items updated successfully'
        })
      }
      return data
    } catch (err: any) {
      errorMessage.value = err.message || String(err)
      if (showToast) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not update quote items: ' + err.message
        })
      }
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    errorMessage,

    // Funkce pro výpočet
    calculateActualTax,
    calculateTotalPrice,
    calculateNetPrice,
    calculateTotals,
    validateItem,

    // DB operace
    updateQuoteItems
  }
}