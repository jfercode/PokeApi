####### VARIABLES DE MAKE #######
MAKEFLAGS += --no-print-directory

COMPOSE = docker compose
COMPOSE_FILE = docker-compose.yml

export PATH := /usr/local/bin:/usr/bin:/bin:/sbin:/usr/sbin:$(PATH)

.PHONY: all up down fclean remove re logs stop ps ascii help init dev clean-app build shell status resources health restart test info check-env

####### COLORES #######
RED    = \033[0;31m
GREEN  = \033[0;32m
YELLOW = \033[0;33m
CYAN   = \033[0;36m
BLUE   = \033[0;34m
RESET  = \033[0m

all: up

####### ARTE ASCII #######
ascii:
	@clear
	@echo "$(CYAN)"
	@echo "╔════════════════════════════════════════╗"
	@echo "║         PokeAPI Full Stack 🔴          ║"
	@echo "║    React + Vite + Node + Docker        ║"
	@echo "╚════════════════════════════════════════╝"
	@echo "$(RESET)"

####### SISTEMA DE CARGA #######
define pretty_do
	@\
	printf "$(YELLOW)[···]$(RESET) $(1) ...\n"; \
	( \
		while :; do \
			for s in ".  " ".. " "..." "   "; do \
				printf "\r\033[K$(YELLOW)[%s]$(RESET) $(1) ..." "$$s"; \
				sleep 0.3; \
			done \
		done \
	) & \
	SPIN_PID=$$!; \
	{ $(2); } & \
	MAIN_PID=$$!; \
	trap "kill $$SPIN_PID $$MAIN_PID 2>/dev/null; exit 1" INT TERM; \
	wait $$MAIN_PID; \
	RESULT=$$?; \
	kill $$SPIN_PID >/dev/null 2>&1; \
	wait $$SPIN_PID 2>/dev/null; \
	trap - INT TERM; \
	if [ $$RESULT -eq 0 ]; then \
		printf "\r\033[K$(GREEN)[✔] $(1)$(RESET)\n"; \
	else \
		printf "\r\033[K$(RED)[✖] $(1)$(RESET) (Código de salida $$RESULT)\n"; \
		exit $$RESULT; \
	fi
endef

####### AYUDA #######
help: ascii
	@echo "$(BLUE)Comandos disponibles:$(RESET)\n"
	@echo "$(CYAN)CONFIGURACIÓN DEL PROYECTO:$(RESET)"
	@echo "$(GREEN)make check-env$(RESET)		- Verificar configuración de /app/.env"
	@echo "$(GREEN)make init$(RESET)			- Inicializar proyecto Vite + Tailwind (primera vez)"
	@echo "$(GREEN)make dev$(RESET)			 - Iniciar servidor de desarrollo (frontend + backend)"
	@echo "$(GREEN)make clean-app$(RESET)	   - Limpiar carpeta app para reiniciar"
	@echo ""
	@echo "$(CYAN)GESTIÓN DE DOCKER:$(RESET)"
	@echo "$(GREEN)make up$(RESET)			  - Iniciar todos los contenedores"
	@echo "$(GREEN)make down$(RESET)			- Detener todos los contenedores"
	@echo "$(GREEN)make logs$(RESET)			- Ver logs en tiempo real"
	@echo "$(GREEN)make logs-frontend$(RESET)	- Ver logs solo del frontend"
	@echo "$(GREEN)make logs-backend$(RESET)	 - Ver logs solo del backend"
	@echo "$(GREEN)make ps$(RESET)			  - Mostrar procesos activos"
	@echo "$(GREEN)make stop$(RESET)			- Pausar contenedores (sin eliminar)"
	@echo "$(GREEN)make re$(RESET)			  - Reiniciar todo (fclean + up)"
	@echo "$(GREEN)make fclean$(RESET)		  - Limpiar volúmenes y sistema"
	@echo "$(GREEN)make remove$(RESET)		  - Eliminar imágenes y redes"
	@echo "$(GREEN)make build$(RESET)		   - Construir imágenes sin caché"
	@echo ""
	@echo "$(CYAN)UTILIDADES:$(RESET)"
	@echo "$(GREEN)make shell-frontend$(RESET)  - Acceder al shell del contenedor frontend"
	@echo "$(GREEN)make shell-backend$(RESET)	- Acceder al shell del contenedor backend"
	@echo "$(GREEN)make status$(RESET)		  - Mostrar contenedores, volúmenes, redes"
	@echo "$(GREEN)make resources$(RESET)	   - Ver uso de recursos de Docker"
	@echo "$(GREEN)make health$(RESET)		  - Verificar salud de los servicios"
	@echo ""

####### VERIFICACIÓN DE ENTORNO #######

# Verificar si existe el archivo /app/.env y tiene las variables requeridas
check-env:
	@if [ ! -f "./app/.env" ]; then \
		echo "$(RED)✖ Archivo .env no encontrado!$(RESET)"; \
		echo ""; \
		echo "$(YELLOW)Por favor crea un archivo .env basándote en .env.example$(RESET)"; \
		echo "$(CYAN)Ejecuta: cp .env.example /app/.env y cp .env.example /backend/.env y quedate con la parte que necesitas para cada uno de los contenedores$(RESET)"; \
		echo ""; \
		echo "$(RED)⚠ IMPORTANTE: Configura todas las variables antes de continuar$(RESET)"; \
		exit 1; \
	fi
	@echo "$(GREEN)✔ Archivo .env existe$(RESET)"
	@if ! grep -q "OAUTH_CLIENT_ID" .env || ! grep -q "OAUTH_CLIENT_SECRET" .env; then \
		echo "$(YELLOW)⚠ Advertencia: Las credenciales OAuth pueden no estar configuradas$(RESET)"; \
		echo "$(YELLOW)Por favor edita .env y agrega tus credenciales OAuth2$(RESET)"; \
	fi
	@if ! grep -q "JWT_SECRET" .env || grep -q "CHANGE_THIS_SECRET" .env; then \
		echo "$(YELLOW)⚠ Advertencia: JWT_SECRET no configurado o usando valor por defecto$(RESET)"; \
		echo "$(YELLOW)Por favor edita .env y establece un JWT_SECRET seguro$(RESET)"; \
	fi
	@if ! grep -q "IMAGE_API_KEY" .env; then \
		echo "$(YELLOW)⚠ Advertencia: IMAGE_API_KEY no configurado$(RESET)"; \
		echo "$(YELLOW)Por favor edita .env y agrega tu API key de generación de imágenes$(RESET)"; \
	fi

####### CONFIGURACIÓN DEL PROYECTO #######

# Comando de inicialización del proyecto frontend
CMD_INIT := set -e; \
	cd /tmp; \
	npm create vite@latest temp-project -- --template react-ts; \
	cp /tmp/temp-project/package.json /app/; \
	cp /tmp/temp-project/vite.config.ts /app/; \
	cp /tmp/temp-project/tsconfig.json /app/; \
	cp /tmp/temp-project/tsconfig.node.json /app/; \
	cp /tmp/temp-project/tsconfig.app.json /app/ 2>/dev/null || true; \
	rm -rf /tmp/temp-project; \
	cd /app; \
	npm install; \
	npm install -D tailwindcss@3.4.17 postcss@8.4.49 autoprefixer@10.4.20; \
	npm install react-router-dom; \
	npx tailwindcss init -p; \
	printf "%s\n" "export default {" "  plugins: {" "    tailwindcss: {}," "    autoprefixer: {}," "  }," "};" > postcss.config.js; \
	printf "%s\n" "/** @type {import(\"tailwindcss\").Config} */" "export default {" "  content: [" "    \"./index.html\"," "    \"./src/**/*.{js,ts,jsx,tsx}\"," "  ]," "  theme: {" "    extend: {}," "  }," "  plugins: []," "};" > tailwind.config.js; \
	if ! grep -q "@tailwind base;" src/index.css 2>/dev/null; then \
		printf "%s\n" "@tailwind base;" "@tailwind components;" "@tailwind utilities;" "" | cat - src/index.css > /tmp/index.css && mv /tmp/index.css src/index.css; \
	fi


# Limpiar solo archivos de configuración de la carpeta app
clean-app: ascii
	$(call pretty_do,Limpiando configuración del frontend,rm -rf app/node_modules app/package-lock.json app/package.json app/vite.config.ts app/tsconfig*.json app/postcss.config.js app/tailwind.config.js 2>/dev/null || true)
	$(call pretty_do,Limpiando configuración del backend,rm -rf backend/node_modules backend/package-lock.json 2>/dev/null || true)
	@echo "$(GREEN)✔ Archivos de configuración limpiados. Tu código fuente está seguro.$(RESET)"

# Inicializar proyecto Vite con Tailwind CSS (Typescript + React) + Backend
init: ascii check-env
	@if [ -f "app/package.json" ]; then \
		echo "$(YELLOW)⚠ Frontend ya inicializado. Usa 'make clean-app' primero si quieres reinicializar.$(RESET)"; \
		exit 1; \
	fi
	$(call pretty_do,Construyendo imágenes de Docker,$(COMPOSE) -f $(COMPOSE_FILE) build)
	$(call pretty_do,Configurando proyecto frontend,$(COMPOSE) -f $(COMPOSE_FILE) run --rm -T frontend sh -c '$(CMD_INIT)')
	$(call pretty_do,Instalando Google OAuth2 en frontend,$(COMPOSE) -f $(COMPOSE_FILE) run --rm -T frontend sh -c 'npm install @react-oauth/google')
	$(call pretty_do,Instalando dependencias del backend (Express + OAuth2 + JWT),$(COMPOSE) -f $(COMPOSE_FILE) run --rm -T backend sh -c 'npm install && npm install jsonwebtoken passport passport-google-oauth20 axios google-auth-library')
	@echo "$(GREEN)✔ Proyecto inicializado exitosamente!$(RESET)"

# Iniciar servidor de desarrollo
dev: ascii check-env
	@if [ ! -f "app/package.json" ]; then \
		echo "$(RED)✖ Frontend no inicializado. Ejecuta 'make init' primero.$(RESET)"; \
		exit 1; \
	fi
	$(call pretty_do,Iniciando servidores de desarrollo,$(COMPOSE) -f $(COMPOSE_FILE) up -d)
	@echo "$(GREEN)✨ Servidores de desarrollo listos!$(RESET)"
	@echo "  🎨 Frontend:  $(CYAN)http://localhost:5173$(RESET)"
	@echo "  🔧 Backend:   $(CYAN)http://localhost:3000$(RESET)"
	@echo ""
	@echo "$(YELLOW)Consejo:$(RESET) Usa $(GREEN)make logs$(RESET) para ver la salida en vivo"
	@echo "$(YELLOW)Consejo:$(RESET) Usa $(GREEN)make health$(RESET) para verificar los servicios"

####### UTILIDADES DEL MAKEFILE #######

up: ascii check-env
	$(call pretty_do,Iniciando contenedores,$(COMPOSE) -f $(COMPOSE_FILE) up --build -d)
	@echo "$(GREEN)✨ PokeAPI Full Stack está listo:$(RESET)"
	@echo "  🎨 Frontend:  $(CYAN)http://localhost:5173$(RESET)"
	@echo "  🔧 Backend:   $(CYAN)http://localhost:3000$(RESET)"

down: ascii
	$(call pretty_do,Deteniendo contenedores,$(COMPOSE) -f $(COMPOSE_FILE) down)

fclean: down
	$(call pretty_do,Limpiando volúmenes y sistema,$(COMPOSE) -f $(COMPOSE_FILE) down --volumes --remove-orphans && docker volume prune -f && docker system prune -af)

remove: fclean
	$(call pretty_do,Eliminando imágenes y redes,docker network prune -f && docker rmi $$(docker images -aq) 2>/dev/null || true)

re: fclean up

####### UTILIDADES DE DOCKER #######

logs: ascii
	@$(COMPOSE) -f $(COMPOSE_FILE) logs -f

logs-frontend: ascii
	@$(COMPOSE) -f $(COMPOSE_FILE) logs -f frontend

logs-backend: ascii
	@$(COMPOSE) -f $(COMPOSE_FILE) logs -f backend

stop: ascii
	$(call pretty_do,Pausando contenedores,$(COMPOSE) -f $(COMPOSE_FILE) stop)

ps: ascii
	@docker ps

build: ascii
	$(call pretty_do,Construyendo imágenes,$(COMPOSE) -f $(COMPOSE_FILE) build --no-cache)

shell-frontend:
	@$(COMPOSE) -f $(COMPOSE_FILE) exec frontend /bin/sh

shell-backend:
	@$(COMPOSE) -f $(COMPOSE_FILE) exec backend /bin/sh

# Retrocompatibilidad
shell: shell-frontend

####### UTILIDADES DE DESARROLLO #######

status: ascii
	@echo "$(BLUE)=== CONTENEDORES ===$(RESET)"
	@docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
	@echo ""
	@echo "$(BLUE)=== VOLÚMENES ===$(RESET)"
	@docker volume ls
	@echo ""
	@echo "$(BLUE)=== REDES ===$(RESET)"
	@docker network ls
	@echo ""
	@echo "$(BLUE)=== ENTORNO ===$(RESET)"
	@if [ -f "./app/.env" ]; then \
		echo "$(GREEN)✔ Archivo .env existe$(RESET)"; \
		if grep -q "CHANGE_THIS" .env 2>/dev/null; then \
			echo "$(YELLOW)⚠ Algunas variables pueden necesitar configuración$(RESET)"; \
		fi; \
	else \
		echo "$(RED)✖ Archivo .env falta$(RESET)"; \
	fi

resources:
	@docker stats --no-stream

health: ascii
	@echo "$(BLUE)Verificando servicios...$(RESET)\n"
	@echo "$(CYAN)Frontend (5173):$(RESET)"
	@curl -s http://localhost:5173 > /dev/null && echo "$(GREEN)✔ Respondiendo$(RESET)" || echo "$(RED)✖ No responde$(RESET)"
	@echo ""
	@echo "$(CYAN)Backend (3000):$(RESET)"
	@curl -s http://localhost:3000/health > /dev/null && echo "$(GREEN)✔ Respondiendo$(RESET)" || echo "$(RED)✖ No responde$(RESET)"
	@echo ""
	@if [ -f "./app/.env" ]; then \
		echo "$(CYAN)Entorno:$(RESET)"; \
		if grep -q "CHANGE_THIS" .env 2>/dev/null; then \
			echo "$(YELLOW)⚠ Algunas credenciales necesitan ser configuradas$(RESET)"; \
		else \
			echo "$(GREEN)✔ Entorno configurado$(RESET)"; \
		fi; \
	fi

####### ALIAS ÚTILES #######
restart: down up
test: health
info: status