# Bun Migration Guide

## 🚀 Migration Steps

### 1. Install Dependencies with Bun

```bash
# Remove old lock file
rm pnpm-lock.yaml

# Install dependencies with Bun
bun install
```

### 2. Update Environment Files

If you have any `.env` files, they should work as-is with Bun.

### 3. Update CI/CD (if applicable)

Update your deployment scripts to use Bun instead of pnpm:

```yaml
# Example for GitHub Actions
- name: Install dependencies
  run: bun install

- name: Build project
  run: bun run build
```

### 4. Update Docker (if applicable)

```dockerfile
# Instead of Node
FROM oven/bun:latest

# Install dependencies
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
```

### 5. Performance Benefits You'll Get

- **2-3x faster** package installation
- **Faster startup times**
- **Lower memory usage**
- **Built-in TypeScript support**
- **Native bundling capabilities**

### 6. Commands Comparison

| pnpm                 | Bun                 |
| -------------------- | ------------------- |
| `pnpm install`       | `bun install`       |
| `pnpm dev`           | `bun dev`           |
| `pnpm build`         | `bun build`         |
| `pnpm add <package>` | `bun add <package>` |
| `pnpm run <script>`  | `bun run <script>`  |
| `npx <command>`      | `bunx <command>`    |

### 7. Migration Checklist

- [ ] Remove pnpm-lock.yaml
- [ ] Run `bun install`
- [ ] Test `bun dev`
- [ ] Test `bun build`
- [ ] Update CI/CD pipelines
- [ ] Update Docker files (if applicable)
- [ ] Update team documentation

### 8. Potential Issues & Solutions

#### Issue: Husky hooks not working

```bash
# Reinstall husky with Bun
bun run prepare
```

#### Issue: Some packages don't work

Most npm packages work with Bun, but if you encounter issues:

```bash
# Force use of npm for specific packages
bun add --backend npm <package>
```

### 9. Performance Monitoring

After migration, you should see:

- Faster `bun install` (2-3x faster than pnpm)
- Quicker development server startup
- Faster build times
- Lower memory usage

## 🎯 Next Steps

1. Run the migration commands above
2. Test all functionality
3. Update deployment configurations
4. Enjoy the speed improvements!
