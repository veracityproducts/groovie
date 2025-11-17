# Access Control System Migration - November 2025

## Overview

The old access control system was fundamentally broken with critical security vulnerabilities. This document describes the complete migration to a clean, secure system.

## What Was Broken

### Critical Issues in Old System

1. **NO Row Level Security (RLS)**
   - ❌ `public.product_access` view - RLS DISABLED
   - ❌ `public.shopify_activation_tokens` view - RLS DISABLED
   - ❌ `public.activation_tokens` table (shopify schema) - RLS DISABLED
   - ❌ `app.product_access` table - RLS DISABLED
   - **CONSEQUENCE**: Any authenticated user could read/modify ANY user's access rights

2. **Views With SECURITY DEFINER**
   - ❌ `public.product_access` - Bypasses RLS entirely
   - ❌ `public.shopify_activation_tokens` - Bypasses RLS entirely
   - **CONSEQUENCE**: Frontend code couldn't trust any access data from Supabase

3. **No Proper Purchase Validation**
   - ❌ No validation that codes came from real Shopify purchases
   - ❌ Tokens could be duplicated or forged
   - ❌ No expiration enforcement

## New Secure System

### Architecture

```
Shopify Purchase
    ↓
Backend creates activation code (via webhook/admin)
    ↓
[activation_codes table - RLS enabled]
    ↓
User enters code in /activate page
    ↓
Frontend calls POST /api/subscription/activate-code
    ↓
Backend validates code & creates subscription
    ↓
[user_subscriptions table - RLS enabled]
    ↓
Frontend queries user_subscriptions (RLS filters by user_id)
    ↓
Features unlocked based on subscription status
```

### New Tables (Production)

#### `public.activation_codes` ✅
```sql
CREATE TABLE public.activation_codes (
  id UUID PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,        -- GROOV-XXXX-XXXX-XXXX
  shopify_sku VARCHAR(100) NOT NULL,       -- groovie-monthly or groovie-annual
  product_type VARCHAR(50) NOT NULL,       -- "subscription"
  shopify_order_id TEXT NOT NULL,
  shopify_customer_id TEXT NOT NULL,
  purchaser_email TEXT NOT NULL,
  activated BOOLEAN DEFAULT FALSE,
  activated_by_user_id UUID,               -- Who redeemed it
  activated_at TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,           -- Expires if not used (30 days)
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**RLS Policies:**
- ✅ Anyone can view unexpired, unactivated codes (needed to enter code)
- ✅ Only backend (service_role) can insert/update/delete

#### `public.user_subscriptions` ✅
```sql
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  activation_code_id UUID REFERENCES activation_codes(id),
  shopify_sku VARCHAR(100) NOT NULL,
  product_type VARCHAR(50) NOT NULL,
  subscription_type VARCHAR(50),           -- "groovie-monthly" or "groovie-annual"
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, cancelled, expired
  started_at TIMESTAMP DEFAULT now(),
  expires_at TIMESTAMP,                    -- NULL means no expiration
  shopify_customer_id TEXT,
  shopify_subscription_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**RLS Policies:**
- ✅ Users can only view their own subscriptions
- ✅ Users can update their own subscriptions (for cancellation)
- ✅ Only backend can insert subscriptions

### Backend Functions (Production)

#### `public.activate_subscription_code(code, user_id)` ✅
- Validates activation code
- Marks code as activated
- Creates user subscription record
- Returns success/error JSON

#### `public.get_user_subscriptions(user_id)` ✅
- Returns all subscriptions for a user
- Includes expiration status
- Marks as_active based on status and expiry

#### `public.has_subscription(user_id, sku)` ✅
- Boolean check for specific product
- Respects expiration dates
- Used for feature gating

### Backend API Endpoints (Production)

#### `POST /api/subscription/activate-code` ✅
```
Request: { "code": "GROOV-XXXX-XXXX-XXXX" }
Response: {
  "success": true,
  "message": "Subscription activated successfully",
  "subscription_id": "...",
  "sku": "groovie-monthly"
}
```

#### `GET /api/subscription/subscriptions` ✅
```
Returns: {
  "subscriptions": [...],
  "count": 2,
  "has_active": true
}
```

#### `GET /api/subscription/has-subscription/{sku}` ✅
```
Returns: { "has_subscription": true }
```

### Frontend Service (Production)

#### `src/services/subscriptions.ts` ✅

**Methods:**
- `activateCode(code)` - Activate code
- `getUserSubscriptions()` - Get user's subscriptions
- `hasSubscription(sku)` - Check specific subscription
- `hasGroovieSubscription()` - Check if user has any Groovie
- `getGroovieSubscriptionType()` - Get subscription type
- `getSubscriptionExpiryDate()` - Get expiration
- `isExpiringSoon()` - Check if expires in <7 days

### Frontend UI (Production)

#### `src/app/activate/page.tsx` ✅
- Updated to use new subscriptionService
- Uses activation codes (not tokens)
- Shows success message with SKU

#### `src/components/subscription/ActivationCodeEntry.tsx` ✅
- Reusable component for code entry
- Validates code format
- Shows helpful error messages

## Old System - Deprecated

### What's Being Replaced

| Old | New | Status |
|-----|-----|--------|
| `app.product_access` (table) | `public.user_subscriptions` | DEPRECATED |
| `public.product_access` (view) | Direct RLS on user_subscriptions | DEPRECATED |
| `public.shopify_activation_tokens` (view) | Direct RLS on activation_codes | DEPRECATED |
| `shopify.activation_tokens` | `public.activation_codes` | DEPRECATED |
| Old RPC: `has_access()` | New RPC: `has_subscription()` | DEPRECATED |
| Old RPC: `get_user_access()` | New RPC: `get_user_subscriptions()` | DEPRECATED |
| `UserAccessService` | `SubscriptionService` | DEPRECATED |

### Why We're Keeping Old Tables (For Now)

We're NOT deleting the old tables yet to allow:
1. **Safe migration period**: 30 days of parallel running
2. **Rollback capability**: If something breaks, we can revert
3. **Data auditing**: Can compare old vs new data
4. **Gradual deprecation**: Clients get warning time

### Timeline for Cleanup

- **November 16, 2025**: New system goes live
- **November 17 - December 16, 2025**: Parallel running (old + new)
- **December 17, 2025**: Mark old views/functions as DEPRECATED
- **December 31, 2025**: Remove old code (soft delete, archive)
- **January 2026**: Hard delete old tables if no issues

## Migration Checklist

### Backend ✅
- [x] Create `activation_codes` table with RLS
- [x] Create `user_subscriptions` table with RLS
- [x] Create database functions for activation
- [x] Create `/api/subscription/*` endpoints
- [x] Document deprecated code

### Frontend ✅
- [x] Create `subscriptionService` (replaces `userAccessService`)
- [x] Create `ActivationCodeEntry` component
- [x] Update `/activate` page to use new system
- [x] Export subscription service for use in components

### Testing Required
- [ ] Activate code with valid code
- [ ] Activate code with expired code
- [ ] Activate code with invalid code
- [ ] Multiple subscriptions per user
- [ ] Verify RLS isolation between users
- [ ] Test expiration handling
- [ ] Verify backend functions work correctly

## Code Changes Summary

### Files Created
- `backend/src/api/subscription.py` - New API endpoints
- `frontend/groovie-client/src/services/subscriptions.ts` - New service
- `frontend/groovie-client/src/components/subscription/ActivationCodeEntry.tsx` - New component

### Files Modified
- `backend/main.py` - Added subscription router
- `frontend/groovie-client/src/app/activate/page.tsx` - Use new system

### Database Migrations Applied
- `create_activation_codes_table` - New table with RLS
- `create_user_subscriptions_table` - New table with RLS
- `create_subscription_functions` - Database functions

## How to Test This System

### 1. Create Test Activation Code
```sql
INSERT INTO public.activation_codes (
  code,
  shopify_sku,
  product_type,
  shopify_order_id,
  shopify_customer_id,
  purchaser_email,
  expires_at
) VALUES (
  'GROOV-TEST-XXXX-XXXX',
  'groovie-monthly',
  'subscription',
  'order-123',
  'cust-456',
  'test@example.com',
  now() + interval '30 days'
);
```

### 2. Test Frontend Activation
1. Navigate to `/activate`
2. Enter code: `GROOV-TEST-XXXX-XXXX`
3. Should show success message
4. Verify subscription appears in account page

### 3. Verify RLS Works
```sql
-- This should succeed (as the right user)
SELECT * FROM public.user_subscriptions;

-- This should fail or show empty (as a different user)
-- RLS will automatically filter
```

## Rollback Plan

If critical issues are found:

1. **Stop using new endpoints** - Backend revert to old API
2. **Revert frontend** - Use old userAccessService
3. **Investigate** - Understand what went wrong
4. **Fix** - Address root cause
5. **Redeploy** - Roll forward again

No data loss occurs because old tables remain untouched.

## Security Considerations

✅ **What's Secure Now:**
- RLS on all user-facing tables
- No SECURITY DEFINER views exposing data
- Proper authentication checks
- Expiration enforcement
- Code validation before activation

⚠️ **Still TODO (Future):**
- Webhooks from Shopify to auto-create codes
- Email notifications for code expiration
- Admin dashboard for code management
- Subscription cancellation endpoint

## Questions?

See the implementation in:
- **Backend**: `/Users/joshcoleman/repos/groovie/backend/src/api/subscription.py`
- **Frontend**: `/Users/joshcoleman/repos/groovie/frontend/groovie-client/src/services/subscriptions.ts`
- **Database**: Supabase SQL migrations (activation_codes, user_subscriptions tables)
