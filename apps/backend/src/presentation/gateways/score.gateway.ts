import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface SubscribeToPlayerDto {
  playerId: string;
}

export interface ScoreChangedEvent {
  playerId: string;
  playerName: string;
  roomId: string;
  oldScore: number;
  newScore: number;
  changeAmount: number;
  operation: 'increment' | 'decrement' | 'set';
  timestamp: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ScoreGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('subscribe_to_player')
  handleSubscribe(
    @MessageBody() data: SubscribeToPlayerDto,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`player:${data.playerId}`);
    return { event: 'subscribed', playerId: data.playerId };
  }

  @SubscribeMessage('unsubscribe_from_player')
  handleUnsubscribe(
    @MessageBody() data: SubscribeToPlayerDto,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`player:${data.playerId}`);
    return { event: 'unsubscribed', playerId: data.playerId };
  }

  handleDisconnect(client: Socket) {
    client.rooms.forEach((room) => client.leave(room));
  }

  emitScoreChanged(event: ScoreChangedEvent) {
    this.server.to(`player:${event.playerId}`).emit('score_changed', event);
  }
}
