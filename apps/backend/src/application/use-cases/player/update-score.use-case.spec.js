const { Player } = require('@domain/entities/player.entity');
const { ScoreHistory } = require('@domain/entities/score-history.entity');
const {
  UpdateScoreUseCase,
} = require('./update-score.use-case');

describe('UpdateScoreUseCase', () => {
  const now = new Date('2026-01-01T00:00:00.000Z');
  let playerRepository;
  let scoreHistoryRepository;
  let useCase;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(now);

    playerRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByRoomId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    scoreHistoryRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findByPlayerId: jest.fn(),
      findLatestByPlayerId: jest.fn(),
      findByRoomId: jest.fn(),
    };

    useCase = new UpdateScoreUseCase(playerRepository, scoreHistoryRepository);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('merges score history created within 10 seconds into a single entry', async () => {
    const player = createPlayer(30);
    const recentHistory = new ScoreHistory(
      'history-1',
      player.id,
      0,
      30,
      30,
      'increment',
      new Date(now.getTime() - 9_000),
    );

    playerRepository.findById.mockResolvedValue(player);
    playerRepository.update.mockImplementation(async (updatedPlayer) => updatedPlayer);
    scoreHistoryRepository.findLatestByPlayerId.mockResolvedValue(recentHistory);
    scoreHistoryRepository.update.mockImplementation(async (history) => history);

    const updatedPlayer = await useCase.execute({
      playerId: player.id,
      operation: 'increment',
      value: 5,
    });

    expect(updatedPlayer.score).toBe(35);
    expect(scoreHistoryRepository.create).not.toHaveBeenCalled();
    expect(scoreHistoryRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: recentHistory.id,
        previousScore: 0,
        newScore: 35,
        changeAmount: 35,
        changeType: 'increment',
        createdAt: recentHistory.createdAt,
      }),
    );
  });

  it('creates a new score history entry when the latest one is older than 10 seconds', async () => {
    const player = createPlayer(30);
    const staleHistory = new ScoreHistory(
      'history-1',
      player.id,
      0,
      30,
      30,
      'increment',
      new Date(now.getTime() - 10_001),
    );

    playerRepository.findById.mockResolvedValue(player);
    playerRepository.update.mockImplementation(async (updatedPlayer) => updatedPlayer);
    scoreHistoryRepository.findLatestByPlayerId.mockResolvedValue(staleHistory);
    scoreHistoryRepository.create.mockImplementation(async (history) => history);

    const updatedPlayer = await useCase.execute({
      playerId: player.id,
      operation: 'increment',
      value: 5,
    });

    expect(updatedPlayer.score).toBe(35);
    expect(scoreHistoryRepository.update).not.toHaveBeenCalled();
    expect(scoreHistoryRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        playerId: player.id,
        previousScore: 30,
        newScore: 35,
        changeAmount: 5,
        changeType: 'increment',
      }),
    );
  });
});

function createPlayer(score) {
  return new Player(
    'player-1',
    'Player 1',
    score,
    'room-1',
    new Date('2025-01-01T00:00:00.000Z'),
    new Date('2025-01-01T00:00:00.000Z'),
  );
}
