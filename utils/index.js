export const states = [
  {
    label: 'VIC',
    value: 'vic',
  },
  {
    label: 'NSW',
    value: 'nsw',
  },
  {
    label: 'SA',
    value: 'sa',
  },
  {
    label: 'ACT',
    value: 'act',
  },
  {
    label: 'NT',
    value: 'nt',
  },
  {
    label: 'QLD',
    value: 'qld',
  },
  {
    label: 'TAS',
    value: 'tas',
  },
]

export const getInitials = (name) => {
  const words = name.split(' ')

  const firstInitial = words[0] ? words[0].charAt(0).toUpperCase() : ''
  const secondInitial = words[1] ? words[1].charAt(0).toUpperCase() : ''

  const initials = `${firstInitial}${secondInitial}`

  return initials
}

// Function to exclude user password returned from prisma
export const exclude = (target, keys) => {
  for (let key of keys) {
    delete target[key]
  }
  return target
}

export const convertToFloat = (price_string) => {
  const float_price = parseFloat(price_string)
  const rounded_price = float_price.toFixed(2)
  return rounded_price.toString()
}
