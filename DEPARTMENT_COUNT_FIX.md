# Department Employee Count Fix

## ✅ FIXED - January 21, 2026

### Problem

The employee count in the Departments module was not working (likely showing 0 or incorrect data).

**Root Cause**: 
The `Department` model has an `employee_count` field, but it was only set to `0` upon creation and never updated when employees were assigned to departments. The application was reading this stale/static value from the database column instead of calculating the actual number of employees.

**Refinement**: Even with the dynamic calculation, the field name collision (`employee_count` from DB vs `employee_count` from subquery) caused the computed value to be ignored or overwritten by the stale DB value.

---

## Solution

### File Changed: `backend/src/controllers/departmentController.ts`

Updated the `getAllDepartments` function to calculate the employee count dynamically using a SQL subquery, dealing with column collision.

**1. Alias the Subquery Result**: 
Instead of naming the calculated column `employee_count`, we name it `real_employee_count` to avoid conflict with the existing database column.

**2. Map to Response**: 
We explicitly take the `real_employee_count` value and overwrite the `employee_count` property in the JSON response.

**Code:**
```typescript
const departments = await Department.findAll({
    where,
    attributes: {
        include: [
            [
                sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM users AS user
                    WHERE
                        user.department_id = Department.id
                )`),
                'real_employee_count' // Distinct alias
            ]
        ]
    },
    // ...
});

const results = departments.map(dept => {
    const json = dept.toJSON();
    // Overwrite the stale 'employee_count' with the computed value
    // @ts-ignore
    json.employee_count = dept.getDataValue('real_employee_count');
    return json;
});

res.json(results);
```

---

## How It Works

1.  **Dynamic Calculation**: The subquery counts rows in `users` table for each department.
2.  **Conflict Resolution**: Storing it as `real_employee_count` ensures Sequelize fetches it alongside the existing `employee_count` column.
3.  **Frontend Compatibility**: The frontend still expects `employee_count`, so we map the computed value to that key before sending the response.

---

## Verification

- **Frontend**: The Departments page receives the calculated live count in `employee_count`.
- **Accuracy**: The count matches the actual number of users in the system linked to the department.

---

## Status

🟢 **RESOLVED** - Department list accurately shows live employee counts.
