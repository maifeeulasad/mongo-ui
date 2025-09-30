export const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

export const isProduction = !isDev

export const platform = process.platform

export const isWindows = platform === 'win32'
export const isMac = platform === 'darwin'
export const isLinux = platform === 'linux'