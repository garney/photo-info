import React, { useEffect, useMemo, useState } from 'react';
import Config from './config';
import PhotoUpload from './components/photo-upload/photo-upload.js';
import {Provider, Switch, Route} from 'react-router-lite';
import './app.scss';

import Dice from './dice';

function App({socket,connectionId}) {
    const [connectionDetails, setConnectionDetails] = useState({});

    useEffect(() => {
        socket.on('connected', (id) => {
            setConnectionDetails({
                id,
                status: socket.status
            })
        });
    

    }, []);

    const isUpload = useMemo(() => {
        return window.location.pathname === '/upload'
    }, [])
    return (
        <div className="app">
            <div>
                <span className="status">{connectionDetails.status}</span> with
                connection ID <span className="id">{connectionId}</span>
            </div>
            <PhotoUpload upload={isUpload} socket={socket}/>
            
            
            {/* <Dice socket={socket}/> */}
        </div>
    )
}

module.exports = App;