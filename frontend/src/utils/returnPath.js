export function safeReturnPath(value,fallback='/journey'){
  return typeof value==='string'&&value.startsWith('/')&&!value.startsWith('//')&&!value.includes('\\')&&!value.startsWith('/auth')&&!/[\r\n]/.test(value)?value:fallback;
}
