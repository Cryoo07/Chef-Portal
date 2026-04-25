export const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&q=85&fit=crop&auto=format',
  recipesBanner: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1600&q=85&fit=crop&auto=format',
  chefsBanner: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=1600&q=85&fit=crop&auto=format',
  chefDashboard: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=1200&q=80&fit=crop&auto=format',
  adminDashboard: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&fit=crop&auto=format',
  userDashboard: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&q=80&fit=crop&auto=format',
  login: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200&q=80&fit=crop&auto=format',
  register: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=80&fit=crop&auto=format',
  chefProfile: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=85&fit=crop&auto=format',
  fallback: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&fit=crop&auto=format',
  categoryDefaults: {
    breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80&fit=crop&auto=format',
    lunch: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&fit=crop&auto=format',
    dinner: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&fit=crop&auto=format',
    dessert: 'https://images.unsplash.com/photo-1488477181228-c7e4529e91c7?w=800&q=80&fit=crop&auto=format',
    snack: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80&fit=crop&auto=format',
    beverage: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80&fit=crop&auto=format',
  },
  recipeByName: {
    'Spaghetti Carbonara': 'https://images.unsplash.com/photo-1608756687911-aa1599ab3bd9?w=800&q=80&fit=crop&auto=format',
    'Neapolitan Pizza Margherita': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80&fit=crop&auto=format',
    'Risotto ai Funghi': 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80&fit=crop&auto=format',
    'Mole Negro': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80&fit=crop&auto=format',
    'Tacos al Pastor': 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80&fit=crop&auto=format',
    'Lamb Rogan Josh': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80&fit=crop&auto=format',
    'Masala Dosa': 'https://images.unsplash.com/photo-1630383249896-483b0fbced25?w=800&q=80&fit=crop&auto=format',
    'Tonkotsu Ramen': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80&fit=crop&auto=format',
    'Tarte Tatin': 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&q=80&fit=crop&auto=format',
    'Chicken Tikka Masala': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80&fit=crop&auto=format',
    'Beef Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80&fit=crop&auto=format',
    'Caesar Salad': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80&fit=crop&auto=format',
    'Chocolate Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80&fit=crop&auto=format',
    Pancakes: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80&fit=crop&auto=format',
    'Avocado Toast': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=800&q=80&fit=crop&auto=format',
  },
}

export const getRecipeImage = (recipe) => {
  if (!recipe) return IMAGES.fallback
  if (recipe.images?.[0]) return recipe.images[0]
  if (recipe.title && IMAGES.recipeByName[recipe.title]) return IMAGES.recipeByName[recipe.title]
  if (recipe.category && IMAGES.categoryDefaults[recipe.category]) return IMAGES.categoryDefaults[recipe.category]
  return IMAGES.fallback
}

export const onImageErrorToFallback = (event) => {
  event.currentTarget.src = IMAGES.fallback
}
