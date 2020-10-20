import React from 'react';
import buildClient from '../api/build-client';

const LandingPage = ({currentUser}) => {

    return currentUser ? <h1>Ypu are Signed In</h1> : <h1>You are NOT Signed In</h1>
};

LandingPage.getInitialProps = async (context) => {
    const client = buildClient(context);
    const { data } = await client.get('/api/users/currentuser');

    return data;
};

export default LandingPage;
