# pkgcheck

**Offline `package.json` readiness lint for AI-generated manifests.**

Checks name/version/license/description/repository/engines/files/bin consistency and writes agent fix checklists.

```bash
npm install && npm run build
npx pkgcheck . --out ./pkgcheck-report --fail
```

## License

MIT
