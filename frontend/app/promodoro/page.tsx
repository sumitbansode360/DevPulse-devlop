'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, RotateCcw, Coffee, Target, Clock } from 'lucide-react'

// Types
type SessionType = 'pomodoro' | 'shortBreak' | 'longBreak'

interface TimerState {
  minutes: number
  seconds: number
  isRunning: boolean
  sessionType: SessionType
  completedPomodoros: number
  totalSeconds: number
  initialSeconds: number
}

// Timer configurations (in seconds)
const TIMER_CONFIG = {
  pomodoro: 25 * 60,        // 25 minutes
  shortBreak: 5 * 60,       // 5 minutes
  longBreak: 15 * 60        // 15 minutes
}

// Session info
const SESSION_INFO = {
  pomodoro: {
    label: 'Focus Time',
    description: 'Time to focus and be productive',
    icon: Target,
    color: 'bg-red-500',
    badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  },
  shortBreak: {
    label: 'Short Break',
    description: 'Take a quick break and relax',
    icon: Coffee,
    color: 'bg-green-500',
    badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
  },
  longBreak: {
    label: 'Long Break',
    description: 'Take a longer break and recharge',
    icon: Clock,
    color: 'bg-blue-500',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
  }
}

export default function PomodoroTimer() {
  const [timer, setTimer] = useState<TimerState>({
    minutes: 25,
    seconds: 0,
    isRunning: false,
    sessionType: 'pomodoro',
    completedPomodoros: 0,
    totalSeconds: TIMER_CONFIG.pomodoro,
    initialSeconds: TIMER_CONFIG.pomodoro
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio for notifications (optional)
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    const createBeepSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1)
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    }

    audioRef.current = { play: createBeepSound } as any
  }, [])

  // Timer countdown logic
  useEffect(() => {
    if (timer.isRunning && timer.totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          const newTotalSeconds = prev.totalSeconds - 1
          const minutes = Math.floor(newTotalSeconds / 60)
          const seconds = newTotalSeconds % 60

          return {
            ...prev,
            minutes,
            seconds,
            totalSeconds: newTotalSeconds
          }
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timer.isRunning, timer.totalSeconds])

  // Handle session completion
  useEffect(() => {
    if (timer.totalSeconds === 0 && timer.isRunning) {
      // Play notification sound
      try {
        audioRef.current?.play()
      } catch (e) {
        console.log('Audio notification not available')
      }

      // Handle session completion
      setTimer(prev => {
        let nextSessionType: SessionType = 'shortBreak'
        let newCompletedPomodoros = prev.completedPomodoros

        if (prev.sessionType === 'pomodoro') {
          newCompletedPomodoros += 1
          // After every 4 pomodoros, take a long break
          nextSessionType = newCompletedPomodoros % 4 === 0 ? 'longBreak' : 'shortBreak'
        } else {
          // After any break, start a new pomodoro
          nextSessionType = 'pomodoro'
        }

        const initialSeconds = TIMER_CONFIG[nextSessionType]
        
        return {
          ...prev,
          isRunning: false,
          sessionType: nextSessionType,
          completedPomodoros: newCompletedPomodoros,
          totalSeconds: initialSeconds,
          initialSeconds,
          minutes: Math.floor(initialSeconds / 60),
          seconds: initialSeconds % 60
        }
      })

      // Show browser notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        const sessionName = SESSION_INFO[timer.sessionType].label
        new Notification(`${sessionName} completed!`, {
          body: 'Time for your next session.',
          icon: '/favicon.ico'
        })
      }
    }
  }, [timer.totalSeconds, timer.isRunning, timer.sessionType])

  // Request notification permission on first load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const handleStartPause = () => {
    setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }))
  }

  const handleReset = () => {
    setTimer(prev => ({
      ...prev,
      isRunning: false,
      totalSeconds: prev.initialSeconds,
      minutes: Math.floor(prev.initialSeconds / 60),
      seconds: prev.initialSeconds % 60
    }))
  }

  const handleSessionChange = (sessionType: SessionType) => {
    const initialSeconds = TIMER_CONFIG[sessionType]
    setTimer(prev => ({
      ...prev,
      isRunning: false,
      sessionType,
      totalSeconds: initialSeconds,
      initialSeconds,
      minutes: Math.floor(initialSeconds / 60),
      seconds: initialSeconds % 60
    }))
  }

  // Calculate progress percentage
  const progressPercentage = ((timer.initialSeconds - timer.totalSeconds) / timer.initialSeconds) * 100

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const currentSession = SESSION_INFO[timer.sessionType]
  const SessionIcon = currentSession.icon

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {/* Header with Session Type */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className={`p-2 rounded-full ${currentSession.color}`}>
              <SessionIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{currentSession.label}</h1>
          </div>
          <p className="text-muted-foreground">{currentSession.description}</p>
        </div>

        {/* Main Timer Card */}
        <Card className="shadow-lg border-2">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center space-x-2 mb-4">
              {Object.entries(SESSION_INFO).map(([key, info]) => (
                <Badge
                  key={key}
                  className={`cursor-pointer transition-all ${
                    timer.sessionType === key 
                      ? info.badgeColor 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  onClick={() => handleSessionChange(key as SessionType)}
                >
                  {info.label}
                </Badge>
              ))}
            </div>
          </CardHeader>

          <CardContent className="text-center space-y-8">
            {/* Big Timer Display */}
            <div className="space-y-4">
              <div className="text-8xl md:text-9xl font-mono font-bold text-foreground tracking-tight">
                {formatTime(timer.minutes, timer.seconds)}
              </div>
              
              {/* Progress Bar */}
              <div className="w-full max-w-md mx-auto">
                <Progress 
                  value={progressPercentage} 
                  className="h-3 bg-muted"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>0:00</span>
                  <span>{formatTime(Math.floor(timer.initialSeconds / 60), timer.initialSeconds % 60)}</span>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleStartPause}
                size="lg"
                className="w-24 h-12 text-base"
              >
                {timer.isRunning ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Start
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="w-24 h-12 text-base"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Session Statistics */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {timer.completedPomodoros}
                </div>
                <div className="text-sm text-muted-foreground">
                  Completed Pomodoros
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {timer.completedPomodoros > 0 ? Math.floor(timer.completedPomodoros / 4) : 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Long Breaks Taken
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {Math.floor((timer.completedPomodoros * 25) / 60)}h {(timer.completedPomodoros * 25) % 60}m
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Focus Time
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>💡 <strong>Tip:</strong> Take short breaks between pomodoros and longer breaks every 4 sessions.</p>
          <p>🔔 Enable notifications to get alerts when sessions complete.</p>
        </div>
      </div>
    </div>
  )
}