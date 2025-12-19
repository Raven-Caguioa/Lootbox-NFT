export const theme = {
  colors: {
    primary: {
      from: 'from-purple-500',
      to: 'to-pink-500',
      text: 'text-purple-600',
      bg: 'bg-purple-100',
      hover: 'hover:bg-purple-200'
    },
    background: {
      main: 'bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50',
      card: 'bg-white',
      cardHover: 'hover:bg-gray-50'
    },
    text: {
      primary: 'text-gray-800',
      secondary: 'text-gray-600',
      muted: 'text-gray-500'
    },
    border: {
      default: 'border-gray-200',
      light: 'border-gray-100'
    },
    rarity: {
      common: 'bg-gray-200 text-gray-600',
      rare: 'bg-blue-100 text-blue-700',
      super: 'bg-pink-100 text-pink-700',
      ultra: 'bg-yellow-100 text-yellow-700'
    }
  },
  spacing: {
    container: 'max-w-7xl mx-auto px-6',
    section: 'mb-8',
    card: 'p-6'
  }
};