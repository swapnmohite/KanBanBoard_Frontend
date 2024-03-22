import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const App = () => {

    const onSuccess: credentialResponse => {
    const credential = credentialResponse.credential;
    fetch('http://localhost:8080/api/auth', { // replace with your API endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credential })
    })
        .then(response => response.json())
        .then(data => {
            // data is the response from your API
            // if your API returns a JWT token, you can find it in data.token or similar
            const token = data.token;
            console.log('Received JWT token:', token);
        })
        .catch(error => console.error('Error:', error));
}


return (
    <div className="flex justify-center items-center h-screen">
        <GoogleLogin
            shape='pill'
            theme='filled_blue'
            size='large'
            type='circle'
            logo_alignment='left'

            onSuccess={credentialResponse => {
                console.log(credentialResponse);
            }}
            onError={() => {
                console.log('Login Failed');
            }}
        />
    </div>
);
};

export default App;