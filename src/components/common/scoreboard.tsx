"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDebateStore } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  FiAward,
  FiCrown,
  FiMessageSquare,
  FiStar,
  FiThumbsUp,
  FiTrendingUp,
  FiTrophy,
  FiUsers,
  FiZap,
} from "react-icons/fi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const podiumVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function ScoreboardPage() {
  const { debates, users } = useDebateStore();
  const [timeFilter, setTimeFilter] = useState<
    "weekly" | "monthly" | "all-time"
  >("all-time");

  const calculateUserStats = (userId: string) => {
    const userArguments = debates.flatMap((debate) =>
      debate.arguments.filter((arg) => arg.authorId === userId)
    );
    const totalVotes = userArguments.reduce((sum, arg) => sum + arg.votes, 0);
    const debatesParticipated = debates.filter((debate) =>
      debate.participants.some((p) => p.userId === userId)
    ).length;

    return {
      totalVotes,
      debatesParticipated,
      argumentsPosted: userArguments.length,
    };
  };

  const leaderboardData = users
    .map((user) => ({
      ...user,
      ...calculateUserStats(user.id),
    }))
    .sort((a, b) => b.totalVotes - a.totalVotes);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <FiTrophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <FiAward className="h-6 w-6 text-gray-400" />;
      case 2:
        return <FiStar className="h-6 w-6 text-amber-600" />;
      default:
        return (
          <div className="h-6 w-6 rounded-full bg-secondary-200 flex items-center justify-center">
            <span className="text-sm font-bold text-secondary-600">
              #{index + 1}
            </span>
          </div>
        );
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return (
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg">
              <FiCrown className="h-3 w-3 mr-1" />
              Champion
            </Badge>
          </motion.div>
        );
      case 1:
        return (
          <Badge className="bg-gradient-to-r from-gray-300 to-gray-500 text-white">
            Runner-up
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">
            Third Place
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="text-center mb-12" variants={itemVariants}>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 bg-clip-text text-transparent">
          🏆 Hall of Fame
        </h1>
        <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
          Celebrating our most distinguished debaters and their outstanding
          contributions
        </p>
        <div className="flex justify-center gap-2 mt-6">
          {["weekly", "monthly", "all-time"].map((filter) => (
            <Button
              key={filter}
              variant={timeFilter === filter ? "default" : "outline"}
              onClick={() => setTimeFilter(filter as any)}
              size="sm"
              className={`capitalize ${
                timeFilter === filter
                  ? "bg-primary-600 text-white"
                  : "border-primary-200 text-primary-600 hover:bg-primary-50"
              }`}
            >
              {filter.replace("-", " ")}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div className="mb-16" variants={itemVariants}>
        <div className="flex justify-center items-end gap-8 mb-8">
          {leaderboardData.slice(0, 3).map((user, index) => {
            const positions = [1, 0, 2]; // Reorder for podium effect (2nd, 1st, 3rd)
            const actualIndex = positions.indexOf(index);
            const heights = ["h-32", "h-40", "h-28"];

            return (
              <motion.div
                key={user.id}
                variants={podiumVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: actualIndex * 0.2 }}
                className={`flex flex-col items-center ${
                  actualIndex === 1
                    ? "order-2"
                    : actualIndex === 0
                    ? "order-1"
                    : "order-3"
                }`}
              >
                {/* Podium Base */}
                <motion.div
                  className={`${heights[index]} w-28 bg-gradient-to-t ${
                    index === 0
                      ? "from-yellow-400 to-yellow-500 shadow-yellow-200"
                      : index === 1
                      ? "from-gray-300 to-gray-400 shadow-gray-200"
                      : "from-amber-400 to-amber-500 shadow-amber-200"
                  } rounded-t-xl mb-6 flex items-end justify-center pb-3 shadow-lg`}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-white font-bold text-xl">
                    #{index + 1}
                  </span>
                </motion.div>

                {/* User Card */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className={`w-56 ${
                      index === 0
                        ? "ring-2 ring-yellow-400 shadow-2xl"
                        : "shadow-xl"
                    } border-0 bg-white`}
                  >
                    <CardHeader className="text-center pb-4">
                      <motion.div
                        className="flex justify-center mb-4"
                        animate={index === 0 ? { rotate: [0, 10, -10, 0] } : {}}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        {getRankIcon(index)}
                      </motion.div>
                      <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 ring-primary-100">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-2xl font-bold bg-primary-100 text-primary-700">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-xl text-secondary-900">
                        {user.name}
                      </CardTitle>
                      <div className="flex justify-center mt-2">
                        {getRankBadge(index)}
                      </div>
                    </CardHeader>
                    <CardContent className="text-center space-y-4 pt-0">
                      <motion.div
                        className="flex items-center justify-center gap-2 text-lg"
                        whileHover={{ scale: 1.1 }}
                      >
                        <FiThumbsUp className="h-5 w-5 text-primary-600" />
                        <span className="font-bold text-2xl text-primary-700">
                          {user.totalVotes}
                        </span>
                        <span className="text-secondary-500">votes</span>
                      </motion.div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-primary-50 rounded-lg p-2">
                          <FiUsers className="h-4 w-4 mx-auto mb-1 text-primary-600" />
                          <div className="font-semibold text-primary-700">
                            {user.debatesParticipated}
                          </div>
                          <div className="text-xs text-primary-600">
                            Debates
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2">
                          <FiMessageSquare className="h-4 w-4 mx-auto mb-1 text-green-600" />
                          <div className="font-semibold text-green-700">
                            {user.argumentsPosted}
                          </div>
                          <div className="text-xs text-green-600">
                            Arguments
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Full Leaderboard */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200">
            <CardTitle className="flex items-center gap-2 text-2xl text-secondary-900">
              <FiTrendingUp className="h-6 w-6 text-primary-600" />
              Complete Rankings
            </CardTitle>
            <CardDescription className="text-secondary-600">
              Full leaderboard of all community members
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              <AnimatePresence>
                {leaderboardData.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.01, x: 5 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-6 transition-colors hover:bg-primary-50 ${
                      index < 3
                        ? "bg-gradient-to-r from-primary-25 to-transparent"
                        : ""
                    } ${
                      index === 0
                        ? "border-l-4 border-yellow-500"
                        : index === 1
                        ? "border-l-4 border-gray-400"
                        : index === 2
                        ? "border-l-4 border-amber-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <motion.div
                        className="flex items-center justify-center w-12"
                        whileHover={{ scale: 1.1 }}
                      >
                        {getRankIcon(index)}
                      </motion.div>
                      <Avatar className="h-14 w-14 ring-2 ring-primary-100">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="font-semibold text-lg bg-primary-100 text-primary-700">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-xl text-secondary-900">
                            {user.name}
                          </span>
                          {index < 3 && getRankBadge(index)}
                        </div>
                        <div className="text-sm text-secondary-500">
                          Member since{" "}
                          {new Date(user.joinedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 text-center">
                      <motion.div whileHover={{ scale: 1.1 }}>
                        <div className="font-bold text-2xl text-primary-700">
                          {user.totalVotes}
                        </div>
                        <div className="text-sm text-secondary-500">Votes</div>
                      </motion.div>
                      <div>
                        <div className="font-semibold text-lg text-secondary-700">
                          {user.debatesParticipated}
                        </div>
                        <div className="text-sm text-secondary-500">
                          Debates
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-lg text-secondary-700">
                          {user.argumentsPosted}
                        </div>
                        <div className="text-sm text-secondary-500">
                          Arguments
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {leaderboardData.length === 0 && (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="mb-6"
                >
                  <FiZap className="h-20 w-20 mx-auto text-secondary-400" />
                </motion.div>
                <h3 className="text-2xl font-semibold text-secondary-700 mb-2">
                  No participants yet
                </h3>
                <p className="text-secondary-500 text-lg">
                  Be the first to join a debate and claim your spot!
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
