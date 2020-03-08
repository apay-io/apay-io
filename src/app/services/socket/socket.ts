import {environment} from '../../../environments/environment';

export class SocketService {
  constructor(

  ) {
  }

  connect(addressIn: string) {
    const socket = new WebSocket(environment.anchorWebsocket);
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
