// The Fake API (and later the backend) answers errors as { code: 'INSUFFICIENT_STOCK', ...details }.
// Views translate the code; they never show the raw message.
export function apiError(e) {
    const body = e?.response?.data
    if (body && typeof body === 'object') return body
    return { code: e?.request && !e?.response ? 'NETWORK' : 'UNKNOWN' }
}

export const apiCode = (e) => apiError(e).code ?? 'UNKNOWN'