// GitHub Pages has no server rules: a copy of index.html named 404.html makes Vue Router
// (history mode) work when someone opens or refreshes a deep link such as /smartstock-frontend/sales
import { copyFileSync } from 'node:fs'

copyFileSync('dist/index.html', 'dist/404.html')
console.log('dist/404.html created')