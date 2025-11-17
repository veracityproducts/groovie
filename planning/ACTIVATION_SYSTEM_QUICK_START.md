# Activation System - Quick Start Guide

## For End Users

### How to Activate a Subscription

1. **Get your activation code** from Shopify purchase email
   - Format: `GROOV-XXXX-XXXX-XXXX`
   - Valid for 30 days

2. **Go to activation page**: `/activate`

3. **Enter your code** and click "Activate Code"

4. **See success message** - subscription is now active

5. **Check account page** - see your subscription details

---

## For Developers - Using the Subscription Service

### Import the Service
```typescript
import { subscriptionService } from '@/services/subscriptions';
```

### Check if User Has Groovie
```typescript
const hasGroovie = await subscriptionService.hasGroovieSubscription();
if (hasGroovie) {
  // Show premium features
}
```

### Check Specific Product
```typescript
const hasMontly = await subscriptionService.hasSubscription('groovie-monthly');
const hasAnnual = await subscriptionService.hasSubscription('groovie-annual');
```

### Get All Subscriptions
```typescript
const subs = await subscriptionService.getUserSubscriptions();
subs.forEach(sub => {
  console.log(sub.subscription_type, sub.status, sub.is_active);
});
```

### Check Expiration
```typescript
const expiry = await subscriptionService.getSubscriptionExpiryDate();
const expiringSoon = await subscriptionService.isExpiringSoon();

if (expiringSoon) {
  // Show renewal reminder
}
```

### Activate a Code
```typescript
const result = await subscriptionService.activateCode(code);
if (result.success) {
  console.log('Activated:', result.sku);
} else {
  console.error('Failed:', result.error);
}
```

---

## For Backend - Creating Activation Codes

### When User Purchases on Shopify

You need to create an activation code record:

```python
# Example: In Shopify webhook handler

from datetime import datetime, timedelta
from supabase import create_client

supabase = create_client(URL, KEY)

# Create activation code
code = supabase.table('activation_codes').insert({
    'code': f'GROOV-{generate_unique_code()}',
    'shopify_sku': 'groovie-monthly',  # or 'groovie-annual'
    'product_type': 'subscription',
    'shopify_order_id': order_id,
    'shopify_customer_id': customer_id,
    'purchaser_email': customer_email,
    'expires_at': (datetime.now() + timedelta(days=30)).isoformat(),
    'metadata': {
        'order_date': datetime.now().isoformat(),
        'customer_name': customer_name,
    }
}).execute()

# Send code to customer email
send_email(
    to=customer_email,
    subject='Your Groovie Activation Code',
    body=f'Your code: {code.data[0]["code"]}'
)
```

---

## Database - RLS Security

### What RLS Protects

✅ **User can ONLY see their own subscriptions**
```sql
-- This works (sees own subscriptions)
SELECT * FROM user_subscriptions;

-- This fails (can't filter by other user's ID)
SELECT * FROM user_subscriptions WHERE user_id = 'other-user-id';
```

✅ **Activation codes are world-readable but only backend can modify**
```sql
-- Anyone can read unused codes (to validate entry)
SELECT * FROM activation_codes WHERE activated = false;

-- Only backend (service_role) can insert/update
-- Frontend can't fake a code
```

---

## API Endpoints

### POST `/api/subscription/activate-code`
```bash
curl -X POST http://localhost:8000/api/subscription/activate-code \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"code": "GROOV-XXXX-XXXX-XXXX"}'
```

### GET `/api/subscription/subscriptions`
```bash
curl http://localhost:8000/api/subscription/subscriptions \
  -H "Authorization: Bearer <token>"
```

### GET `/api/subscription/has-subscription/{sku}`
```bash
curl http://localhost:8000/api/subscription/has-subscription/groovie-monthly \
  -H "Authorization: Bearer <token>"
```

---

## Testing

### Create a Test Code
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
  'GROOV-TEST-1234-5678',
  'groovie-monthly',
  'subscription',
  'test-order-001',
  'test-customer-001',
  'test@example.com',
  now() + interval '30 days'
);
```

### Test the Flow
1. Go to `/activate`
2. Enter: `GROOV-TEST-1234-5678`
3. Should succeed
4. Check account page
5. Should show subscription

---

## Subscription Types

### Available SKUs
- `groovie-monthly` - Monthly subscription
- `groovie-annual` - Annual subscription (better value)

### Subscription Status
- `active` - Currently active and usable
- `cancelled` - User cancelled (still active until expires_at)
- `expired` - Past expiration date

### is_active Calculation
```javascript
// A subscription is "active" if:
const isActive =
  status === 'active' AND
  (expires_at IS NULL OR expires_at > now());
```

---

## Cost Breakdown

### For Monthly ($9.99/mo)
```
Shopify Processing: ~2.9% + 30¢
Platform Fee: 10%
Groovie Revenue: ~$7/month
```

### For Annual ($99.99/yr)
```
Shopify Processing: ~$3
Platform Fee: ~$10
Groovie Revenue: ~$87/year (~$7.25/month)
```

---

## Common Questions

### Q: Can users gift codes?
**A:** Not yet. Update metadata with `is_gift: true` when creating codes.

### Q: What if code expires?
**A:** Code becomes invalid after 30 days. Customer needs to re-purchase.

### Q: Can subscription be cancelled?
**A:** Yes, update status to 'cancelled' in user_subscriptions. They can still use until expires_at.

### Q: What about chargeback prevention?
**A:** Check `metadata.payment_method_verified` in activation code.

---

## Troubleshooting

### "Invalid or expired activation code"
- ❌ Code not found
- ❌ Code already activated
- ❌ Code expired (30 days old)
- ✅ Check that code was created in activation_codes table

### "Not authenticated"
- ❌ User not logged in
- ❌ Token expired
- ✅ Check auth headers on API call

### "User can't see their subscription"
- ❌ RLS is blocking (check policy)
- ❌ Code wasn't activated (check activation_codes.activated)
- ✅ Query user_subscriptions directly with their user_id

---

## Files Reference

| File | Purpose |
|------|---------|
| `backend/src/api/subscription.py` | API endpoints |
| `frontend/groovie-client/src/services/subscriptions.ts` | Frontend service |
| `frontend/groovie-client/src/app/activate/page.tsx` | Activation page |
| `frontend/groovie-client/src/components/subscription/ActivationCodeEntry.tsx` | Code entry component |
| `planning/ACCESS_CONTROL_MIGRATION_2025.md` | Full migration details |

---

## Next Steps

1. ✅ System is live
2. ⏳ Monitor for issues (30 days)
3. 📧 Send activation codes to customers
4. 🧪 Test with real purchases
5. 📊 Track subscription metrics
6. 🗑️ Remove old code (after 30 days)
