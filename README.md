## Required setup
- Have Postman ready or another way to make a POST request
- An endpoint that can receive POST requests


## Subscribing to webhooks
Make a post request to ```https://05a-expose-webhook-system.vercel.app/subscribe```

with the following body

```
{
    "payloadUrl": "<your endpoint>",
    "events": [
        "<event 1>",
        "<event 2>",
        ...
    ]
}
```
An example subscription with real event types and an example URL will be shown further below.

## The events you can subscribe to

### ```new product```
This event is triggered when a new product is added to webshop. The event contains information about the product, like name and a product description and so on.

### ```product removed```
This event is triggered when a product is removed from webshop. The difference between this and ```product discontinued``` is that the "removed" product may come back again in the future, while the discontinued product won't

### ```product updated```
This event is triggered when some information regarding a product has been changed, like for example the name, description and so on.

### ```product back in stock```
This event is triggered when a previously out of stock product comes back in stock.

### ```product out of stuck```
This event is triggered when a previously available product goes out of stock.

### ```product stock update```
This event is triggered whenever the "in stock" number changes. An example could be that 5 products were in stock and 3 were bought, so new the new stock quantity is 2.

### ```product price change```
This event is triggered when a product price has changed. A temporary discount is not considered a "product price change".

### ```product on sale```
This event is triggered when a product goes on sale. A permanent discount does not trigger this event, only temporary price reductions.

### ```product discontinued```
This event is triggered when a product is discontinued. This event won't be triggered if a product is removed from the store, only if the product itself is discontinued.

### ```new product review```
This event is triggered when a product recieves a new product review from a customer. The event contains the review itself and information about the customer who reviewed the product.


## Example subscription

### Subscription endpoint

POST request to ```https://05a-expose-webhook-system.vercel.app/subscribe```

### With body
```
{
    "payloadUrl": "https://example-endpoint.serveo.net",
    "events": [
        "new product", 
        "product discontinued"
        ]
}
```

### Result
If you don't encounter any problems, you should now be subscribed to the ```new product``` and ```product discontinued``` events. You can test if your webhook subscription is set up correctly by requesting a ping by making a ```GET``` request to the endpoint below.

### Ping
```https://05a-expose-webhook-system.vercel.app/ping```

Making a ```GET``` request to this will trigger all the events you are subscribed to, which means that you will recieve a ```POST``` request containing a payload for all of the events you are subscribed to.


### Unsubscribing all your webhooks






