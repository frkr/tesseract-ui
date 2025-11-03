#!/usr/bin/env bash

# GitHub Repository Secrets Sync Script
# This script helps manage environment secrets between local .env file and
# GitHub repository-level Secrets using the GitHub CLI (`gh`).
#
# Inspired by: vercel-env-sync.sh
#
# Requirements:
# - GitHub CLI: https://cli.github.com/
# - Logged in to GitHub via `gh auth login`
#
# Usage examples:
#   ./gh-env-sync.sh list                    # repo inferred from `git remote -v`
#   ./gh-env-sync.sh pull                    # writes template .env with secret names
#   ./gh-env-sync.sh push                    # reads from project .env and pushes
#   ./gh-env-sync.sh push-single NAME        # push exact secret
#   ./gh-env-sync.sh push-single PREFIX*     # push by prefix
#   ./gh-env-sync.sh delete NAME             # delete exact secret (confirm)
#   ./gh-env-sync.sh delete PREFIX*          # delete by prefix (confirm)
#   # You can still target another repo explicitly via: -R owner/repo
#
# Notes:
# - GitHub Secrets are encrypted and their values CANNOT be retrieved via API.
# - The pull command creates a template with secret names only (empty values).
# - This script uses repository-level Secrets (not environments/org level).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Globals (filled by parse_args)
REPO=""
ASSUME_YES=false

show_help() {
  echo "GitHub Secrets Sync"
  echo
  echo "Commands:"
  printf "  %-28s %s\n" "list" "List GitHub repository Secrets (name and updated_at)"
  printf "  %-28s %s\n" "pull" "Create template .env with secret names (values cannot be retrieved)"
  printf "  %-28s %s\n" "push" "Push secrets from .env to GitHub (create/update)"
  printf "  %-28s %s\n" "push-single NAME|PREFIX*" "Push a single secret by exact name or all by prefix"
  printf "  %-28s %s\n" "delete NAME|PREFIX*" "Delete secret(s) by exact name or prefix (with confirm)"
  echo
  echo "Options:"
  printf "  %-28s %s\n" "-R, --repo owner/repo" "Target repository (default: inferred from 'git remote -v')"
  printf "  %-28s %s\n" "-f, --file path" "Path to .env file (default: $ENV_FILE)"
  printf "  %-28s %s\n" "-y, --yes" "Assume \"yes\" for confirmations"
  printf "  %-28s %s\n" "-h, --help" "Show help"
  echo
  echo "Examples:"
  echo "  $0 list"
  echo "  $0 pull"
  echo "  $0 push"
  echo "  $0 push-single DATABASE_URL"
  echo "  $0 push-single PREFIX_*"
  echo "  $0 delete OLD_*"
  echo "  # You can still target another repo with -R owner/repo"
}

# --- Utilities ---
need_gh() {
  if ! command -v gh >/dev/null 2>&1; then
    echo -e "${RED}Error: GitHub CLI 'gh' not found. Install from https://cli.github.com/${NC}"
    exit 1
  fi
}

check_gh_auth() {
  if ! gh auth status >/dev/null 2>&1; then
    echo -e "${RED}Error: Not authenticated with GitHub CLI.${NC} Run: gh auth login"
    exit 1
  fi
}

infer_repo() {
  # 1) Use provided flag or env var
  if [[ -n "${REPO}" ]]; then
    echo "$REPO"
    return
  fi
  if [[ -n "${GH_REPO:-}" ]]; then
    echo "$GH_REPO"
    return
  fi
  # 2) Try to infer from git remote -v (preferred)
  if command -v git >/dev/null 2>&1; then
    if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
      local best_owner_repo=""
      local best_score=-1
      local prefer_host="${GH_HOST:-github.com}"

      while IFS= read -r line; do
        # Example: origin  git@github.com:owner/repo.git (fetch)
        if [[ "$line" =~ ^([[:alnum:]_.-]+)[[:space:]]+([^[:space:]]+)[[:space:]]+\((fetch|push)\)$ ]]; then
          local rname="${BASH_REMATCH[1]}"
          local url="${BASH_REMATCH[2]}"
          local dir="${BASH_REMATCH[3]}"

          # Normalize URL and extract host + owner/repo
          local rest host path owner repo owner_repo
          if [[ "$url" == *"://"* ]]; then
            rest="${url#*://}"
          else
            rest="$url"
            if [[ "$rest" =~ ^[^@]+@[^:]+: ]]; then
              rest="${rest#*@}"
              rest="${rest/:/\/}"
            fi
          fi
          # strip credentials if any
          if [[ "$rest" == *"@"* ]]; then
            rest="${rest#*@}"
          fi
          host="${rest%%/*}"
          path="${rest#*/}"
          owner="${path%%/*}"
          path="${path#*/}"
          repo="${path%%/*}"
          repo="${repo%.git}"

          if [[ -n "$host" && -n "$owner" && -n "$repo" ]]; then
            owner_repo="$owner/$repo"
            # score the candidate
            local score=0
            if [[ "$rname" == "origin" && "$dir" == "fetch" ]]; then
              score=100
            elif [[ "$rname" == "origin" && "$dir" == "push" ]]; then
              score=90
            elif [[ "$dir" == "fetch" ]]; then
              score=80
            else
              score=70
            fi
            if [[ "$host" == "$prefer_host" ]]; then
              score=$((score + 5))
            fi
            if (( score > best_score )); then
              best_score=$score
              best_owner_repo="$owner_repo"
            fi
          fi
        fi
      done < <(git remote -v | awk 'NF{print $0}' | sort -u)

      if [[ -n "$best_owner_repo" ]]; then
        echo "$best_owner_repo"
        return
      fi
    fi
  fi
  # 3) Fallback to gh repo view (works if inside a repo directory)
  if gh repo view --json nameWithOwner -q .nameWithOwner >/dev/null 2>&1; then
    gh repo view --json nameWithOwner -q .nameWithOwner
    return
  fi
  echo -e "${RED}Error: Could not determine repository. Use -R owner/repo.${NC}"
  exit 1
}

confirm() {
  local msg="$1"
  if $ASSUME_YES; then
    return 0
  fi
  read -r -p "$msg [y/N]: " ans
  case "$ans" in
    y|Y|yes|YES) return 0;;
    *) return 1;;
  esac
}

# Escape for .env output: keep one-line values
escape_env_value() {
  local v="$1"
  # Replace newlines and tabs with literal sequences for single-line .env
  v=${v//$'\n'/\\n}
  v=${v//$'\r'/}
  v=${v//$'\t'/\\t}
  # Escape existing quotes
  v=${v//"/\\"}
  printf '%s' "$v"
}

# Strip surrounding quotes from .env values
strip_quotes() {
  local v="$1"
  v="${v#\"}"; v="${v%\"}"
  v="${v#\'}"; v="${v%\'}"
  printf '%s' "$v"
}

# Read .env into arrays names[] values[] (preserves order)
# Skips comments and blank lines; ignores NODE_ENV & VERCEL_OIDC_TOKEN
read_env_file() {
  names=()
  values=()
  if [[ ! -f "$ENV_FILE" ]]; then
    echo -e "${RED}Error: .env file not found at $ENV_FILE${NC}"
    exit 1
  fi
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
    if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
      local k="${BASH_REMATCH[1]}"
      local v="${BASH_REMATCH[2]}"
      [[ "$k" == "NODE_ENV" || "$k" == "VERCEL_OIDC_TOKEN" ]] && continue
      v=$(strip_quotes "$v")
      # Remove literal \n, \r, \t from ends
      v=${v%\\n}; v=${v%\\r}; v=${v%\\t}
      names+=("$k")
      values+=("$v")
    fi
  done < "$ENV_FILE"
}

# Fetch secrets from GitHub into associative arrays gh_map_name_to_updated_at
# Note: Secret values cannot be retrieved, only names and timestamps
fetch_gh_secrets() {
  local repo="$1"
  declare -gA gh_secret_names=()
  declare -gA gh_updated_at=()
  # Use gh api and paginate, emit tsv: name<TAB>updated_at
  while IFS=$'\t' read -r n u; do
    [[ -z "$n" ]] && continue
    gh_secret_names["$n"]="1"
    gh_updated_at["$n"]="$u"
  done < <(gh api -H "Accept: application/vnd.github+json" \
       --paginate \
       -q '.secrets[] | [ .name, .updated_at ] | @tsv' \
       "/repos/${repo}/actions/secrets")
}

print_header() {
  local title="$1"
  echo -e "${BLUE}${title}${NC}"
}

# --- Commands ---
cmd_list() {
  need_gh; check_gh_auth; local repo; repo=$(infer_repo)
  print_header "Listing Secrets for $repo"
  # Show name and updated_at (values cannot be retrieved for secrets)
  {
    echo -e "NAME\tUPDATED_AT"
    gh api -H "Accept: application/vnd.github+json" \
      --paginate \
      -q '.secrets[] | "\(.name)\t\(.updated_at)"' \
      "/repos/${repo}/actions/secrets"
  }
}

cmd_pull() {
  need_gh; check_gh_auth; local repo; repo=$(infer_repo)
  print_header "Creating template .env from GitHub Secrets → $ENV_FILE"
  fetch_gh_secrets "$repo"

  # Write backup
  if [[ -f "$ENV_FILE" ]]; then
    cp "$ENV_FILE" "$ENV_FILE.bak"
    echo -e "${YELLOW}Backup created: $ENV_FILE.bak${NC}"
  fi

  # Write template file with secret names only (empty values)
  {
    echo "# Created by gh-env-sync.sh"
    echo "# WARNING: Secret values cannot be retrieved from GitHub."
    echo "# Fill in the values manually below."
    echo ""
    for k in "${!gh_secret_names[@]}"; do echo "$k"; done | sort | while read -r name; do
      # Skip secrets we intentionally ignore
      if [[ "$name" == "NODE_ENV" || "$name" == "VERCEL_OIDC_TOKEN" ]]; then
        continue
      fi
      printf '%s=""\n' "$name"
    done
  } > "$ENV_FILE"

  echo -e "${GREEN}✓ Template .env created from GitHub Secrets (${repo})${NC}"
  echo -e "${YELLOW}WARNING: Secret values cannot be retrieved. Fill in the values manually in .env${NC}"
}

cmd_push() {
  need_gh; check_gh_auth; local repo; repo=$(infer_repo)
  print_header "Pushing .env → GitHub Secrets for $repo"
  read_env_file
  local count=0
  for i in "${!names[@]}"; do
    local k="${names[$i]}"
    local v="${values[$i]}"
    echo -e "Pushing: ${GREEN}$k${NC}"
    gh secret set "$k" --repo "$repo" --body "$v" >/dev/null
    ((count++)) || true
  done
  echo -e "${GREEN}✓ Pushed $count secret(s) to $repo${NC}"
}

cmd_push_single() {
  need_gh; check_gh_auth; local repo; repo=$(infer_repo)
  local pattern="${1:-}"
  if [[ -z "$pattern" ]]; then
    echo -e "${RED}Usage: $0 push-single NAME|PREFIX* [-R owner/repo]${NC}"; exit 1
  fi
  read_env_file
  local matched=false
  for i in "${!names[@]}"; do
    local k="${names[$i]}"; local v="${values[$i]}"
    if [[ "$pattern" == *"*" ]]; then
      local prefix="${pattern%%\*}"
      if [[ "$k" == "$prefix"* ]]; then
        matched=true; echo -e "Pushing: ${GREEN}$k${NC}"; gh secret set "$k" -R "$repo" --body "$v" >/dev/null
      fi
    else
      if [[ "$k" == "$pattern" ]]; then
        matched=true; echo -e "Pushing: ${GREEN}$k${NC}"; gh secret set "$k" -R "$repo" --body "$v" >/dev/null
      fi
    fi
  done
  if ! $matched; then
    echo -e "${YELLOW}No secrets in .env matched '$pattern'${NC}"
  else
    echo -e "${GREEN}✓ Done${NC}"
  fi
}

cmd_delete() {
  need_gh; check_gh_auth; local repo; repo=$(infer_repo)
  local pattern="${1:-}"
  if [[ -z "$pattern" ]]; then
    echo -e "${RED}Usage: $0 delete NAME|PREFIX* [-R owner/repo]${NC}"; exit 1
  fi
  fetch_gh_secrets "$repo"
  declare -a targets=()
  for name in "${!gh_secret_names[@]}"; do
    if [[ "$pattern" == *"*" ]]; then
      local prefix="${pattern%%\*}"
      [[ "$name" == "$prefix"* ]] && targets+=("$name")
    else
      [[ "$name" == "$pattern" ]] && targets+=("$name")
    fi
  done
  if [[ ${#targets[@]} -eq 0 ]]; then
    echo -e "${YELLOW}No secrets matched '$pattern' on $repo${NC}"; return 0
  fi
  echo -e "${YELLOW}About to delete ${#targets[@]} secret(s) on $repo:${NC}"; printf '  %s\n' "${targets[@]}"
  if confirm "Proceed?"; then
    for n in "${targets[@]}"; do
      echo -e "Deleting: ${RED}$n${NC}"; gh secret delete "$n" -R "$repo" >/dev/null
    done
    echo -e "${GREEN}✓ Deleted ${#targets[@]} secret(s)${NC}"
  else
    echo "Aborted."
  fi
}

# --- Arg parsing ---
COMMAND=""
EXTRA_ARG=""

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      list|pull|push|push-single|delete|help|-h|--help)
        COMMAND="$1"; shift; break;;
      *) break;;
    esac
  done
  # Remainder may include extra arg for push-single/delete
  EXTRA_ARG="${1:-}"
  # now parse flags
  while [[ $# -gt 0 ]]; do
    case "$1" in
      -R|--repo)
        REPO="${2:-}"; shift 2;;
      -f|--file)
        ENV_FILE="${2:-}"; shift 2;;
      -y|--yes)
        ASSUME_YES=true; shift;;
      -h|--help)
        COMMAND="help"; shift;;
      *) shift;;
    esac
  done
}

main() {
  parse_args "$@"
  case "$COMMAND" in
    list)        cmd_list ;;
    pull)        cmd_pull ;;
    push)        cmd_push ;;
    push-single) cmd_push_single "$EXTRA_ARG" ;;
    delete)      cmd_delete "$EXTRA_ARG" ;;
    help|""|*)  show_help ;;
  esac
}

main "$@"
