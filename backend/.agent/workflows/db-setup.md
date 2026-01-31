---
description: Database Migration and Seeding
---

This workflow explains how to recreate the database schema and seed it with initial data.

1. Ensure the database is running and credentials are correct in `.env`.
2. Clean and recreate the schema (WARNING: This will drop all existing tables):
// turbo
```powershell
npx ts-node src/scripts/finalmig.ts
```
3. Seed the database with initial users, departments, designations, and settings:
// turbo
```powershell
npx ts-node src/scripts/finalseed.ts
```

Note: If you only want to seed data if the `users` table is empty, you can run the seeder WITHOUT the `--force` flag. To force seed and overwrite current data, use `--force`.
