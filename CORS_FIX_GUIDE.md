# CORS Configuration Fix for Railway Deployment

## Problem
The frontend at `https://hrm.catalyr.com` cannot access the backend at `https://hrm-backend-production-b1bf.up.railway.app` due to CORS policy blocking.

## Root Cause
The backend's CORS configuration is not set to allow requests from your frontend domain.

## Solution

### Step 1: Update Railway Environment Variables

1. **Go to Railway Dashboard**: https://railway.app/
2. **Select your backend project**: `hrm-backend-production-b1bf`
3. **Navigate to Variables tab**
4. **Add/Update the following variable**:

```
CORS_ORIGIN=https://hrm.catalyr.com
```

**For multiple origins** (development + production):
```
CORS_ORIGIN=https://hrm.catalyr.com,http://localhost:8080,http://localhost:5173
```

### Step 2: Rebuild and Deploy

After adding the environment variable:
1. Railway will automatically redeploy your backend
2. Wait for the deployment to complete (usually 2-3 minutes)
3. Test your login again

### Step 3: Verify the Fix

Once deployed, check:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try logging in
4. Check the response headers - you should see:
   ```
   Access-Control-Allow-Origin: https://hrm.catalyr.com
   ```

## Code Changes Made

I've updated `backend/src/config/index.ts` to support **multiple CORS origins** separated by commas. This allows you to:
- Support both production and development environments
- Add multiple frontend domains if needed
- Easily manage allowed origins via environment variables

## Testing Locally

To test locally with the new configuration:

```bash
# In backend/.env
CORS_ORIGIN=http://localhost:8080,http://localhost:5173
```

## Common CORS Issues

### Issue: Still getting CORS errors after adding variable
**Solution**: 
- Make sure Railway has redeployed (check deployment logs)
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Verify the environment variable is set correctly in Railway dashboard

### Issue: Preflight request fails
**Solution**: 
- Ensure your backend is responding to OPTIONS requests
- Check that helmet middleware isn't blocking CORS headers

### Issue: Credentials not working
**Solution**: 
- The backend is already configured with `credentials: true`
- Make sure your frontend axios requests also include `withCredentials: true`

## Next Steps

1. ✅ Code updated to support multiple origins
2. ⏳ Add `CORS_ORIGIN` to Railway environment variables
3. ⏳ Wait for Railway to redeploy
4. ⏳ Test login from `https://hrm.catalyr.com`

## Additional Security Recommendations

For production, consider:
1. Using specific origins instead of wildcards
2. Implementing rate limiting
3. Adding request origin validation
4. Setting up proper CSP headers

---

**Status**: Ready to deploy
**Action Required**: Add CORS_ORIGIN environment variable to Railway
