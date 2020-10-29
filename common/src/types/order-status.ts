export enum OrderStatus {

    // When the order has been created, but the
    // ticket is trying to order is not reserved
    Created = 'created',

    // The ticket the order has been trying to reserve has already been reserved.
    // or, when user has canceled the order, or the order expires before payment.
    Canceled = 'canceled',

    // The order has successfully reserved the ticket
    AwaitingPayment = 'awaiting:payment',

    // The order has reserved the ticket and the user has
    // provided the payment successfully.
    Complete = 'complete'
}
