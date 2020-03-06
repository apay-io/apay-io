export class SocketService {
  constructor(

  ) {
  }

  connect(addressIn: string) {
    const socket = new WebSocket('ws://192.168.10.10:8080');
    socket.onopen = () => {
      console.log('Connected');
      socket.send(
        JSON.stringify({
          event: 'events',
          data: {
            addressIn,
          },
        }),
      );
      socket.onmessage = (data) => {
        console.log(data);
      };
    };
  }
}
