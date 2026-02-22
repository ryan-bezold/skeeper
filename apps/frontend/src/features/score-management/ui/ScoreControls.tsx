import { useRef, useState } from 'react';
import {
    Button,
    HStack,
    IconButton,
    NumberInput,
    NumberInputField,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    VStack,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

interface ScoreControlsProps {
    isLoading: boolean;
    onAdjust: (operation: 'increment' | 'decrement' | 'set', value: number) => void;
}

export function ScoreControls({ isLoading, onAdjust }: ScoreControlsProps) {
    const [setScoreValue, setSetScoreValue] = useState('');
    const [isSettingScore, setIsSettingScore] = useState(false);
    const [customValue, setCustomValue] = useState('');
    const [isCustomOpen, setIsCustomOpen] = useState(false);
    const setScoreInputRef = useRef<HTMLInputElement>(null);

    const handleSetScore = () => {
        const val = parseInt(setScoreValue, 10);
        if (!isNaN(val)) {
            onAdjust('set', val);
            setSetScoreValue('');
            setIsSettingScore(false);
        }
    };

    const handleCustomAdjust = (operation: 'increment' | 'decrement') => {
        const val = parseInt(customValue, 10);
        if (!isNaN(val) && val > 0) {
            onAdjust(operation, val);
            setCustomValue('');
            setIsCustomOpen(false);
        }
    };

    const cancelSetScore = () => {
        setIsSettingScore(false);
        setSetScoreValue('');
    };

    return (
        <VStack spacing={2} width="100%">
            {/* Main ±1 ±5 ±10 buttons */}
            <HStack spacing={1} justifyContent="center" flexWrap="wrap">
                {([-10, -5, -1, 1, 5, 10] as const).map((val) => (
                    <Button
                        key={val}
                        size="sm"
                        variant="outline"
                        colorScheme={val < 0 ? 'red' : 'green'}
                        minW="44px"
                        minH="44px"
                        onClick={() => onAdjust(val < 0 ? 'decrement' : 'increment', Math.abs(val))}
                        isLoading={isLoading}
                        loadingText=""
                    >
                        {val > 0 ? '+' : ''}{val}
                    </Button>
                ))}
            </HStack>

            {/* Secondary: set score + custom ± */}
            <HStack spacing={3}>
                {isSettingScore ? (
                    <HStack spacing={1}>
                        <NumberInput
                            size="sm"
                            w="88px"
                            value={setScoreValue}
                            onChange={setSetScoreValue}
                        >
                            <NumberInputField
                                ref={setScoreInputRef}
                                placeholder="Score"
                                bg="gray.700"
                                borderColor="brand.400"
                                _focus={{ borderColor: 'brand.300', boxShadow: 'none' }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSetScore();
                                    if (e.key === 'Escape') cancelSetScore();
                                }}
                                autoFocus
                            />
                        </NumberInput>
                        <IconButton
                            aria-label="Confirm set score"
                            icon={<CheckIcon />}
                            size="sm"
                            colorScheme="brand"
                            onClick={handleSetScore}
                        />
                        <IconButton
                            aria-label="Cancel"
                            icon={<CloseIcon />}
                            size="sm"
                            variant="ghost"
                            colorScheme="gray"
                            onClick={cancelSetScore}
                        />
                    </HStack>
                ) : (
                    <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="gray"
                        color="gray.400"
                        onClick={() => setIsSettingScore(true)}
                        isDisabled={isLoading}
                    >
                        Set score
                    </Button>
                )}

                <Popover
                    isOpen={isCustomOpen}
                    onClose={() => {
                        setIsCustomOpen(false);
                        setCustomValue('');
                    }}
                    placement="bottom"
                >
                    <PopoverTrigger>
                        <Button
                            size="xs"
                            variant="ghost"
                            colorScheme="gray"
                            color="gray.400"
                            onClick={() => setIsCustomOpen(true)}
                            isDisabled={isLoading}
                        >
                            Custom ±
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent bg="gray.800" borderColor="gray.600" w="160px">
                        <PopoverArrow bg="gray.800" />
                        <PopoverBody>
                            <VStack spacing={2} align="stretch">
                                <Text fontSize="xs" color="gray.400" textAlign="center">
                                    Custom amount
                                </Text>
                                <NumberInput
                                    size="sm"
                                    min={1}
                                    value={customValue}
                                    onChange={setCustomValue}
                                >
                                    <NumberInputField
                                        placeholder="Amount"
                                        bg="gray.700"
                                        borderColor="gray.600"
                                        _focus={{ borderColor: 'brand.300', boxShadow: 'none' }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleCustomAdjust('increment');
                                            if (e.key === 'Escape') {
                                                setIsCustomOpen(false);
                                                setCustomValue('');
                                            }
                                        }}
                                        autoFocus
                                    />
                                </NumberInput>
                                <HStack spacing={2} justifyContent="center">
                                    <Button
                                        size="sm"
                                        colorScheme="red"
                                        variant="outline"
                                        minW="44px"
                                        minH="44px"
                                        onClick={() => handleCustomAdjust('decrement')}
                                    >
                                        −
                                    </Button>
                                    <Button
                                        size="sm"
                                        colorScheme="green"
                                        variant="outline"
                                        minW="44px"
                                        minH="44px"
                                        onClick={() => handleCustomAdjust('increment')}
                                    >
                                        +
                                    </Button>
                                </HStack>
                            </VStack>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </HStack>
        </VStack>
    );
}
