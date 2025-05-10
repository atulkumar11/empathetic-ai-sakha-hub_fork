import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { UserProfileBase } from "@/types/user/base";
import { Calendar, ChevronRight, Bell, Star, Zap, CheckSquare } from "lucide-react";
import { MoodType } from '@/types/user/base';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import VoiceAnnouncer from './voice/VoiceAnnouncer';
import { speakMessage, getMotivationalMessage, fixPronunciation } from './voice/voiceUtils';

interface EnhancedDashboardHeaderProps {
  userProfile: UserProfileBase;
  formattedTime: string;
  formattedDate: string;
  onViewStudyPlan: () => void;
  currentMood?: MoodType;
  onMoodChange?: (mood: MoodType) => void;
  streakDays?: number;
  upcomingEvents?: Array<{
    title: string;
    time: string;
    type: 'exam' | 'task' | 'deadline';
  }>;
  isFirstTimeUser?: boolean;
}

const EnhancedDashboardHeader: React.FC<EnhancedDashboardHeaderProps> = ({
  userProfile,
  formattedTime,
  formattedDate,
  onViewStudyPlan,
  currentMood,
  onMoodChange,
  streakDays = 7,
  upcomingEvents = [],
  isFirstTimeUser = false
}) => {
  const [dailyProgress, setDailyProgress] = useState<number>(
    Math.floor(Math.random() * 60) + 20
  ); // Simulated progress between 20-80%
  const [previousMood, setPreviousMood] = useState<MoodType | undefined>(currentMood);
  
  useEffect(() => {
    // If mood changed, provide voice feedback
    if (currentMood && previousMood !== currentMood) {
      const moodFeedback = getMoodFeedback(currentMood);
      speakMessage(moodFeedback, { 
        enabled: true, 
        volume: 1.0, 
        pitch: 1.1, // Higher pitch for female voice
        rate: 0.95, // A bit faster for energetic delivery
        language: 'en-IN', 
        autoGreet: true, 
        muted: false 
      });
      setPreviousMood(currentMood);
    }
  }, [currentMood, previousMood]);
  
  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };
  
  const getMoodEmoji = (mood?: MoodType) => {
    if (!mood) return "😊";
    switch(mood) {
      case MoodType.Motivated: return "🚀";
      case MoodType.Focused: return "🎯";
      case MoodType.Tired: return "😴";
      case MoodType.Anxious: return "😰";
      case MoodType.Happy: return "😊";
      case MoodType.Neutral: return "😐";
      case MoodType.Stressed: return "😓";
      case MoodType.Sad: return "😢";
      default: return "😊";
    }
  };
  
  const getMoodFeedback = (mood: MoodType): string => {
    switch(mood) {
      case MoodType.Motivated:
        return `Fantastic to see you're feeling motivated, ${userProfile.name}! This is the perfect energy for tackling challenging topics. I've adjusted your study plan to include some advanced material!`;
      case MoodType.Focused:
        return `I notice you're focused today, ${userProfile.name}! Let's make the most of this wonderful concentration with some deep learning sessions!`;
      case MoodType.Tired:
        return `I understand you're feeling tired, ${userProfile.name}. No worries! Let's adjust your plan with shorter study sessions and more breaks today.`;
      case MoodType.Anxious:
        return `I see you're feeling anxious, ${userProfile.name}. Let's start with some easier review topics to build your confidence. Remember, it's completely normal to feel this way before important exams!`;
      case MoodType.Happy:
        return `You're in a great mood today, ${userProfile.name}! Let's use this amazing positive energy for some creative problem-solving exercises!`;
      case MoodType.Neutral:
        return `Thanks for sharing how you feel, ${userProfile.name}! We'll keep your regular study pace for today.`;
      case MoodType.Stressed:
        return `I understand you're feeling stressed, ${userProfile.name}. Let's adjust today's plan to include some helpful relaxation techniques between study sessions.`;
      case MoodType.Sad:
        return `I'm sorry you're feeling down today, ${userProfile.name}. Let's focus on some enjoyable review topics, and remember it's absolutely okay to take breaks when needed.`;
      default:
        return `Thanks for sharing how you're feeling today, ${userProfile.name}! I'll adjust your recommendations to match your mood.`;
    }
  };
  
  const getStudyRecommendation = () => {
    const recommendations = [
      "Focus on Physics for 2 hours today",
      "Complete 20 Biology flashcards",
      "Practice NEET mock test #3",
      "Review yesterday's Chemistry notes",
      "Take a 10-minute break every hour"
    ];
    return recommendations[Math.floor(Math.random() * recommendations.length)];
  };
  
  const moodOptions = [
    {type: MoodType.Motivated, label: "Motivated", emoji: "🚀"},
    {type: MoodType.Focused, label: "Focused", emoji: "🎯"},
    {type: MoodType.Tired, label: "Tired", emoji: "😴"},
    {type: MoodType.Anxious, label: "Anxious", emoji: "😰"},
    {type: MoodType.Happy, label: "Happy", emoji: "😊"},
    {type: MoodType.Neutral, label: "Neutral", emoji: "😐"},
    {type: MoodType.Stressed, label: "Stressed", emoji: "😓"},
    {type: MoodType.Sad, label: "Sad", emoji: "😢"}
  ];

  const navigate = useNavigate();

  // Extract pending tasks from upcoming events for voice announcer
  const pendingTasks = upcomingEvents.map(event => ({
    title: event.title,
    due: event.time
  }));
  
  // Set profile image
  const profileImage = '/lovable-uploads/d0884669-4a9b-4446-b8ba-35df0d503371.png';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40 p-4 sm:p-6 rounded-xl border border-indigo-100/50 dark:border-indigo-800/30">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
            <AvatarImage 
              src={profileImage} 
              alt={userProfile.name || "User"} 
              onError={(e) => {
                console.error("Failed to load avatar image:", e);
                const target = e.target as HTMLImageElement;
                target.src = '/lovable-uploads/d0884669-4a9b-4446-b8ba-35df0d503371.png';
              }}
            />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg">
              {userProfile.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <div className="text-sm text-muted-foreground">
              {getGreetingTime()}
            </div>
            <h1 className="text-2xl font-bold">{userProfile.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-2 sm:mt-0">
          <div className="block">
            <VoiceAnnouncer 
              userName={userProfile.name}
              mood={currentMood}
              isFirstTimeUser={isFirstTimeUser}
              pendingTasks={pendingTasks}
              examGoal="NEET"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 border-indigo-100 dark:border-indigo-800/30"
              >
                <span className="text-xl">{getMoodEmoji(currentMood)}</span>
                <span>I'm feeling {currentMood?.toLowerCase() || "great"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>How are you feeling today?</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {moodOptions.map((mood) => (
                <DropdownMenuItem 
                  key={mood.type} 
                  onClick={() => onMoodChange?.(mood.type)}
                  className="cursor-pointer"
                >
                  <span className="mr-2">{mood.emoji}</span>
                  {mood.label}
                  {currentMood === mood.type && (
                    <span className="ml-auto">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={onViewStudyPlan} className="bg-indigo-600 hover:bg-indigo-700">
            View Study Plan
          </Button>
        </div>
      </div>
      
      {/* Progress & Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Today's Progress</h3>
          <div className="mb-3">
            <div className="flex justify-between mb-1 text-sm">
              <span className="font-medium">{dailyProgress}% Completed</span>
              <span className="text-muted-foreground">{Math.ceil((100-dailyProgress)/10)} tasks left</span>
            </div>
            <Progress value={dailyProgress} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Tip: {getStudyRecommendation()}
          </p>
        </div>
        
        {/* Streak Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Study Streak</h3>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <span className="text-xl font-bold">{streakDays} days</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {Array.from({length: 7}).map((_, i) => (
              <motion.div 
                key={i}
                className={`h-2 w-full rounded-full ${i < streakDays % 7 ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Keep your streak going! Study today to maintain momentum.
          </p>
        </div>
        
        {/* Upcoming Events */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Upcoming Events</h3>
          <div className="space-y-2 mt-3">
            {upcomingEvents.map((event, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-2 bg-card hover:bg-card/80 rounded-md cursor-pointer"
                onClick={() => navigate(event.type === 'exam' ? '/dashboard/student/practice-exam' : '/dashboard/student/today')}
              >
                <div className="flex items-center gap-2">
                  {event.type === 'exam' ? <CheckSquare className="h-4 w-4 text-primary" /> : <Calendar className="h-4 w-4 text-primary" />}
                  <span className="text-sm font-medium">{event.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{event.time}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Click to view your full schedule
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboardHeader;
