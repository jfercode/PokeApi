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

####### ASCII ART #######
ascii:
	@clear
	@echo "$(CYAN)"
	@echo "╔════════════════════════════════════════╗"
	@echo "║         PokeAPI Full Stack 🔴          ║"
	@echo "║    React + Vite + Node + Docker        ║"
	@echo "╚════════════════════════════════════════╝"
	@echo "$(RESET)"

####### LOADING SYSTEM #######
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
		printf "\r\033[K$(RED)[✖] $(1)$(RESET) (Exit code $$RESULT)\n"; \
		exit $$RESULT; \
	fi
endef

####### HELP #######
help: ascii
	@echo "$(BLUE)Available commands:$(RESET)\n"
	@echo "$(CYAN)PROJECT SETUP:$(RESET)"
	@echo "$(GREEN)make check-env$(RESET)		- Check full configuration and show warnings"
	@echo "$(GREEN)make init$(RESET)			- Initialize Vite + Tailwind project (first time)"
	@echo "$(GREEN)make dev$(RESET)			 - Start development servers (frontend + backend)"
	@echo "$(GREEN)make clean-app$(RESET)	   - Clean app folder to restart"
	@echo ""
	@echo "$(CYAN)DOCKER MANAGEMENT:$(RESET)"
	@echo "$(GREEN)make up$(RESET)			  - Start all containers"
	@echo "$(GREEN)make down$(RESET)			- Stop all containers"
	@echo "$(GREEN)make logs$(RESET)			- View real-time logs"
	@echo "$(GREEN)make logs-frontend$(RESET)	- View frontend logs only"
	@echo "$(GREEN)make logs-backend$(RESET)	 - View backend logs only"
	@echo "$(GREEN)make ps$(RESET)			  - Show active processes"
	@echo "$(GREEN)make stop$(RESET)			- Pause containers (without removing)"
	@echo "$(GREEN)make re$(RESET)			  - Restart everything (fclean + up)"
	@echo "$(GREEN)make fclean$(RESET)		  - Clean volumes and system"
	@echo "$(GREEN)make remove$(RESET)		  - Remove images and networks"
	@echo "$(GREEN)make build$(RESET)		   - Build images without cache"
	@echo ""
	@echo "$(CYAN)UTILITIES:$(RESET)"
	@echo "$(GREEN)make shell-frontend$(RESET)  - Access frontend container shell"
	@echo "$(GREEN)make shell-backend$(RESET)	- Access backend container shell"
	@echo "$(GREEN)make status$(RESET)		  - Show containers, volumes, networks"
	@echo "$(GREEN)make resources$(RESET)	   - View Docker resource usage"
	@echo "$(GREEN)make health$(RESET)		  - Check services health"
	@echo ""

####### ENVIRONMENT VERIFICATION #######

# Silent check: only verifies that .env exists
_check-env-silent:
	@if [ ! -f "./app/.env" ]; then \
		echo "$(RED)✖ .env file not found!$(RESET)"; \
		echo ""; \
		echo "$(YELLOW)Please create a .env file based on .env.example$(RESET)"; \
		echo "$(CYAN)Run: cp .env.example /app/.env and cp .env.example /backend/.env$(RESET)"; \
		exit 1; \
	fi

# Full check with warnings: validates configuration
check-env: ascii
	@if [ ! -f "./app/.env" ]; then \
		echo "$(RED)✖ .env file not found!$(RESET)"; \
		echo ""; \
		echo "$(YELLOW)Please create a .env file based on .env.example$(RESET)"; \
		echo "$(CYAN)Run: cp .env.example /app/.env and cp .env.example /backend/.env$(RESET)"; \
		echo ""; \
		echo "$(RED)⚠ IMPORTANT: Configure all variables before continuing$(RESET)"; \
		exit 1; \
	fi
	@echo "$(GREEN)✔ .env file exists$(RESET)"
	@if ! grep -q "OAUTH_CLIENT_ID" .env || ! grep -q "OAUTH_CLIENT_SECRET" .env; then \
		echo "$(YELLOW)⚠ Warning: OAuth credentials may not be configured$(RESET)"; \
		echo "$(YELLOW)Please edit .env and add your OAuth2 credentials$(RESET)"; \
	fi
	@if ! grep -q "JWT_SECRET" .env || grep -q "CHANGE_THIS_SECRET" .env; then \
		echo "$(YELLOW)⚠ Warning: JWT_SECRET not configured or using default value$(RESET)"; \
		echo "$(YELLOW)Please edit .env and set a secure JWT_SECRET$(RESET)"; \
	fi
	@if ! grep -q "IMAGE_API_KEY" .env; then \
		echo "$(YELLOW)⚠ Warning: IMAGE_API_KEY not configured$(RESET)"; \
		echo "$(YELLOW)Please edit .env and add your image generation API key$(RESET)"; \
	fi

####### PROJECT SETUP #######

# Frontend project initialization command
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


# Clean only configuration files from the app folder
clean-app: ascii
	$(call pretty_do,Cleaning frontend configuration,rm -rf app/node_modules app/package-lock.json app/package.json app/vite.config.ts app/tsconfig*.json app/postcss.config.js app/tailwind.config.js 2>/dev/null || true)
	$(call pretty_do,Cleaning backend configuration,rm -rf backend/node_modules backend/package-lock.json 2>/dev/null || true)
	@echo "$(GREEN)✔ Configuration files cleaned. Your source code is safe.$(RESET)"

# Initialize Vite project with Tailwind CSS (Typescript + React) + Backend
init: ascii check-env
	@if [ -f "app/package.json" ]; then \
		echo "$(YELLOW)⚠ Frontend already initialized. Use 'make clean-app' first if you want to reinitialize.$(RESET)"; \
		exit 1; \
	fi
	$(call pretty_do,Building Docker images,$(COMPOSE) -f $(COMPOSE_FILE) build)
	$(call pretty_do,Setting up frontend project,$(COMPOSE) -f $(COMPOSE_FILE) run --rm -T frontend sh -c '$(CMD_INIT)')
	$(call pretty_do,Installing Google OAuth2 on frontend,$(COMPOSE) -f $(COMPOSE_FILE) run --rm -T frontend sh -c 'npm install @react-oauth/google')
	$(call pretty_do,Installing backend dependencies (Express + OAuth2 + JWT),$(COMPOSE) -f $(COMPOSE_FILE) run --rm -T backend sh -c 'npm install && npm install jsonwebtoken passport passport-google-oauth20 axios google-auth-library')
	@echo "$(GREEN)✔ Project initialized successfully!$(RESET)"

# Start development servers
dev: ascii _check-env-silent
	@if [ ! -f "app/package.json" ]; then \
		echo "$(RED)✖ Frontend not initialized. Run 'make init' first.$(RESET)"; \
		exit 1; \
	fi
	$(call pretty_do,Starting development servers,$(COMPOSE) -f $(COMPOSE_FILE) up -d)
	@echo "$(GREEN)✨ Development servers ready!$(RESET)"
	@echo "  🎨 Frontend:  $(CYAN)http://localhost:5173$(RESET)"
	@echo "  🔧 Backend:   $(CYAN)http://localhost:3000$(RESET)"
	@echo ""
	@echo "$(YELLOW)Tip:$(RESET) Use $(GREEN)make logs$(RESET) to see live output"
	@echo "$(YELLOW)Tip:$(RESET) Use $(GREEN)make health$(RESET) to check services"

####### MAKEFILE UTILITIES #######

up: ascii _check-env-silent
	$(call pretty_do,Starting containers,$(COMPOSE) -f $(COMPOSE_FILE) up --build -d)
	@echo "$(GREEN)✨ PokeAPI Full Stack is ready:$(RESET)"
	@echo "  🎨 Frontend:  $(CYAN)http://localhost:5173$(RESET)"
	@echo "  🔧 Backend:   $(CYAN)http://localhost:3000$(RESET)"

down: ascii
	$(call pretty_do,Stopping containers,$(COMPOSE) -f $(COMPOSE_FILE) down)

fclean: down
	$(call pretty_do,Cleaning volumes and system,$(COMPOSE) -f $(COMPOSE_FILE) down --volumes --remove-orphans && docker volume prune -f && docker system prune -af)

remove: fclean
	$(call pretty_do,Removing images and networks,docker network prune -f && docker rmi $$(docker images -aq) 2>/dev/null || true)

re: fclean up

####### DOCKER UTILITIES #######

logs: ascii
	@$(COMPOSE) -f $(COMPOSE_FILE) logs -f

logs-frontend: ascii
	@$(COMPOSE) -f $(COMPOSE_FILE) logs -f frontend

logs-backend: ascii
	@$(COMPOSE) -f $(COMPOSE_FILE) logs -f backend

stop: ascii
	$(call pretty_do,Pausing containers,$(COMPOSE) -f $(COMPOSE_FILE) stop)

ps: ascii
	@docker ps

build: ascii
	$(call pretty_do,Building images,$(COMPOSE) -f $(COMPOSE_FILE) build --no-cache)

shell-frontend:
	@$(COMPOSE) -f $(COMPOSE_FILE) exec frontend /bin/sh

shell-backend:
	@$(COMPOSE) -f $(COMPOSE_FILE) exec backend /bin/sh

# Backwards compatibility
shell: shell-frontend

####### DEVELOPMENT UTILITIES #######

status: ascii
	@echo "$(BLUE)=== CONTAINERS ===$(RESET)"
	@docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
	@echo ""
	@echo "$(BLUE)=== VOLUMES ===$(RESET)"
	@docker volume ls
	@echo ""
	@echo "$(BLUE)=== NETWORKS ===$(RESET)"
	@docker network ls
	@echo ""
	@echo "$(BLUE)=== ENVIRONMENT ===$(RESET)"
	@if [ -f "./app/.env" ]; then \
		echo "$(GREEN)✔ Frontend .env exists$(RESET)"; \
		if grep -q "CHANGE_THIS" ./app/.env 2>/dev/null; then \
			echo "$(YELLOW)⚠ Frontend: Some variables may need configuration$(RESET)"; \
		fi; \
	else \
		echo "$(RED)✖ Frontend .env missing$(RESET)"; \
	fi
	@if [ -f "./backend/.env" ]; then \
		echo "$(GREEN)✔ Backend .env exists$(RESET)"; \
		if grep -q "CHANGE_THIS" ./backend/.env 2>/dev/null; then \
			echo "$(YELLOW)⚠ Backend: Some variables may need configuration$(RESET)"; \
		fi; \
	else \
		echo "$(RED)✖ Backend .env missing$(RESET)"; \
	fi

resources:
	@docker stats --no-stream

health: ascii
	@echo "$(BLUE)Checking services...$(RESET)\n"
	@echo "$(CYAN)Frontend (5173):$(RESET)"
	@curl -s http://localhost:5173 > /dev/null && echo "$(GREEN)✔ Responding$(RESET)" || echo "$(RED)✖ Not responding$(RESET)"
	@echo ""
	@echo "$(CYAN)Backend (3000):$(RESET)"
	@curl -s http://localhost:3000/health > /dev/null && echo "$(GREEN)✔ Responding$(RESET)" || echo "$(RED)✖ Not responding$(RESET)"
	@echo ""
	@if [ -f "./app/.env" ]; then \
		echo "$(CYAN)Environment:$(RESET)"; \
		if grep -q "CHANGE_THIS" .env 2>/dev/null; then \
			echo "$(YELLOW)⚠ Some credentials need to be configured$(RESET)"; \
		else \
			echo "$(GREEN)✔ Environment configured$(RESET)"; \
		fi; \
	fi

####### USEFUL ALIASES #######
restart: down up
test: health
info: status