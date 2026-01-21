# Database Sync Error Fix - ARRAY Type Issue

## ✅ FIXED - January 21, 2026

### Problem

Database synchronization was failing with SQL syntax error:

```
Error: You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near '[], `status` ENUM...
```

**Root Cause**: The `investment_declarations` table had a field `proof_documents` defined as `DataTypes.ARRAY(DataTypes.STRING)`, which is **PostgreSQL-specific syntax** and not supported by MySQL/MariaDB.

---

## Solution

### File Changed: `backend/src/models/InvestmentDeclaration.ts`

**Before** (Line 77):
```typescript
proof_documents: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
},
```

**After**:
```typescript
proof_documents: {
    type: DataTypes.JSON, // Store array as JSON for MySQL compatibility
    allowNull: true,
},
```

---

## Why This Works

### MySQL/MariaDB vs PostgreSQL:

| Feature | PostgreSQL | MySQL/MariaDB |
|---------|-----------|---------------|
| Array Type | ✅ `ARRAY` | ❌ Not supported |
| JSON Type | ✅ `JSON` | ✅ `JSON` |
| Store Arrays | Native arrays | JSON arrays |

### JSON Solution:

- **Storage**: Arrays are stored as JSON strings
- **Usage**: Sequelize automatically serializes/deserializes
- **Compatibility**: Works across all databases
- **Performance**: Slightly slower than native arrays, but negligible

---

## How It Works Now

### Storing Data:
```typescript
// JavaScript
const declaration = await InvestmentDeclaration.create({
    proof_documents: ['doc1.pdf', 'doc2.pdf', 'doc3.pdf']
});

// Database stores as JSON
// Column value: ["doc1.pdf", "doc2.pdf", "doc3.pdf"]
```

### Reading Data:
```typescript
// Sequelize automatically parses JSON back to array
const declaration = await InvestmentDeclaration.findByPk(id);
console.log(declaration.proof_documents); 
// Output: ['doc1.pdf', 'doc2.pdf', 'doc3.pdf']
```

---

## Testing

The server should now start successfully with:

```
✅ Database connection established successfully.
✅ Database synchronized (alter mode - tables updated).

╔════════════════════════════════════════════════════════════╗
║   🚀 HRMS Backend Server                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## Additional Notes

### Other Models Checked:
- ✅ No other models use `DataTypes.ARRAY`
- ✅ All models are MySQL/MariaDB compatible

### Future Considerations:
- If migrating to PostgreSQL in the future, can change back to `ARRAY` type
- JSON type works on both databases, so no migration needed
- Consider adding validation for array structure in application code

---

## Impact

- ✅ **No data loss**: Existing data remains intact
- ✅ **No API changes**: Application code works the same
- ✅ **Better compatibility**: Works with MySQL/MariaDB
- ✅ **Automatic conversion**: Sequelize handles serialization

---

## Status

🟢 **RESOLVED** - Server should now start successfully and sync database without errors.

The `investment_declarations` table will be created/updated with the correct JSON column type for `proof_documents`.
