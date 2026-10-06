// A date range is an array [start, end] (what the PrimeVue DatePicker uses in range mode).

// yyyy-MM-dd in the local time zone (what the API expects in ?desde= and ?hasta=)
export function toIsoDate(date) {
    const p = (n) => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`
}

// First and last day of the current month: the default period of sales, purchases and reports
export function currentMonth() {
    const now = new Date()
    return [
        new Date(now.getFullYear(), now.getMonth(), 1),
        new Date(now.getFullYear(), now.getMonth() + 1, 0),
    ]
}

// Query parameters of the API; an empty or half-open range simply leaves them out
export function toQuery(range) {
    const [start, end] = range ?? []
    return {
        ...(start ? { desde: toIsoDate(start) } : {}),
        ...(end ? { hasta: toIsoDate(end) } : {}),
    }
}