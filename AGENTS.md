<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Goal
Continue building and refining the Sales Entry & Tracking module with quantity inputs, stock tracking, agent edit restrictions, delete functionality, and fix activation field access control plus attendance timezone bug.

## Constraints & Preferences
- US Central timezone must remain intact for all date/time handling
- Agent password reset via Gmail SMTP must stay working
- Admins must be able to edit punch-out location in attendance edit screen
- Do not modify or overwrite existing production data on Hostinger without backup
- SMTP via Gmail App Password for password reset emails
- Database: local XAMPP MySQL at localhost:3306, database `doortodoor_db`; production on Hostinger at `82.197.82.109`
- Dropdown values: Portals = COP/RSI/DSI; Providers = Xfinity/Quantum Fiber/AT&T/Frontier/Verizon/T-Fiber/Windstream; Activation = Pending/Active/Cancel/Chargeback; Payment = Unpaid/100% Paid/40% Paid/60% Paid/100% Chargeback/60% Chargeback
- Form must be fully mobile responsive — no overflow, cut-off text, or horizontal scroll on phones/tablets; iOS-safe font sizes (16px base on mobile)
- Activation field: ADMIN has full read/write; AGENT editable only on first entry (create), locked afterward — enforce both frontend and backend
- Attendance punch-in date must use America/Chicago timezone to prevent one-day-behind bug

## Progress
### Done
- Restored local XAMPP database from Hostinger SQL dump (`hostinger_backup.sql`)
- Synced schema with `prisma db push` — added `resetToken`/`resetTokenExpires`, quantity fields (`mobileQty`/`internetQty`/`tvQty`/`phoneQty`/`homeSecurityQty`), `saleDate` field, `ProductStock` model
- Identified root cause of data loss: `prisma migrate dev` without baseline — migration drops and recreates all tables
- Attendance edit enhancement: admins can edit punch-out location (lat/lng/address)
- Implemented full forgot/reset password flow with email via Nodemailer + Gmail SMTP
- Updated admin email in DB from `admin@doortrack.com` to `admin@consumerserves.com`
- SMTP verified working: test email sent and received successfully via Gmail
- Built Sales Entry module from scratch with role-based permissions, admin edit/search/export, full mobile responsiveness
- Fixed mobile responsiveness across all sales forms: inputs use `text-base sm:text-sm` to prevent iOS zoom, reduced section padding/spacing, compact service cards with quantity inputs using `w-16 sm:w-20 h-8 sm:h-9` and `pl-7 sm:pl-9`
- Added `saleDate` field to DB schema and all forms/API (modify sale date feature)
- Added quantity fields per service with inline input + stock fetch from `/api/stock`
- Added agent edit page (`app/agent/sales/[id]/page.tsx`) with payment status locked (read-only)
- Added agent edit button (pencil icon) on each row in agent sales list
- Added admin delete sale button (Trash2 icon) on each row with confirmation dialog
- Added `DELETE /api/sales/[id]` endpoint (admin-only)
- Backend enforcement: AGENT saves always force activationStatus→"Pending" and paymentStatus→"Unpaid"
- Replaced favicon with custom MapPin SVG in brand gradient (`app/icon.svg`), updated metadata in `layout.tsx`
- Hostinger production DB migration: added 6 columns + `product_stock` table via ALTER TABLE; fixed column naming from snake_case to camelCase to match Prisma expectations
- Pushed all commits to GitHub (`origin/master`) for Vercel auto-deploy
- Activation field access control (ADMIN edit unlocked, AGENT edit locked)
- Attendance punch-in date timezone fix (noon UTC instead of midnight UTC)
- Fixed Punch In server error: added `.nullable()` to accuracy Zod field, made geocoding non-blocking with `.catch(() => null)`
- Added pagination (20/page) + Qty column + Sell Date column to admin sales listing page
- Added Qty column + Sell Date column header to agent sales listing page

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- Used `prisma db push` for schema sync (not `migrate dev`) to avoid migration baseline issues
- Used ALTER TABLE on Hostinger (not full dump import) to add new columns without touching production data
- Prisma maps camelCase fields to camelCase MySQL columns (no snake_case conversion in this project) — Hostinger columns must match local column naming
- For AGENT PUT endpoint: keep existing `activationStatus`/`paymentStatus` unchanged (don't force Pending on every edit) — only force defaults on initial create
- For ADMIN (not just SUPER_ADMIN) enable activation/payment status editing
- Vercel needs redeploy after every push for Prisma client to sync with updated DB schema
- **Timezone fix**: noon UTC for `localMidnight()` instead of midnight UTC — guarantees no date rollover when MySQL stores the DATE value in any timezone between UTC-12 and UTC+11

## Next Steps
1. User to update MAIL_PASSWORD on Vercel environment variables with Gmail App Password
2. Test complete forgot-password → email → reset password flow end-to-end
3. Set up automated MySQL backups (mysqldump cron job) to prevent future data loss
4. Consider adding pagination to other admin listing pages (attendance, agents) if data volumes grow

## Critical Context
- EPERM error persists on `prisma generate` — Windows file-lock on `query_engine-windows.dll.node` rename. Workaround: `.\prisma-generate.ps1`
- SMTP credentials in `.env` are for Gmail with App Password (`MAIL_PASSWORD`)
- Forgot-password API always returns `{ ok: true }` regardless of whether email exists (anti-enumeration)
- MySQL must be running at `localhost:3306` for the app to start — if not, start via `Start-Process -FilePath "C:\xampp\mysql\bin\mysqld.exe" -WindowStyle Hidden`
- Hostinger DB host: `82.197.82.109`, user: `u119666576_doortodoor_db`, password: `5P=|a8lwNka`
- Vercel auto-deploys from `origin/master` — needs redeploy after every push
- `proxy.ts` is the auth middleware — whitelisted forgot/reset routes

## Relevant Files
- `prisma/schema.prisma`: User + SalesEntry (with qty fields + saleDate) + ProductStock models
- `lib/sales-constants.ts`: Portal, provider, state, activation, payment dropdown lists
- `lib/mail.ts`: Nodemailer SMTP transport + sendPasswordResetEmail()
- `lib/utils.ts`: Central timezone logic (America/Chicago, localMidnight, etc.)
- `proxy.ts`: Auth middleware — whitelisted forgot/reset routes
- `app/api/sales/route.ts`: POST (agent→Pending/Unpaid), GET (role-based filtering with date range on saleDate)
- `app/api/sales/[id]/route.ts`: PUT (admin edit, agent edit with restrictions), DELETE (admin-only)
- `app/api/sales/export/route.ts`: Admin-only Excel export via xlsx (includes quantity columns)
- `app/api/stock/route.ts`: Returns available stock per product
- `app/api/attendance/[id]/route.ts`: Accepts optional punch-out location fields
- `app/api/attendance/action/route.ts`: Punch-in/punch-out with date via localMidnight()
- `components/agent/sales-form.tsx`: Responsive agent form with quantity inputs + stock hints
- `components/admin/attendance-edit-form.tsx`: Punch-out location inputs
- `app/agent/sales/page.tsx`: Agent's own sales list with edit buttons
- `app/agent/sales/new/page.tsx`: New sale page with gradient header
- `app/agent/sales/[id]/page.tsx`: Agent edit page (payment + activation locked, quantity inputs)
- `app/admin/sales/page.tsx`: Full admin view with filters, search, Excel export, edit + delete buttons
- `app/admin/sales/[id]/page.tsx`: Admin edit page (activation/payment now editable by ADMIN, not just SUPER_ADMIN)
- `app/admin/attendance/[id]/page.tsx`: Passes location fields to client component
- `app/forgot-password/page.tsx`: Email input form with generic success message
- `app/reset-password/[token]/page.tsx`: New password form
- `app/icon.svg`: MapPin favicon in red→rose gradient
- `app/layout.tsx`: Root layout with favicon metadata
- `components/admin/admin-sidebar.tsx`: Added "Sales Entry" nav item
- `components/agent/agent-nav.tsx`: Added "Sales" bottom nav tab
- `hostinger_backup.sql`: SQL dump exported from Hostinger and imported locally
- `prisma-generate.ps1`: Script to workaround Windows EPERM on prisma generate
