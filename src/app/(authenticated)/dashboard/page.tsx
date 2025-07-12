"use client";

import React, { useEffect, useState } from "react";
import { spaceService } from "@/services/api/space.service";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, TrendingUp, Info } from "lucide-react";
import { APP_ROUTES } from "@/lib/constants";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardStats } from "./components/DashboardStats";
import { GettingStartedTips } from "./components/GettingStartedTips";
import { GuideModal } from "./components/GuideModal";
import { PopularSpaces } from "./components/PopularSpaces";

interface Space {
  id: number;
  name: string;
  description: string;
  privacy_status: boolean;
  document_limit?: number;
  file_size_limit_kb?: number;
  api_call_limit?: number;
  created_at: string;
  updated_at: string;
  user_count?: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [spaceCount, setSpaceCount] = useState<number | null>(null);
  const [chatSessionCount, setChatSessionCount] = useState<number | null>(null);
  const [popularSpaces, setPopularSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinedSpaceIds, setJoinedSpaceIds] = useState<number[]>([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [currentGuideStep, setCurrentGuideStep] = useState(0);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("hasVisitedDashboard");
    if (!hasVisitedBefore) {
      setShowGuide(true);
      localStorage.setItem("hasVisitedDashboard", "true");
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [
          spaceCountData,
          chatSessionCountData,
          popularSpacesData,
          joinedSpacesData,
        ] = await Promise.all([
          spaceService.getCountMySpace(),
          spaceService.getCountMyChatSessions(),
          spaceService.getPopularSpaces(),
          spaceService.getYourSpaces(),
        ]);

        setSpaceCount(spaceCountData);
        setChatSessionCount(chatSessionCountData);

        const spaces = popularSpacesData.popular_spaces || [];

        setPopularSpaces(spaces);
        setJoinedSpaceIds(
          joinedSpacesData.spaces.map((space: any) => space.id)
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
        setTimeout(() => setIsDataReady(true), 100);
      }
    };

    fetchDashboardData();
  }, []);

  const handleJoinSpace = async (spaceId: number) => {
    try {
      await spaceService.joinSpace(spaceId.toString());
      setJoinedSpaceIds((prevJoinedSpaceIds) => [
        ...prevJoinedSpaceIds,
        spaceId,
      ]);
    } catch (error: any) {
      console.error("Failed to join space:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const guideSteps = [
    {
      title: "Welcome to Your Dashboard!",
      content:
        "This is your central hub where you can manage all your activities, spaces, and see what's happening.",
      icon: <Info className="h-6 w-6 text-primary" />,
    },
    {
      title: "Spaces",
      content:
        "Spaces are collaborative environments where you can chat, share documents, and work with others. Join existing spaces or create your own.",
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      title: "Chat Sessions",
      content:
        "Start conversations in spaces to collaborate with other members. All your chat sessions will be tracked here.",
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
    },
    {
      title: "Popular Spaces",
      content:
        "Discover trending spaces that might interest you. Join them directly from your dashboard.",
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
    },
  ];

  const handleNextStep = () => {
    if (currentGuideStep < guideSteps.length - 1) {
      setCurrentGuideStep(currentGuideStep + 1);
    } else {
      setShowGuide(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence>
          {showGuide && (
            <GuideModal
              isVisible={showGuide}
              onClose={() => setShowGuide(false)}
              steps={guideSteps}
              currentStep={currentGuideStep}
              onNext={handleNextStep}
            />
          )}
        </AnimatePresence>
        {spaceCount === 0 && isDataReady && (
          <GettingStartedTips onShowGuide={() => setShowGuide(true)} />
        )}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <DashboardHeader />
          <Button
            onClick={() => router.push(APP_ROUTES.SPACES.MINE)}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2 transition-all duration-300"
          >
            <Users size={18} />
            Go to My Spaces
          </Button>
        </div>
        <DashboardStats
          spaceCount={spaceCount}
          chatSessionCount={chatSessionCount}
          popularSpacesCount={popularSpaces.length}
          loading={loading}
          isDataReady={isDataReady}
          containerVariants={containerVariants}
          itemVariants={itemVariants}
        />
        <PopularSpaces
          spaces={popularSpaces}
          joinedSpaceIds={joinedSpaceIds}
          loading={loading}
          isDataReady={isDataReady}
          onJoin={handleJoinSpace}
          containerVariants={containerVariants}
          itemVariants={itemVariants}
        />
      </div>
    </div>
  );
}
