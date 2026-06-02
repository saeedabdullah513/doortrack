#!/bin/bash
# ── DoorTrack — update script ──
# Run on VPS after pushing new code to GitHub:
#   bash /var/www/doortrack/deploy/update.sh

set -e   # stop on any error
cd /var/www/doortrack

echo "── Pulling latest code ──"
git pull

echo "── Installing dependencies ──"
npm install --production=false

echo "── Applying database schema changes ──"
npx prisma db push

echo "── Building app ──"
npm run build

echo "── Restarting PM2 ──"
pm2 restart doortrack

echo "── Done! ──"
pm2 status
