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

**Using real photos:** add `image: '/products/rohu.jpg'` to a product and put the file in `public/products/`.
It replaces the drawn illustration everywhere.

## Not connected yet

- Checkout and payments (for example Razorpay or Cashfree)
- Login, order history and the GHY Pro Club plan
- The phone number in the footer is a placeholder
