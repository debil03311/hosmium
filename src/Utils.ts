/**
 * Change the direction of slashes in a path string
 * @example
 * -> flipSlashes('path\\to\\file', 'FORWARDS')
 * <- 'path/to/file'
 * -> flipSlashes('path/to/file', 'BACKWARDS')
 * <- 'path\\to\\file'
 * -> flipSlashes('path/to\\file', 'BOTH')
 * <- 'path\\to/file'
 */
export function flipSlashes(path: string, direction?: 'FORWARDS' | 'BACKWARDS' | 'BOTH') {
  switch (direction) {
    default:
    case 'FORWARDS':
      return path.replace(/\\/g, '/')

    case 'BACKWARDS':
      return path.replace(/\//g, '\\')

    case 'BOTH':
      return path
        .replace(/\\/g, '/')
        .replace(/\//g, '\\')
  }
}

export function timestamp() {
  const currentTime = new Date().toLocaleTimeString('ja-JP')
  return `[${currentTime}]`
}