####### MAKE VARIABLES #######
MAKEFLAGS += --no-print-directory

COMPOSE = docker compose
COMPOSE_FILE = docker-compose.yml

export PATH := /usr/local/bin:/usr/bin:/bin:/sbin:/usr/sbin:$(PATH)

.PHONY: all up down fclean remove re logs stop ps up-service frontend backend ascii help

####### COLORS #######
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
	@echo "║       React + Express + Docker	 ║"
	@echo "╚════════════════════════════════════════╝"
	@echo "$(RESET)"

####### LOADING SYSTEM #######
# Animated loading spinner with status messages
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
	@echo "$(GREEN)make up$(RESET)              - Start Frontend + Backend containers"
	@echo "$(GREEN)make down$(RESET)            - Stop all containers"
	@echo "$(GREEN)make logs$(RESET)            - View logs in real-time"
	@echo "$(GREEN)make ps$(RESET)              - Show active containers"
	@echo "$(GREEN)make stop$(RESET)            - Pause containers (without removing)"
	@echo "$(GREEN)make re$(RESET)              - Restart everything (fclean + up)"
	@echo "$(GREEN)make fclean$(RESET)          - Clean volumes and system"
	@echo "$(GREEN)make remove$(RESET)          - Delete images and networks"
	@echo "$(GREEN)make frontend$(RESET)        - Start Frontend only"
	@echo "$(GREEN)make backend$(RESET)         - Start Backend only"
	@echo "$(GREEN)make build$(RESET)           - Build images without cache"
	@echo "$(GREEN)make shell-frontend$(RESET)  - Access frontend container shell"
	@echo "$(GREEN)make shell-backend$(RESET)   - Access backend container shell"
	@echo "$(GREEN)make clean-node$(RESET)      - Remove node_modules"
	@echo "$(GREEN)make install$(RESET)         - Clean and reinstall dependencies"
	@echo "$(GREEN)make rebuild$(RESET)         - Clean rebuild of everything"
	@echo "$(GREEN)make status$(RESET)          - Show containers, volumes, networks"
	@echo "$(GREEN)make resources$(RESET)       - View Docker resource usage"
	@echo "$(GREEN)make health$(RESET)          - Check services health"
	@echo "$(GREEN)make logs-frontend$(RESET)   - View frontend logs only"
	@echo "$(GREEN)make logs-backend$(RESET)    - View backend logs only"
	@echo "$(GREEN)make lint-frontend$(RESET)   - Check frontend TypeScript"
	@echo "$(GREEN)make lint-backend$(RESET)    - Check backend TypeScript"
	@echo ""

####### MAKEFILE UTILS #######

# Start Frontend + Backend containers
up: ascii
	$(call pretty_do,Launching Frontend + Backend,$(COMPOSE) -f $(COMPOSE_FILE) up --build -d)
	@echo "$(GREEN)✨ PokeAPI is ready:$(RESET)"
	@echo "  🎨 Frontend:  $(CYAN)http://localhost:5173$(RESET)"
	@echo "  🔧 Backend:   $(CYAN)http://localhost:3000$(RESET)"
	@echo "  💚 Health:    $(CYAN)http://localhost:3000/health$(RESET)"

# Stop containers
down: ascii
	$(call pretty_do,Stopping containers,$(COMPOSE) -f $(COMPOSE_FILE) down)

# Clean volumes and system
fclean: down
	$(call pretty_do,Cleaning volumes and system,$(COMPOSE) -f $(COMPOSE_FILE) down --volumes --remove-orphans && docker volume prune -f && docker system prune -af)

# Remove everything (images, networks, etc)
remove: fclean
	$(call pretty_do,Removing images and networks,docker network prune -f && docker rmi $$(docker images -aq) || true)

# Full restart (clean and start fresh)
re: fclean up

####### DOCKER UTILS #######

# View all logs in real-time
logs: ascii
	@$(COMPOSE) -f $(COMPOSE_FILE) logs -f

# View frontend logs only
logs-frontend:
	@$(COMPOSE) -f $(COMPOSE_FILE) logs -f frontend

# View backend logs only
logs-backend:
	@$(COMPOSE) -f $(COMPOSE_FILE) logs -f backend

# Pause containers without removing them
stop: ascii
	$(call pretty_do,Pausing containers,$(COMPOSE) -f $(COMPOSE_FILE) stop)

# Show active processes
ps: ascii
	$(call pretty_do,Showing active containers,docker ps)

# Build images without cache
build: ascii
	$(call pretty_do,Building images,$(COMPOSE) -f $(COMPOSE_FILE) build --no-cache)

####### SERVICES #######

# Start Frontend container only
frontend: ascii
	$(call pretty_do,Launching Frontend,$(COMPOSE) -f $(COMPOSE_FILE) up --build -d frontend)
	@echo "$(GREEN)✨ Frontend is ready at $(CYAN)http://localhost:5173$(RESET)"

# Start Backend container only
backend: ascii
	$(call pretty_do,Launching Backend,$(COMPOSE) -f $(COMPOSE_FILE) up --build -d backend)
	@echo "$(GREEN)✨ Backend is ready at $(CYAN)http://localhost:3000$(RESET)"

# Access frontend container shell
shell-frontend:
	@$(COMPOSE) -f $(COMPOSE_FILE) exec frontend /bin/sh

# Access backend container shell
shell-backend:
	@$(COMPOSE) -f $(COMPOSE_FILE) exec backend /bin/sh

####### DEVELOPMENT UTILS #######

# Remove node_modules from both frontend and backend
clean-node:
	$(call pretty_do,Cleaning node_modules,rm -rf frontend/node_modules backend/node_modules && rm -f frontend/package-lock.json backend/package-lock.json)

# Clean and reinstall all dependencies
install: clean-node
	$(call pretty_do,Installing dependencies,cd frontend && npm install && cd ../backend && npm install)

# Full rebuild without cache
rebuild: ascii
	$(call pretty_do,Clean rebuild,$(COMPOSE) -f $(COMPOSE_FILE) down && docker system prune -af && $(COMPOSE) -f $(COMPOSE_FILE) up --build -d)

# Show complete system status
status: ascii
	@echo "$(BLUE)=== CONTAINERS ===$(RESET)"
	@docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
	@echo ""
	@echo "$(BLUE)=== VOLUMES ===$(RESET)"
	@docker volume ls
	@echo ""
	@echo "$(BLUE)=== NETWORKS ===$(RESET)"
	@docker network ls

# Show Docker resource usage
resources:
	@docker stats --no-stream

# Health check for all services
health: ascii
	@echo "$(BLUE)Checking services...$(RESET)\n"
	@echo "$(CYAN)Frontend (5173):$(RESET)"
	@curl -s http://localhost:5173 > /dev/null && echo "$(GREEN)✔ Responding$(RESET)" || echo "$(RED)✖ Not responding$(RESET)"
	@echo ""
	@echo "$(CYAN)Backend (3000):$(RESET)"
	@curl -s http://localhost:3000/health | jq . 2>/dev/null && echo "$(GREEN)✔ Healthy$(RESET)" || echo "$(RED)✖ Not responding$(RESET)"

# Initial setup verification
setup: ascii
	$(call pretty_do,Verifying Docker,docker --version)
	$(call pretty_do,Verifying Docker Compose,docker-compose --version)
	$(call pretty_do,Creating directory structure,mkdir -p frontend/src/{components,pages,services,types} backend/src/{routes,controllers,middleware,services,types})
	@echo "$(GREEN)✔ Setup completed$(RESET)"

# Lint frontend TypeScript
lint-frontend:
	@echo "$(YELLOW)Checking TypeScript types (Frontend)...$(RESET)"
	@cd frontend && npm run build 2>&1 | head -20

# Lint backend TypeScript
lint-backend:
	@echo "$(YELLOW)Checking TypeScript types (Backend)...$(RESET)"
	@cd backend && npm run build 2>&1 | head -20

####### USEFUL ALIASES #######

# Restart containers
restart: down up

# Quick health check alias
test: health

# Show status alias
info: status

# Clean alias (shorter command)
clean: clean-node