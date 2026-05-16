module.exports = (_request, response) => {
  const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

  if (!stripePublicKey) {
    response.status(500).json({ message: 'Missing STRIPE_PUBLIC_KEY environment variable.' });
    return;
  }

  response.status(200).json({ stripePublicKey });
};
