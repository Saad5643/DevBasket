
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ArrowLeft, Keyboard, RefreshCw, Timer, Globe } from 'lucide-react';
import { words } from '@/lib/words';
import { cn } from '@/lib/utils';

type TestMode = 'time' | 'words';
type TimeOption = 15 | 30 | 60;
type WordsOption = 10 | 25 | 50;

const TIME_OPTIONS: TimeOption[] = [15, 30, 60];
const WORDS_OPTIONS: WordsOption[] = [10, 25, 50];

const generateWords = (count: number) => {
  const shuffled = [...words].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function TypingTestPage() {
  const [testMode, setTestMode] = useState<TestMode>('time');
  const [timeOption, setTimeOption] = useState<TimeOption>(30);
  const [wordsOption, setWordsOption] = useState<WordsOption>(25);
  
  const [wordList, setWordList] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [errorChars, setErrorChars] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeOption);
  const [testFinished, setTestFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [lineOffset, setLineOffset] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);


  const startTest = useCallback(() => {
    const wordCount = testMode === 'words' ? wordsOption : 150; 
    setWordList(generateWords(wordCount));
    setUserInput('');
    setCurrentWordIndex(0);
    setCorrectChars(0);
    setErrorChars(0);
    setStartTime(null);
    setTestFinished(false);
    setWpm(0);
    setAccuracy(0);
    setTimeLeft(timeOption);
    setLineOffset(0);
    wordRefs.current = [];
    
    if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [testMode, timeOption, wordsOption]);

  useEffect(() => {
    startTest();
  }, [startTest]);

  const finishTest = useCallback(() => {
    if (testFinished) return;
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTestFinished(true);

    const endTime = Date.now();
    const durationInMinutes = ((endTime - (startTime ?? endTime)) / 1000) / 60;
    
    if (durationInMinutes > 0) {
      const grossWpm = (correctChars / 5) / durationInMinutes;
      setWpm(Math.round(grossWpm));
      const totalChars = correctChars + errorChars;
      setAccuracy(totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100);
    }
  }, [correctChars, errorChars, startTime, testFinished]);

  useEffect(() => {
    if (startTime && !testFinished && testMode === 'time') {
      timerIntervalRef.current = setInterval(() => {
        const elapsedTimeSeconds = (Date.now() - startTime) / 1000;
        const newTimeLeft = Math.max(0, timeOption - elapsedTimeSeconds);
        setTimeLeft(newTimeLeft);
        if (newTimeLeft <= 0) {
          finishTest();
        }
      }, 100);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [startTime, testFinished, testMode, timeOption, finishTest]);

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (testFinished) return;
    if (!startTime) setStartTime(Date.now());
    
    const value = e.target.value;
    const currentWord = wordList[currentWordIndex];

    if (value.endsWith(' ')) {
      if(value.trim() === '') {
          setUserInput('');
          return;
      }
      
      const typedWord = value.trim();
      const isCorrect = typedWord === currentWord;

      if (isCorrect) {
        setCorrectChars(c => c + currentWord.length + 1); // +1 for space
      } else {
        setErrorChars(e => e + currentWord.length + 1);
      }
      
      const nextWordIndex = currentWordIndex + 1;
      
      setCurrentWordIndex(nextWordIndex);
      setUserInput('');
      
      if (testMode === 'words' && nextWordIndex === wordsOption) {
        finishTest();
      }
    } else {
      setUserInput(value);
    }
  };

  useEffect(() => {
    // This effect handles the line scrolling
    if (currentWordIndex > 0) {
      const currentWordEl = wordRefs.current[currentWordIndex];
      const prevWordEl = wordRefs.current[currentWordIndex - 1];
      if (currentWordEl && prevWordEl && currentWordEl.offsetTop > prevWordEl.offsetTop) {
        // We measure in rem. font-size is 2xl (2rem), leading-relaxed is 1.625rem line-height.
        // So a line height is roughly 2 * 1.625 = 3.25rem
        setLineOffset(prev => prev - 3.25);
      }
    }
  }, [currentWordIndex]);


  const getCharClass = (wordIdx: number, charIdx: number, char: string) => {
    if (wordIdx > currentWordIndex) {
      return 'text-muted-foreground';
    }
    if (wordIdx < currentWordIndex) {
      // Logic for already typed words
      // This part is simplified, a full implementation might need to store correctness of each word
      return 'text-primary';
    }
    // Current word
    if (charIdx < userInput.length) {
      return userInput[charIdx] === char ? 'text-foreground' : 'bg-destructive/50 rounded-sm';
    }
    return 'text-muted-foreground';
  };
  
  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
            <Button asChild variant="outline" size="sm">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Tools
                </Link>
            </Button>
        </div>

        <Card className="max-w-4xl mx-auto shadow-lg border-border/60">
            <CardHeader className="text-center">
                <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl inline-block mb-4">
                    <Keyboard className="h-8 w-8" />
                </div>
                <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Typing Test
                </CardTitle>
                <CardDescription>
                    How fast can you type? Test your speed and accuracy.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                  <ToggleGroup type="single" value={testMode} onValueChange={(v) => { if(v) { setTestMode(v as TestMode); startTest(); }}} disabled={!!startTime && !testFinished}>
                      <ToggleGroupItem value="time" aria-label="Time-based test"><Timer className="mr-2 h-4 w-4"/> Time</ToggleGroupItem>
                      <ToggleGroupItem value="words" aria-label="Word-based test"><Globe className="mr-2 h-4 w-4"/> Words</ToggleGroupItem>
                  </ToggleGroup>
                  {testMode === 'time' ? (
                      <ToggleGroup type="single" value={String(timeOption)} onValueChange={(v) => { if(v) { setTimeOption(Number(v) as TimeOption); startTest(); }}} disabled={!!startTime && !testFinished}>
                          {TIME_OPTIONS.map(t => <ToggleGroupItem key={t} value={String(t)}>{t}s</ToggleGroupItem>)}
                      </ToggleGroup>
                  ) : (
                      <ToggleGroup type="single" value={String(wordsOption)} onValueChange={(v) => { if(v) { setWordsOption(Number(v) as WordsOption); startTest(); }}} disabled={!!startTime && !testFinished}>
                          {WORDS_OPTIONS.map(w => <ToggleGroupItem key={w} value={String(w)}>{w}</ToggleGroupItem>)}
                      </ToggleGroup>
                  )}
              </div>
              
              <Card className="w-full p-6 bg-muted/50 relative">
                  {(!!startTime && !testFinished) && (
                      <div className="absolute top-4 right-4 text-2xl font-bold text-primary">
                          {testMode === 'time' ? Math.ceil(timeLeft) : `${currentWordIndex} / ${wordsOption}`}
                      </div>
                  )}

                  {testFinished ? (
                      <div className="text-center space-y-4">
                          <h3 className="text-2xl font-bold">Results</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              <div className="p-4 rounded-lg bg-background">
                                  <p className="text-sm text-muted-foreground">WPM</p>
                                  <p className="text-3xl font-bold text-primary">{wpm}</p>
                              </div>
                              <div className="p-4 rounded-lg bg-background">
                                  <p className="text-sm text-muted-foreground">Accuracy</p>
                                  <p className="text-3xl font-bold text-primary">{accuracy}%</p>
                              </div>
                              <div className="p-4 rounded-lg bg-background col-span-2 md:col-span-1">
                                  <p className="text-sm text-muted-foreground">Characters</p>
                                  <p className="text-3xl font-bold"><span className="text-green-500">{correctChars}</span>/<span className="text-red-500">{errorChars}</span></p>
                              </div>
                          </div>
                      </div>
                  ) : (
                    <>
                      <div className="text-2xl md:text-3xl leading-relaxed font-mono h-32 overflow-hidden select-none" onClick={() => inputRef.current?.focus()}>
                        <div className={cn("transition-all duration-100 ease-linear flex flex-wrap")} style={{ transform: `translateY(${lineOffset}rem)`}}>
                            {wordList.map((word, wordIdx) => (
                              <span key={wordIdx} ref={el => {wordRefs.current[wordIdx] = el;}} className="relative">
                                {wordIdx === currentWordIndex && (
                                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary animate-pulse" />
                                )}
                                {word.split('').map((char, charIdx) => (
                                  <span key={charIdx} className={getCharClass(wordIdx, charIdx, char)}>
                                    {char}
                                  </span>
                                ))}
                                <span>&nbsp;</span>
                              </span>
                            ))}
                        </div>
                      </div>
                      <input
                          ref={inputRef}
                          type="text"
                          value={userInput}
                          onChange={handleInputChange}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-default"
                          autoFocus
                          disabled={testFinished}
                      />
                    </>
                  )}
              </Card>

              <Button onClick={startTest} size="lg">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {testFinished ? 'Try Again' : 'Restart Test'}
              </Button>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
