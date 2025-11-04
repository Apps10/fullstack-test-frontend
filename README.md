# 🖥️ Prueba Técnica - Frontend

Este repositorio contiene el **frontend** para la Prueba Técnica. Está pensado para integrarse con el backend desarrollado en NestJS (ver `README.md` del backend). El frontend está hecho con **React 19 + TypeScript**, usando **Vite** como bundler, **Tailwind CSS** con **daisyUI** y componentes utilitarios de **shadcn/ui** (opcional). Está diseñado para un enfoque moderno, rápido y fácil de extender dentro de una arquitectura monorepo si lo deseas.

---

## 🚀 Tecnologías principales

- **React 19** (con JSX/TSX)
- **TypeScript** (tipado estricto recomendado)
- **Vite** (dev server rápido y build optimizado)
- **Tailwind CSS** + **daisyUI** (estilos utilitarios y componentes)
- **shadcn/ui** (componentes UI opcionales)
- **React Router** (enrutamiento)
- **State management**: React Query / Zustand (sugerido, opcional)
- **WebSockets**: `native WebSocket` o `socket.io` según necesidad (para encuestas en tiempo real)
- **Testing**: Vitest + Testing Library (o Jest si prefieres)
- **Lint & format**: ESLint + Prettier

---

## 🗂️ Estructura recomendada del proyecto

```
frontend/
├── public/
├── src/
│   ├── assets/            # Rutas y configuración global (Router)
│   ├── components/        # Componentes compartidos
│   ├── modals/            # modales
│   ├── models/            # Objectos primitivos
│   ├── pages/             # paginas de la app
│   ├── redux/             # redux (hooks, slice, persistents,etc)
│   ├── libs/              # Helpers y utilidades
│   └── main.tsx
├── index.html
├── vite.config.ts
└── package.json
```

---

## ⚙️ Instalación y ejecución (ejemplo con Vite)

### 1. Inicializar proyecto (si no existe)
```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
```

### 2. Instalar dependencias sugeridas
```bash
npm install
```



### 3. Variables de entorno
Crea un archivo `.env` (o `.env.local`) con la URL del backend:
```
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

En el código puedes acceder con `import.meta.env.VITE_API_URL`.

---



### 3. Correr en local
```
npm run dev
```

En el código puedes acceder con `import.meta.env.VITE_API_URL`.

---

## 🔌 Integración con el backend (endpoints de ejemplo)

A continuación ejemplos de requests que el frontend consumirá del backend (`VITE_API_URL`):

- Crear orden (POST `/orders`) — payload: `{ orderItems: [{ productId, quantity }], delivery: { name, email, address } }`
- Checkout (POST `/checkout`) — payload: `{ transactionId, creditCard: <base64-payload>, customerId, emailHolder }`
- Listar productos (GET `/products`)
- Obtener transacción (GET `/transactions/:id`)

Ejemplo con `axios`:
```ts
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Obtener productos
export const getProducts = () => api.get('/products');

// Crear orden
export const createOrder = (payload) => api.post('/orders', payload);
```


## 🧩 Patrones y buenas prácticas (recomendadas)

- **Separa lógica de UI**: usar hooks para lógica y componentes solo para render.
- **Adapters**: crea un adaptador `services/api.ts` que encapsule `axios` para facilitar tests.
- **Types**: compartidos con backend si es posible (monorepo) o genera via OpenAPI/TypeGen.
- **Error handling**: usa Result Pattern en el frontend o maneja errores con `toast`/modales.
- **Testing**: tests unitarios para hooks, pruebas de integración para flows críticos.
- **CI**: añade GH Actions para lint, build y tests en cada PR.

---

## 📦 Deploy

- Build de producción:
```bash
npm run build
```

- Servir la carpeta `dist` en un CDN o con un servidor estático (Netlify, Vercel, Surge, nginx).

---

## 🤝 Contribuciones

- Sigue el estándar de estilo (ESLint + Prettier).
- Abre PRs pequeñas y descriptivas.
- Escribe tests para nuevas funcionalidades.

---

## 🧑‍💻 Autor

Desarrollado por **Alfonso Contreras** — Frontend para la Prueba Técnica.

---