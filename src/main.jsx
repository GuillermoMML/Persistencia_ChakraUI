import { StrictMode } from 'react'
import {createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider, defaultSystem  } from "@chakra-ui/react"

/*

# 1) Proyecto React con Vite
npm create vite@latest dew-persistencia -- --template react
cd dew-persistencia

# 2) Dependencias UI (Chakra v3 + pares necesarios)
npm i @chakra-ui/react @emotion/react 

# (opcional) iconos
npm i @chakra-ui/icons react-icons

# 3) Arranca
npm run dev

4) Importamos ChakraProvider en src/main.jsx y envolvemos la App

6) Le pasamos value={defaultSystem} a ChakraProvider para evitar errores con la version 3


//Enlace de donde mire los datos 

https://www.chakra-ui.com/docs/get-started/migration

7) AHora para realizar la persistencia nos creamos nuestro api.js en services
*/
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <App />
    </ChakraProvider>
  </StrictMode>,
)
