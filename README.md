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

Set your details in `SHOP` at the top of `src/data.js`: the **WhatsApp number** that receives orders and the phone
number shown on the site. Delivery windows are in `SLOTS`.

- **Checkout** (`/checkout`) collects name, phone, address, delivery slot and notes.
- **Cash / UPI on delivery:** WhatsApp opens with the full order filled in; the customer taps send.
- **Pay online (Razorpay):** turns on when the keys below are set. The amount is recomputed on the server from
  `src/data.js` and the payment signature is checked, so prices can't be changed from the browser.

### Turning on Razorpay (Vercel)

1. Create a Razorpay account and get **test** keys (Settings → API Keys).
2. In Vercel → Project → Settings → Environment Variables, add `VITE_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_ID` (the same
   key id) and `RAZORPAY_KEY_SECRET`, then redeploy.
3. Test with Razorpay's test UPI/cards, then switch to live keys after KYC.

The payment server functions live in `api/` and run on Vercel. On Netlify the site works, but only with
cash/UPI on delivery.

## Hosting

- **Vercel (recommended):** import the GitHub repo at vercel.com/new. It detects Vite automatically; `vercel.json`
  makes page links work on refresh.
- **Netlify:** import the repo, build command `npm run build`, publish folder `dist` (`public/_redirects` handles links).

## Not connected yet

- Login, order history across devices and the GHY Pro Club plan
- Orders are not stored on a server: WhatsApp (and Razorpay for paid orders) is the record
