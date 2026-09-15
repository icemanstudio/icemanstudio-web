// Site switches. Flip and push.
export const config = {
  // Set to true once STRIPE_SECRET_KEY is stored in the Cloudflare Worker. Product pages then show "Buy now".
  stripeEnabled: false,
  // Bundles only make sense with direct checkout. Show them once Stripe is live (or earlier to preview).
  showBundles: false
};
