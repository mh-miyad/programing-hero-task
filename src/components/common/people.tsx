"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebateStore } from "@/state/data";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  FiAward,
  FiCalendar,
  FiFilter,
  FiMessageSquare,
  FiSearch,
  FiStar,
  FiThumbsUp,
  FiTrendingUp,
  FiUsers,
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

export default function PeoplePage() {
  const { debates, users } = useDebateStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("most-active");

  const calculateUserStats = (userId: string) => {
    const userArguments = debates.flatMap((debate) =>
      debate.arguments.filter((arg) => arg.authorId === userId)
    );
    const totalVotes = userArguments.reduce((sum, arg) => sum + arg.votes, 0);
    const debatesParticipated = debates.filter((debate) =>
      debate.participants.some((p) => p.userId === userId)
    ).length;
    const debatesWon = debates.filter((debate) => {
      const userParticipation = debate.participants.find(
        (p) => p.userId === userId
      );
      return debate.winner === userParticipation?.side;
    }).length;

    return {
      totalVotes,
      debatesParticipated,
      argumentsPosted: userArguments.length,
      debatesWon,
      winRate:
        debatesParticipated > 0
          ? Math.round((debatesWon / debatesParticipated) * 100)
          : 0,
    };
  };

  const enrichedUsers = users
    .map((user) => ({
      ...user,
      ...calculateUserStats(user.id),
    }))
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "most-active":
          return b.debatesParticipated - a.debatesParticipated;
        case "most-voted":
          return b.totalVotes - a.totalVotes;
        case "highest-winrate":
          return b.winRate - a.winRate;
        case "newest":
          return (
            new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
          );
        default:
          return 0;
      }
    });

  const getUserBadge = (user: any) => {
    if (user.totalVotes >= 100)
      return { label: "Expert Debater", color: "bg-yellow-500", icon: FiAward };
    if (user.totalVotes >= 50)
      return { label: "Active Debater", color: "bg-primary-500", icon: FiStar };
    if (user.debatesParticipated >= 10)
      return { label: "Regular", color: "bg-blue-500", icon: FiUsers };
    return { label: "Newcomer", color: "bg-green-500", icon: FiTrendingUp };
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div className="text-center mb-8" variants={itemVariants}>
        <h1 className="text-4xl font-bold mb-4">Community Members</h1>
        <p className="text-xl  max-w-2xl mx-auto">
          Meet the passionate debaters who make our community vibrant and
          engaging
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="flex flex-col md:flex-row gap-4 mb-8"
        variants={itemVariants}
      >
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 h-4 w-4 text-secondary-400" />
          <Input
            placeholder="Search members by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 "
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48 ">
            <FiFilter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="">
            <SelectItem value="most-active">Most Active</SelectItem>
            <SelectItem value="most-voted">Most Voted</SelectItem>
            <SelectItem value="highest-winrate">Highest Win Rate</SelectItem>
            <SelectItem value="newest">Newest Members</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        variants={itemVariants}
      >
        <Card className="  shadow-lg">
          <CardContent className="p-6 text-center">
            <FiUsers className="h-8 w-8 mx-auto mb-2 " />
            <div className="text-2xl font-bold ">{users.length}</div>
            <div className="text-sm ">Total Members</div>
          </CardContent>
        </Card>
        <Card className="  shadow-lg">
          <CardContent className="p-6 text-center">
            <FiMessageSquare className="h-8 w-8 mx-auto mb-2 " />
            <div className="text-2xl font-bold ">
              {debates.reduce(
                (sum, debate) => sum + debate.arguments.length,
                0
              )}
            </div>
            <div className="text-sm ">Total Arguments</div>
          </CardContent>
        </Card>
        <Card className="  shadow-lg">
          <CardContent className="p-6 text-center">
            <FiThumbsUp className="h-8 w-8 mx-auto mb-2 " />
            <div className="text-2xl font-bold ">
              {debates.reduce((sum, debate) => sum + debate.totalVotes, 0)}
            </div>
            <div className="text-sm ">Total Votes</div>
          </CardContent>
        </Card>
        <Card className="  shadow-lg">
          <CardContent className="p-6 text-center">
            <FiTrendingUp className="h-8 w-8 mx-auto mb-2 " />
            <div className="text-2xl font-bold ">{debates.length}</div>
            <div className="text-sm ">Active Debates</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Members Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          {enrichedUsers.map((user, index) => {
            const badge = getUserBadge(user);
            const BadgeIcon = badge.icon;

            return (
              <motion.div
                key={user.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                layout
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full   shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 ring">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-2xl font-bold  ">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <motion.div
                        className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 ${badge.color} text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <BadgeIcon className="h-3 w-3" />
                        {badge.label}
                      </motion.div>
                    </div>
                    <CardTitle className="text-xl  mt-4">{user.name}</CardTitle>
                    <CardDescription className="">{user.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-primary/5 rounded-lg p-3">
                        <div className="text-lg font-bold text-primary-700">
                          {user.debatesParticipated}
                        </div>
                        <div className="text-xs ">Debates</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 dark:bg-green-600/10">
                        <div className="text-lg font-bold text-green-700">
                          {user.totalVotes}
                        </div>
                        <div className="text-xs text-green-600">Votes</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-blue-50 rounded-lg p-3 dark:bg-blue-500/10">
                        <div className="text-lg font-bold text-blue-700">
                          {user.argumentsPosted}
                        </div>
                        <div className="text-xs text-blue-600">Arguments</div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-3 dark:bg-yellow-600/10">
                        <div className="text-lg font-bold text-yellow-700">
                          {user.winRate}%
                        </div>
                        <div className="text-xs text-yellow-600">Win Rate</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text py-2 border-t border">
                      <FiCalendar className="h-4 w-4" />
                      <span className="">
                        Joined {new Date(user.joinedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full  text-primary-700 hover:bg-primary-50 bg-transparent"
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {enrichedUsers.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FiUsers className="h-16 w-16 mx-auto text-secondary-400 mb-4" />
          <h3 className="text-xl font-semibold text-secondary-700 mb-2">
            No members found
          </h3>
          <p className="text">
            Try adjusting your search to find more community members
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
