import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  IScoreEventPublisher,
  ScoreChangedEvent,
} from '@application/ports/score-event-publisher.interface';

interface SubscribeToPlayerDto {
  playerId: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ScoreGateway implements IScoreEventPublisher, OnGatewayDisconnect {
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

  handleDisconnect(_client: Socket) {
    // Socket.io automatically removes a disconnecting client from all rooms.
  }

  emitScoreChanged(event: ScoreChangedEvent) {
    this.server.to(`player:${event.playerId}`).emit('score_changed', event);
  }
}
