import Queue from 'bull';
import { ExperationCompletePublisher} from "../events/publishers/experation-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
    orderId: string
}

const experationQueue = new Queue<Payload>('order:experation', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

experationQueue.process(async (job) => {
    new ExperationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    })
});

export { experationQueue }
