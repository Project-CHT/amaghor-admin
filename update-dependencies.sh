#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting dependency update for amaghor-admin..."

# Check if we are in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the root of amaghor-admin."
    exit 1
fi

# 0. Remove overrides from package.json to prevent conflicts
echo "🧹 Removing overrides from package.json..."
sed -i '/"overrides": {/,/}/d' package.json
# Clean up potential trailing comma if 'overrides' was last
sed -i 'N;s/},\n}/}\n}/;P;D' package.json || true

# 1. Update core dependencies
echo "📦 Updating core dependencies (Next.js, React, Next-Auth)..."
npm install next@latest react@latest react-dom@latest next-auth@beta --legacy-peer-deps

# 2. Update devDependencies
echo "🛠️ Updating devDependencies..."
npm install -D @types/node@latest @types/react@latest @types/react-dom@latest typescript@latest eslint@latest eslint-config-next@latest --legacy-peer-deps

# 3. Update other dependencies (Radix UI and utilities)
echo "💎 Updating Radix UI and utility libraries..."
# This will update to the latest compatible versions within the specified ranges in package.json
npm update --legacy-peer-deps

# 4. Clean up and fresh install
echo "🧹 Cleaning up node_modules and package-lock.json..."
rm -rf node_modules package-lock.json
echo "📥 Re-installing all dependencies..."
npm install --legacy-peer-deps

# 5. Fix vulnerabilities
echo "🛡️ Fixing vulnerabilities..."
npm audit fix --force --legacy-peer-deps


echo "✅ Dependency update completed successfully!"
echo ""
echo "📝 Note: next-auth has been updated to v5 (beta). You may need to verify your auth configuration in 'src/middleware.ts' and auth routes."
echo "💡 To verify the build, run: npm run build"
