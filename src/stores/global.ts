import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', () => {
  const isCollapse = ref(false)

  return { isCollapse }
})
