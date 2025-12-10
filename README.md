# 🔴 PokeAPI Full Stack

Aplicación Full Stack para crear fusiones de Pokémon con IA, con autenticación OAuth2 de Google.

---

## 🚀 Inicio Rápido

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/jfercode/PokeApi.git
cd PokeApi
```

### 2️⃣ Crear Archivo .env

```bash
cp .env.example .env
```

**IMPORTANTE:** Edita `app/.env` y `backend/.env` con tus credenciales de Google.

### 3️⃣ Inicializar el Proyecto

```bash
make init
```

Este comando instala TODO automáticamente:
- ✅ Vite + React + TypeScript + Tailwind
- ✅ @react-oauth/google
- ✅ Express backend
- ✅ OAuth2 + JWT + todas las dependencias

### 4️⃣ Iniciar Desarrollo

```bash
make dev
```

Accede a:
- 🎨 **Frontend:** http://localhost:5173
- 🔧 **Backend:** http://localhost:3000

---

## 🔐 Configurar Google OAuth2

### Pasos Rápidos

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea nuevo proyecto OAuth2
3. Habilita Google+ API
4. Crea credenciales (Aplicación web)
5. Agrega URIs autorizados:
   - `http://localhost:5173`
   - `http://localhost:3000/api/auth/callback`
6. Copia **Client ID** y **Client Secret**
7. Actualiza `app/.env` y `backend/.env`
8. Ejecuta: `make stop && make dev`

Para instrucciones paso a paso, ver **GOOGLE_OAUTH_VISUAL_GUIDE.md**

---

## 📁 Estructura del Proyecto

```
PokeApi/
├── app/                      # Frontend (React + Vite)
│   └── src/
│       ├── pages/
│       │   ├── Home.tsx     # Landing page con login
│       │   ├── Create.tsx   # Crear fusiones
│       │   └── Gallery.tsx  # Ver fusiones guardadas
│       ├── components/
│       │   └── GoogleLoginButton.tsx
│       ├── App.tsx
│       └── main.tsx         # GoogleOAuthProvider
│
├── backend/                  # Backend (Express + Node)
│   └── src/
│       ├── auth.js          # OAuth2 + JWT
│       └── index.js         # Express server
│
├── docker-compose.yml       # Docker orchestration
├── Makefile                 # Automatización (make init, make dev)
└── .env.example             # Template variables
```

---

## 🛠️ Comandos Principales

```bash
make init              # Inicializar proyecto (PRIMERA VEZ)
make dev               # Iniciar servidores de desarrollo
make stop              # Pausar contenedores
make down              # Detener y eliminar
make logs              # Ver logs en tiempo real
make health            # Verificar salud de servicios
make clean-app         # Limpiar frontend para reiniciar
```

---

## 🔄 Flujo de Autenticación

```
1. Usuario → Haz clic en "Sign in with Google"
2. Google → Popup de consentimiento
3. Usuario → Introduce credenciales
4. Frontend → Recibe JWT de Google
5. Backend → Valida y genera JWT propio
6. Frontend → Guarda token en localStorage
7. App → Autenticado ✅
```

---

## 📦 Tecnologías

### Frontend
- React 18, Vite 5, TypeScript
- Tailwind CSS, React Router
- @react-oauth/google ⭐

### Backend
- Express 4, Node.js
- jsonwebtoken, Passport
- OAuth2, Axios, CORS

### Infraestructura
- Docker, docker-compose
- PokeAPI, Pollinations.ai

---

## ⚙️ Variables de Entorno

### Frontend (`app/.env`)
```properties
VITE_GOOGLE_CLIENT_ID=tu_client_id_aqui
VITE_BACKEND_URL=http://localhost:3000
VITE_POKEAPI_BASE=https://pokeapi.co/api/v2
```

### Backend (`backend/.env`)
```properties
GOOGLE_CLIENT_ID=tu_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_client_secret_aqui
JWT_SECRET=tu_jwt_secret_seguro
```

---

## 🧪 Testing

```bash
# 1. Verificar servicios
make health

# 2. Abrir en navegador
http://localhost:5173

# 3. Hacer click en "Sign in with Google"

# 4. En consola (F12):
localStorage.getItem('authToken')  # Debe tener un token
```

---

## 📚 Documentación Completa

- **OAUTH2_CHECKLIST.md** - Checklist de configuración
- **GOOGLE_OAUTH_VISUAL_GUIDE.md** - Guía visual paso a paso
- **OAUTH2_STATUS.md** - Estado técnico
- **SET_UP.md** - Setup detallado
- **PokeAPI.subject.pdf** - Requisitos del proyecto

---

## ✨ Características

- ✅ Fusión de Pokémon con IA
- ✅ Galería de fusiones guardadas
- ✅ Autenticación OAuth2 Google
- ✅ JWT Tokens seguros
- ✅ Responsive Design
- 🔄 Próximo: MongoDB

---

