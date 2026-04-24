export const getDateKey = (date = new Date()) => date.toISOString().slice(0, 10)
