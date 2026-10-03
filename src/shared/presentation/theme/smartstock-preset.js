import { definePreset } from '@primeuix/themes'
import Material from '@primeuix/themes/material'

// The Material Design theme is defined here, once. Views never set their own colors.
export const SmartStockPreset = definePreset(Material, {
  semantic: {
    primary: {
      50: '#eaf2fd', 100: '#d3e4fa', 200: '#a8c9f5', 300: '#7cadf0', 400: '#4a8ae2',
      500: '#1266d4', 600: '#0f56b3', 700: '#0c4592', 800: '#093571', 900: '#082b4c', 950: '#051c33',
    },
  },
})
