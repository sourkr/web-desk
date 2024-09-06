export function formatError(code, err) {
  const lineno = err.start.line || -1
  const line = code.split('\n')[lineno - 1]
  
  const pointer = ''.padEnd(lineno.toString().length)
    + '    '
    + ''.padEnd(err.start?.col - 1)
    + '^'.padEnd(err.end?.col - err.start?.col, '^')
  
  return ` ${lineno} | ${line}\n${pointer}`
}