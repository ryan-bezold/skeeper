import { useEffect, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import { useWebSocketStore } from '@shared/model/websocketStore';
import { usePlayerStore } from '@entities/player/model/playerStore';
import { useNotificationStore } from '../model/notificationStore';

export function ScoreNotifications() {
    const toast = useToast();
    const lastScoreEvent = useWebSocketStore((s) => s.lastScoreEvent);
    const players = usePlayerStore((s) => s.players);
    const isMuted = useNotificationStore((s) => s.isMuted);
    const prevEventRef = useRef<typeof lastScoreEvent>(null);

    useEffect(() => {
        if (!lastScoreEvent) return;
        if (lastScoreEvent === prevEventRef.current) return;
        prevEventRef.current = lastScoreEvent;

        if (isMuted(lastScoreEvent.playerId)) return;

        const player = players.find((p) => p.id === lastScoreEvent.playerId);
        const playerName = player?.name ?? 'A player';

        toast({
            title: `${playerName}'s score updated`,
            description: `New score: ${lastScoreEvent.newScore}`,
            status: 'info',
            duration: 3000,
            isClosable: true,
            position: 'bottom-right',
        });
    }, [lastScoreEvent, players, isMuted, toast]);

    return null;
}
