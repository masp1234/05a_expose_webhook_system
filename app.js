import express from 'express';
import { 
    getSubscriptions,
    getSubscriptionByPayloadUrl,
    createSubscription,
} from './services/subscriptionService.js';

const app = express();
app.use(express.json());

app.get("/ping", async (req, res) => {
        const subscriptions = await getSubscriptions();

        const responses = await Promise.all(subscriptions.map(async (subscription) => {
            try {
                const response =  await fetch(subscription.payload_url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                      },
                    body: JSON.stringify({
                        message: "This is a ping test"
                    })
                })
                return response
            }
            catch {
                console.log(`No host found with payload URL: ${subscription.payload_url}`)
            }         
        }))
        const filteredResponses = responses.filter((response) => response !== undefined)
        filteredResponses.length === subscriptions.length
            ? console.log('All subscribers are up.')
            : console.log(`${filteredResponses.length} out of ${subscriptions.length} subscribers are up.`);

        res.status(200).send({ message: "Ping requested successfully."});
    })
   


app.post("/subscribe", async (req, res) => {
    const { payloadUrl, events } = req.body;
    if (!payloadUrl || !events) {
        return res.status(400).send({ message: 'Missing 1 or more required properties.' });
    };
    const foundSubscription = await getSubscriptionByPayloadUrl(payloadUrl);
    if (foundSubscription) {
        return res.status(409).send({ message: `A subscription with payloadUrl: ${payloadUrl} already exists.`})
    }

    await createSubscription({payloadUrl, events})
    res.status(201).send('You are subscribed');
})

const PORT = 8080;

app.listen(PORT, () => console.log('Server is listening on port', PORT));

export default app;