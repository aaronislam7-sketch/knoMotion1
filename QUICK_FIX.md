# Quick Fix for Remotion Dependency Error

## Immediate Fix

Run these commands to fix the `err-aborted-504 (outdated optimize dep)` error:

```bash
# 1. Update package.json (already done - remotion and @remotion/player now at 4.0.373)
# 2. Clear Vite cache
rm -rf node_modules/.vite .vite

# 3. Reinstall to align versions
npm install

# 4. Start dev server
npm run dev
```

## What Was Fixed

1. **Version Alignment**: Updated `remotion` and `@remotion/player` from `^4.0.136` to `^4.0.373` to match other `@remotion/*` packages
2. **Vite Config**: Added explicit `optimizeDeps.include` for remotion packages to prevent cache issues
3. **Resilience**: Vite now explicitly includes remotion packages in dependency optimization

## If Still Having Issues

```bash
# Nuclear option - full clean reinstall
rm -rf node_modules package-lock.json node_modules/.vite .vite
npm install
npm run dev
```

## Prevention

The `vite.config.js` now explicitly includes remotion packages in `optimizeDeps.include`, which helps Vite properly detect and cache these dependencies, preventing future cache mismatches.
