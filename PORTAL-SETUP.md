# Portal setup (Supabase, free)

The portal stores accounts, projects, orders, messages and reviews in **Supabase** (free plan).

## 1. Create the Supabase project
1. Go to https://supabase.com → sign in → **New project**. Name it `infusions-tech`, choose a database password (save it), pick the region closest to you → Create. Wait ~2 minutes.
2. Left menu → **SQL Editor** → **New query**. Open `supabase/schema.sql` from this project, copy ALL of it, paste, press **Run**. It should say "Success".

## 2. Copy your 3 keys
Supabase → **Project Settings → API** (or "API Keys"):
- **Project URL**  → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / publishable key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role / secret key** (click Reveal) → `SUPABASE_SERVICE_ROLE_KEY`  ⚠ secret: never post it or commit it.

## 3. Run locally
Create a file named `.env.local` in the project root (same folder as package.json):
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```
Then `npm run dev` and open http://localhost:3000/register.

## 4. Add the same 3 keys on Vercel
Vercel → your project → **Settings → Environment Variables** → add the 3 names above (all environments) → then **Deployments → ⋯ → Redeploy**.

## 5. Tell Supabase your website address
Supabase → **Authentication → URL Configuration**:
- Site URL: `https://YOUR-APP.vercel.app`
- Redirect URLs: add `https://YOUR-APP.vercel.app/**` and `http://localhost:3000/**`

## 6. Make yourself the admin
1. Register your own account on `/register`.
2. Supabase → SQL Editor → run (use your email):
```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```
3. Log out and log in again → you go to `/admin`.

## 7. Google login (optional)
1. https://console.cloud.google.com → create a project → **APIs & Services → OAuth consent screen** (External) → fill the app name/email → save.
2. **Credentials → Create credentials → OAuth client ID → Web application**.
   Authorized redirect URI: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
3. Copy the Client ID and Client secret.
4. Supabase → **Authentication → Sign In / Providers → Google** → enable, paste both → Save.

## Notes
- Customers can log in with email OR phone + password. Phone login looks up the account by phone; no SMS is used (so it is free).
- Accounts created with the form are active immediately (no email confirmation). "Forgot password" sends an email through Supabase's built-in mail, which is rate-limited on the free plan; for heavy use add your own SMTP under Authentication → SMTP.
- Free Supabase projects pause after a week with no activity; open the dashboard and press Restore if that happens.
