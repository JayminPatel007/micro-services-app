import React, {useState, useEffect} from 'react';
import StripeCheckout from "react-stripe-checkout";
import useRequest from '../../hooks/use-request';
import Router from 'next/router';;

const OrderShow = ({ order, currentUser }) => {

    const [timeLift, setTimeLeft] = useState('');
    const {doRequest, errors} = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: async () => await Router.push('/orders')
    });

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000) + '');
        };
        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        }
    }, [order]);

    if (timeLift < 0) {
        return <div>
            Order Expired
        </div>
    }

    return <div>
        Time left to pay: {timeLift} seconds
        <StripeCheckout token={({id}) => doRequest({ token: id})}
                        stripeKey='pk_test_51HkvS1DGImzeQZTKCoS3tIenR0AtA60lGXowtA0lZGhEKUyXQg7n8VRgPlM1xBaEmq62wvy4MjZnBwnWSc6SQqew0093S8FARE'
                        amount={order.ticket.price * 100}
                        email={currentUser.email}
                        currency='INR'
        />
        {errors}
    </div>
};

OrderShow.getInitialProps = async (context, client, currentUser) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return {order: data}
};

export default OrderShow;
