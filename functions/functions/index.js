import functions from 'firebase-functions'
import admin from 'firebase-admin'
import Stripe from 'stripe'
import corsLib from 'cors'

admin.initializeApp()
const db = admin.firestore()
const cors = corsLib({ origin: true })
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Create Stripe Checkout for a job (uses accepted quote price or budget)
export const createCheckoutSession = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { jobId } = req.body
      if (!jobId) return res.status(400).json({ error: 'jobId required' })
      const jobSnap = await db.collection('jobs').doc(jobId).get()
      if (!jobSnap.exists) return res.status(404).json({ error: 'Job not found' })
      const job = jobSnap.data()

      const quotesSnap = await db.collection('quotes')
        .where('jobId', '==', jobId).where('status', '==', 'accepted').get()
      const accepted = !quotesSnap.empty ? quotesSnap.docs[0].data() : null
      const amount = Math.max(100, Math.round(((accepted?.price || job.budget || 50) * 100)))

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'gbp',
            product_data: { name: `Job ${jobId} — ${job.type}` },
            unit_amount: amount
          },
          quantity: 1
        }],
        success_url: req.headers.origin + '/job/' + jobId,
        cancel_url: req.headers.origin + '/job/' + jobId,
        metadata: { jobId }
      })

      res.json({ url: session.url })
    } catch (err) {
      console.error(err); res.status(500).json({ error: 'server_error' })
    }
  })
})

// Stripe webhook → mark job as paid
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event
  try {
    event = Stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const jobId = session.metadata.jobId
    await db.collection('jobs').doc(jobId).update({ status: 'paid' })
  }
  res.json({ received: true })
})
