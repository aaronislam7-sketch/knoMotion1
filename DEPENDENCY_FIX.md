# Remotion Dependency Version Mismatch Fix

## Problem

The error `err-aborted-504 (outdated optimize dep)` occurs when:
1. **Version mismatch**: `remotion` and `@remotion/player` are at `^4.0.136` while other `@remotion/*` packages are at `^4.0.373`
2. **Stale Vite cache**: Vite's dependency pre-bundling cache is outdated
3. **Dependency resolution conflicts**: Different versions cause module resolution issues

## Root Cause

The refactor didn't change dependencies, but the version mismatch was likely pre-existing. When you upgraded `@remotion/google-fonts-noto`, it pulled in `4.0.373` while core packages remained at `4.0.136`, creating a conflict.

## Solutions (in order of preference)

### Solution 1: Align All Remotion Versions (RECOMMENDED)

Update `package.json` to use consistent versions:

```json
{
  "dependencies": {
    "remotion": "^4.0.373",
    "@remotion/player": "^4.0.373",
    "@remotion/fonts": "^4.0.373",
    "@remotion/google-fonts": "^4.0.373",
    "@remotion/tailwind": "^4.0.373",
    "@remotion/transitions": "^4.0.373"
  }
}
```

Then run:
```bash
npm install
rm -rf node_modules/.vite
npm run dev
```

### Solution 2: Use the Fix Script

Run the provided script:
```bash
./fix-remotion-deps.sh
```

### Solution 3: Manual Fix

1. **Update package.json** (already done in this commit)
2. **Clear Vite cache**:
   ```bash
   rm -rf node_modules/.vite
   rm -rf .vite
   ```
3. **Reinstall dependencies**:
   ```bash
   npm install
   ```
4. **Restart dev server**:
   ```bash
   npm run dev
   ```

### Solution 4: Vite Config Resilience (ALREADY ADDED)

The `vite.config.js` has been updated with:
- `optimizeDeps.force: true` - Forces re-optimization
- Explicit `include` list for remotion packages
- Better cache invalidation

## Prevention

1. **Use exact versions** for remotion packages to avoid drift:
   ```json
   "remotion": "4.0.373",
   "@remotion/player": "4.0.373"
   ```

2. **Add a preinstall script** to check versions:
   ```json
   "scripts": {
     "preinstall": "node scripts/check-remotion-versions.js"
   }
   ```

3. **Use npm overrides** to force consistent versions:
   ```json
   "overrides": {
     "remotion": "^4.0.373",
     "@remotion/*": "^4.0.373"
   }
   ```

## Verification

After fixing, verify versions match:
```bash
npm list remotion @remotion/google-fonts @remotion/player
```

All should show `4.0.373` (or the same version).

## If Issues Persist

1. **Nuclear option**: Delete everything and reinstall
   ```bash
   rm -rf node_modules package-lock.json .vite
   npm install
   npm run dev
   ```

2. **Check for peer dependency warnings**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Use npm ci** for clean install:
   ```bash
   rm -rf node_modules package-lock.json
   npm ci
   ```
