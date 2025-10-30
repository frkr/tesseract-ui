#!/bin/bash

# Vercel Environment Sync Script
# This script helps manage environment variables between local .env file and Vercel
# Uses npx vercel (no global installation required)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if npx is available
check_vercel_cli() {
    if ! command -v npx &> /dev/null; then
        echo -e "${RED}Error: npx is not available.${NC}"
        echo "Make sure Node.js and npm are installed."
        exit 1
    fi
}

# Function to check if user is logged in to Vercel
check_vercel_auth() {
    if ! echo 'y' | npx vercel whoami &> /dev/null; then
        echo -e "${RED}Error: Not logged in to Vercel.${NC}"
        echo "Run: npx vercel login"
        exit 1
    fi
}

# Function to pull environment variables from Vercel
pull_env() {
    local env="$1"
    local env_display=$(echo "$env" | tr '[:lower:]' '[:upper:]')
    
    echo -e "${BLUE}Pulling $env_display environment variables from Vercel...${NC}"
    
    check_vercel_cli
    check_vercel_auth
    
    # Pull environment variables for specified environment
    echo 'y' | npx vercel env pull "$ENV_FILE" --environment="$env"
    
    if [ $? -eq 0 ]; then
        # Remove VERCEL_OIDC_TOKEN and NODE_ENV from the pulled .env file
        if [ -f "$ENV_FILE" ]; then
            sed -i.bak '/^VERCEL_OIDC_TOKEN=/d; /^NODE_ENV=/d' "$ENV_FILE"
            rm -f "$ENV_FILE.bak"
            echo -e "${YELLOW}Note: VERCEL_OIDC_TOKEN and NODE_ENV have been filtered out and not included in .env${NC}"
        fi
        
        # Clean up literal escape sequences (\n, \r, \t) from environment variable values
        if [ -f "$ENV_FILE" ]; then
            # Remove literal \n, \r, \t from the end of quoted values and unquoted values
            sed -i.bak 's/\\n"$/"/g; s/\\r"$/"/g; s/\\t"$/"/g; s/\\n$//g; s/\\r$//g; s/\\t$//g' "$ENV_FILE"
            # Also remove any literal escape sequences in the middle of values
            sed -i.bak 's/\\n//g; s/\\r//g; s/\\t//g' "$ENV_FILE"
            rm -f "$ENV_FILE.bak"
            echo -e "${YELLOW}Note: Literal escape sequences (n, r, t) have been cleaned from environment values${NC}"
        fi
        
        echo -e "${GREEN}✓ Successfully pulled $env_display environment variables to .env${NC}"
        echo -e "${YELLOW}Note: Review the .env file and update .env.example accordingly (with masked values)${NC}"
    else
        echo -e "${RED}✗ Failed to pull environment variables${NC}"
        exit 1
    fi
}

# Function to push environment variables to Vercel
push_env() {
    local env="$1"
    local env_display=$(echo "$env" | tr '[:lower:]' '[:upper:]')
    
    echo -e "${BLUE}Pushing $env_display environment variables to Vercel...${NC}"
    
    check_vercel_cli
    check_vercel_auth
    
    if [ ! -f "$ENV_FILE" ]; then
        echo -e "${RED}Error: .env file not found at $ENV_FILE${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}This will add/update environment variables in Vercel's $env environment.${NC}"
    echo -e "${YELLOW}Reading from: $ENV_FILE${NC}"
    echo ""
    
    # Read .env file and push each variable
    while IFS= read -r line || [ -n "$line" ]; do
        # Skip empty lines and comments
        if [[ -z "$line" ]] || [[ "$line" =~ ^[[:space:]]*# ]]; then
            continue
        fi
        
        # Extract variable name and value
        if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
            var_name="${BASH_REMATCH[1]}"
            var_value="${BASH_REMATCH[2]}"
            
            # Skip VERCEL_OIDC_TOKEN and NODE_ENV
            if [[ "$var_name" == "VERCEL_OIDC_TOKEN" ]] || [[ "$var_name" == "NODE_ENV" ]]; then
                echo -e "Skipping: ${YELLOW}$var_name${NC} (ignored)"
                continue
            fi
            
            # Remove surrounding quotes if present
            var_value=$(echo "$var_value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
            
            echo -e "Pushing: ${GREEN}$var_name${NC}"
            echo -e "$var_value" | npx vercel env add "$var_name" "$env" --force
        fi
    done < "$ENV_FILE"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✓ Successfully pushed $env_display environment variables to Vercel${NC}"
    else
        echo -e "${RED}✗ Failed to push some environment variables${NC}"
        exit 1
    fi
}

# Function to display usage
usage() {
    echo "Usage: $0 {pull|push} [environment]"
    echo ""
    echo "Commands:"
    echo "  pull [env]    Pull environment variables from Vercel to .env"
    echo "                Default: development"
    echo "                Options: development, preview, production"
    echo ""
    echo "  push [env]    Push environment variables from .env to Vercel"
    echo "                Default: development"
    echo "                Options: development, preview, production"
    echo ""
    echo "Examples:"
    echo "  $0 pull                    # Pull from development (default)"
    echo "  $0 pull preview            # Pull from preview"
    echo "  $0 push                    # Push to development (default)"
    echo "  $0 push production         # Push to production"
    echo ""
    echo "Note: VERCEL_OIDC_TOKEN and NODE_ENV are automatically ignored"
    echo ""
    echo "Prerequisites:"
    echo "  - Node.js and npm installed (npx comes with npm)"
    echo "  - Logged in to Vercel (npx vercel login)"
    echo "  - Linked to a Vercel project (npx vercel link)"
}

# Main script logic
COMMAND="${1:-}"
ENVIRONMENT="${2:-development}"

case "$COMMAND" in
    pull)
        pull_env "$ENVIRONMENT"
        ;;
    push)
        push_env "$ENVIRONMENT"
        ;;
    *)
        usage
        exit 1
        ;;
esac
