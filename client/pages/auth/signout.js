import React, { useEffect } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

export default () => {
    const { doRequest } = useRequest({
        url: '/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: async data => await Router.push('/')
    });

    useEffect( () => {
        doRequest();
        // await Router.push('/')
    }, []);

    return <div>Signing you out...</div>
}
