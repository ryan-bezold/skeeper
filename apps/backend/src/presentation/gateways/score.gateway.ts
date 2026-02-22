import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface SubscribeToPlayerDto {
  playerId: string;
}

interface ScoreChangedEvent {
  playerId: string;
  oldScore: number;
  newScore: number;
  operation: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ScoreGateway {
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

  emitScoreChanged(event: ScoreChangedEvent) {
    this.server.to(`player:${event.playerId}`).emit('score_changed', event);
  }
}
