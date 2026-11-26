#!/usr/bin/env bash
# Ставит дизайн-скиллы Claude Code, на которых делался этот проект.
# По умолчанию ставит в ~/.claude/skills (для всех проектов).
# С флагом --project ставит в .claude/skills этого репозитория.
#
#   bash scripts/install-skills.sh
#   bash scripts/install-skills.sh --project
#
# Нужны git и интернет. Скиллы принадлежат их авторам, лицензии в их репозиториях.
set -euo pipefail

DEST="$HOME/.claude/skills"
if [ "${1:-}" = "--project" ]; then
  DEST="$(cd "$(dirname "$0")/.." && pwd)/.claude/skills"
fi
mkdir -p "$DEST"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

clone() { git clone --depth 1 -q "https://github.com/$1.git" "$TMP/$2"; }

echo "-> emilkowalski/skill (Emil Kowalski: анимации, полировка UI)"
clone emilkowalski/skill emil
cp -R "$TMP/emil/skills/." "$DEST/"

echo "-> nextlevelbuilder/ui-ux-pro-max-skill (UI/UX Pro Max)"
clone nextlevelbuilder/ui-ux-pro-max-skill uupm
cp -R "$TMP/uupm/.claude/skills/ui-ux-pro-max" "$DEST/"

echo "-> heydamir/unslop (Unslop, CC BY 4.0, автор Damir Sokolovsky)"
clone heydamir/unslop unslop
cp -R "$TMP/unslop/skills/unslop" "$DEST/"

echo "-> Leonxlnx/taste-skill (tasteskill)"
clone Leonxlnx/taste-skill taste
cp -R "$TMP/taste/skills/taste-skill" "$DEST/"

echo "-> obra/superpowers (Superpowers: брейншторм, планы, проверка)"
clone obra/superpowers sp
cp -R "$TMP/sp/skills/." "$DEST/"

echo "Готово: $DEST"
echo "Перезапустите Claude Code, чтобы скиллы появились в списке."
