import 'dotenv/config';
import express from 'express';
import isUrl from 'is-url';
import { 
    getSubscriptions,
    getSubscriptionByPayloadUrl,
    getSubscribedEventsBySubscriptionId,
    createSubscription,
    deleteSubscription
} from './services/subscriptionService.js';

const app = express();
app.use(express.json());

app.get("/ping", async (req, res) => {
    res.status(200).send({ message: "Ping requested successfully."})

    const subscriptions = await getSubscriptions();

    await subscriptions.map(async (subscription) => {
        const subscribedEvents = await getSubscribedEventsBySubscriptionId(subscription.id);
        console.log(subscribedEvents);
        subscribedEvents.forEach(async (subscribedEvent) => {
            try {
                await fetch(subscription.payload_url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                      },
                    body: JSON.stringify({
                        payload: {
                            event: {
                                name: subscribedEvent.name
                            }
                        }
                    })
                })
            }
            catch(error) {
                console.log(error);
            }          
        })
    })

})

app.post("/subscribe", async (req, res) => {
    const { payloadUrl, events } = req.body;
    if (!payloadUrl || !events) {
        return res.status(400).send({ message: 'Missing 1 or more required properties.' });
    };

    const urlIsValid = isUrl(payloadUrl);
    if (!urlIsValid) {
        return res.status(400).send({ message: 'The URL you provided does not seem to be valid.' })
    }
    const foundSubscription = await getSubscriptionByPayloadUrl(payloadUrl);
    if (foundSubscription) {
        return res.status(409).send({ message: `A subscription with payloadUrl: ${payloadUrl} already exists.`})
    }

    await createSubscription({payloadUrl, events})
    res.status(201).send({ message: `You subscribed with URL: ${payloadUrl}` });
})

app.delete("/unsubscribe", async(req, res) => {
    const { payloadUrl } = req.body;
    if (!payloadUrl) {
        return res.status(400).send({ message: 'You need to provide a payloadUrl to delete a subscription.' })
    }
    const foundSubscription = await getSubscriptionByPayloadUrl(payloadUrl);

    if (!foundSubscription) {
        return res.status(404).send({ message: `Could not found subscription with URL: ${payloadUrl}`})
    }
    await deleteSubscription(payloadUrl);
    res.status(200).send({ message: `Subscription deleted successfully.`})
})

const PORT = Number(process.env.PORT) || 8080;

app.listen(PORT, () => console.log('Server is listening on port', PORT));