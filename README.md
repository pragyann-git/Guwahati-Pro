# GHY Pro (Guwahati Pro)

Online store for fresh fish, chicken and mutton in Guwahati. Built with React + Vite.

## Run it

    npm install
    npm run dev        # http://localhost:5173
    npm run build      # production build in dist/

## Pages

- `/`: offers carousel, "Today's catch" board, categories, favourites, under ₹250
- `/shop`: search (`?q=`), category (`?cat=fish|chicken|mutton`), cut and price filters, sorting
- `/product/:id`: weight options (250 g / 500 g / 1 kg), quantity, favourite, add to cart
- Cart drawer with free-delivery progress (free over ₹499, otherwise ₹39)

## Editing content

All products, prices, delivery areas and fees are in `src/data.js`.

**Photos:** each product shows `public/products/<product id>.jpg`, and the home page uses the scene photos in
`public/images/` (see `SCENES` in `src/data.js`). Replace a file to change the picture; if a file is missing, a drawn
illustration is shown instead. The current photos are free-licence samples from Wikimedia Commons, credited at
`/credits` (from `src/photoCredits.json`). To make your own AI-generated set, use the prompts in
[AI-IMAGE-PROMPTS.md](AI-IMAGE-PROMPTS.md), and remove a photo's credit entry once you replace it.

After adding or replacing photos, run `npm run images` to shrink them (PNG/WebP from AI tools are converted to
`.jpg`) and rebuild the phone app icons.

## Orders

Shop settings are in `SHOP` at the top of `src/data.js`: the phone number shown on the site and your **UPI ID**
(leave `upiId` empty to offer cash on delivery only). Delivery windows are in `SLOTS`.

- **Checkout** (`/checkout`) collects name, phone, address, delivery slot and notes.
- **Cash on delivery** or **Pay now by UPI**. UPI opens the customer's UPI app (GPay, PhonePe, Paytm…) with the
  amount filled in and pays straight to your UPI ID; on a computer it shows a QR code. The customer then enters the
  12-digit UPI reference so you can match it in your bank app.
- Orders are saved in a **Supabase** database by the server function `api/order.js`, which recomputes prices from
  `src/data.js` so they can't be changed from the browser.
- **`/admin`** (not linked anywhere) lists orders. Change status (new → confirmed → out for delivery → delivered)
  and mark cash or UPI as received. It refreshes every minute.

### Setting up orders (one time, about 10 minutes)

1. Create a free project at supabase.com.
2. In **SQL Editor**, paste all of `supabase/schema.sql` and run it. Then run, with your own email:
   `insert into public.admins (email) values ('you@example.com');`
3. In **Authentication → Users**, click **Add user**, enter the same email and a strong password.
   Then in **Authentication → Sign In / Providers**, turn off **Allow new users to sign up**.
4. In **Project Settings → API**, copy the Project URL, the `anon` key and the `service_role` key.
5. Add them as environment variables in Vercel (Project → Settings → Environment Variables), then redeploy:
   - `VITE_SUPABASE_URL` and `SUPABASE_URL`: the Project URL
   - `VITE_SUPABASE_ANON_KEY`: the anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: the service_role key (secret: never put it in code or share it)
6. To try it on your computer, put the same four lines in a file called `.env.local` in the project folder
   (it's ignored by git) and run `npm run dev`.

The order functions in `api/` run on Vercel (and in `npm run dev`). Netlify won't run them, so use Vercel.

## Hosting

- **Vercel (recommended):** import the GitHub repo at vercel.com/new. It detects Vite automatically; `vercel.json`
  makes page links work on refresh.
- **Netlify:** the shop pages work (`public/_redirects` handles links), but ordering needs Vercel.

## Not connected yet

- Login, order history across devices and the GHY Pro Club plan
- Customer notifications (SMS) when the order status changes
- Automatic UPI payment confirmation (you match the UPI reference by hand)
