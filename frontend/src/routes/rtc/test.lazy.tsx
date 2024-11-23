import React, { useEffect, useState } from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
import RTCClient from '@/services/rtc/client';

export const Route = createLazyFileRoute('/rtc/test')({
  component: RouteComponent,
});

function RouteComponent() {
  // Keep clients in state to prevent recreation on re-renders
  const [clients, setClients] = useState(() => {
    const initClient = new RTCClient();
    const c2 = new RTCClient(initClient.roomId)
    return [
      initClient,
      c2,
      new RTCClient(initClient.roomId),
      new RTCClient(initClient.roomId)
    ];
  });

  // Clean up clients on component unmount
  useEffect(() => {
    return () => {
      clients.forEach(client => {
        client.disconnect();
      });
    };
  }, []);

  // Set up data handlers
  useEffect(() => {
    clients.forEach((client, clientIndex) => {
      client.setOnDataChannel((data) => {
        console.info(`Client ${clientIndex + 1} received data:`, data);
      });
    });
  }, []);

  const getWebSocketStatus = (client: RTCClient) => {
    if (!client.ws) return 'Not Connected';

    switch (client.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'Connecting';
      case WebSocket.OPEN:
        return 'Connected';
      case WebSocket.CLOSING:
        return 'Closing';
      case WebSocket.CLOSED:
        return 'Closed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className='max-w-3xl m-auto p-5'>
      <div className='grid w-full grid-cols-2 grid-flow-row gap-5'>
        {clients.map((client, index) => (
          <div
            key={client.clientId}
            className='flex flex-col p-5 border border-solid border-gray-300 rounded-lg'
          >
            <h2 className='text-lg font-semibold mb-3'>Client {index + 1}</h2>
            <div>Status: {getWebSocketStatus(client)}</div>
            <div>Room ID: {client.roomId}</div>
            <div>Client ID: {client.clientId}</div>
            <div>Peers: {client.getConnectedPeers().join(', ') || 'None'}</div>
            <button
              onClick={() => {
                client.broadcast({
                  Type: 'TEST_MESSAGE',
                  Delta: { message: "with his arms outstretched" }
                });
              }}
              className='mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
            >
              Send Test Message
            </button>
            <div className='log bg-gray-100 p-2 mt-2 rounded h-48 overflow-y-auto font-mono text-xs'></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RouteComponent;