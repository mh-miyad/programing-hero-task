"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebateStore } from "@/state/data";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useState } from "react";
import {
  FiAward,
  FiCalendar,
  FiClock,
  FiLink,
  FiMapPin,
  FiMessageSquare,
  FiStar,
  FiTarget,
  FiThumbsUp,
  FiTrendingUp,
  FiUser,
  FiUsers,
} from "react-icons/fi";
const ProfileComp = () => {
  const { user, debates } = useDebateStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || "Alex Johnson",
    email: user?.email || "alex@example.com",
    bio: "Passionate debater who loves exploring different perspectives on complex topics. Always ready for a good intellectual challenge!",
    location: "San Francisco, CA",
    website: "https://alexjohnson.dev",
    joinedAt: user?.joinedAt || "2024-01-15T10:00:00Z",
  });
  const userArguments = debates.flatMap((debate) =>
    debate.arguments.filter((arg) => arg.authorId === user?.id)
  );
  const totalVotes = userArguments.reduce((sum, arg) => sum + arg.votes, 0);
  const debatesParticipated = debates.filter((debate) =>
    debate.participants.some((p) => p.userId === user?.id)
  ).length;
  const debatesWon = debates.filter((debate) => {
    const userParticipation = debate.participants.find(
      (p) => p.userId === user?.id
    );
    return debate.winner === userParticipation?.side;
  }).length;
  const winRate =
    debatesParticipated > 0
      ? Math.round((debatesWon / debatesParticipated) * 100)
      : 0;

  const handleSave = () => {
    // In a real app, this would update the user in the database
    setIsEditing(false);
    // updateUser(editedUser) - This would be implemented when we have proper user management
  };

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || "Alex Johnson",
      email: user?.email || "alex@example.com",
      bio: "Passionate debater who loves exploring different perspectives on complex topics. Always ready for a good intellectual challenge!",
      location: "San Francisco, CA",
      website: "https://alexjohnson.dev",
      joinedAt: user?.joinedAt || "2024-01-15T10:00:00Z",
    });
    setIsEditing(false);
  };

  const getUserBadge = () => {
    if (totalVotes >= 100)
      return {
        label: "Expert Debater",
        color: "bg-yellow-500",
        icon: FiAward,
      };
    if (totalVotes >= 50)
      return { label: "Active Debater", color: "bg-rose-500", icon: FiStar };
    if (debatesParticipated >= 10)
      return { label: "Regular", color: "bg-blue-500", icon: FiUsers };
    return { label: "Newcomer", color: "bg-green-500", icon: FiTrendingUp };
  };

  const badge = getUserBadge();
  const BadgeIcon = badge.icon;

  const recentArguments = userArguments
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);
  return (
    <div>
      <motion.div
        className="container mx-auto px-4 py-8"
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Manage your profile information and track your debate performance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div className="lg:col-span-1">
            <motion.div>
              <Card className="bg-white  shadow-lg dark:bg-transparent ">
                <CardHeader className="text-center pb-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 mx-auto mb-2 ring-4 ring-rose-100 dark:ring-red-500/20 ">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl font-bold bg-rose-100 dark:bg-rose-600/5 text-rose-700">
                        {editedUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <motion.div
                      className={` ${badge.color} w-[110px] mx-auto  px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <BadgeIcon className="h-3 w-3" />
                      {badge.label}
                    </motion.div>
                  </div>
                  <CardTitle className="text-2xl  dark:text-white mt-4">
                    {editedUser.name}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-gray-300">
                    {editedUser.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-rose-50 rounded-lg p-3 dark:bg-rose-400/10">
                      <div className="text-2xl font-bold text-rose-700">
                        {debatesParticipated}
                      </div>
                      <div className="text-xs text-rose-600">Debates</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 dark:bg-green-400/10">
                      <div className="text-2xl font-bold text-green-700">
                        {totalVotes}
                      </div>
                      <div className="text-xs text-green-600">Votes</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-blue-50 rounded-lg p-3 dark:bg-blue-600/10">
                      <div className="text-2xl font-bold text-blue-700">
                        {userArguments.length}
                      </div>
                      <div className="text-xs text-blue-600">Arguments</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3 dark:bg-yellow-600/10">
                      <div className="text-2xl font-bold text-yellow-700">
                        {winRate}%
                      </div>
                      <div className="text-xs text-yellow-600">Win Rate</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500 pt-4 border-t border-rose-100">
                    <FiCalendar className="h-4 w-4" />
                    <span>
                      Joined{" "}
                      {new Date(editedUser.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6 ">
              <TabsList className="grid w-full grid-cols-2 bg-transparent border border-rose-100 dark:border-slate-700">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-white data-[state=active]:text-rose-700 dark:data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-700/5"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="data-[state=active]:bg-white data-[state=active]:text-rose-700 dark:data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-700/5"
                >
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Bio Section */}
                <div>
                  <Card className="bg-transparent border border-rose-100 shadow-lg dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 ">
                        <FiUser className="h-5 w-5 text-rose-600" />
                        About Me
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 leading-relaxed">
                        {editedUser.bio}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center gap-2 text-slate-600">
                          <FiMapPin className="h-4 w-4 text-rose-500" />
                          <span>{editedUser.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <FiLink className="h-4 w-4 text-rose-500" />
                          <a
                            href={editedUser.website}
                            className="text-rose-600 hover:text-rose-700 transition-colors"
                          >
                            {editedUser.website}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Card className="bg-transparent border border-rose-100 shadow-lg dark:border-slate-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 ">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                          Achievements
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Debates Won</span>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 dark:bg-green-600/10 text-green-700"
                          >
                            {debatesWon}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">
                            Total Votes Received
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 dark:bg-blue-600/10"
                          >
                            {totalVotes}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">
                            Arguments Posted
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-purple-100 text-purple-700 dark:bg-purple-600/10"
                          >
                            {userArguments.length}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card className="bg-transparent border border-rose dark:border-slate-700 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 ">
                          <FiTarget className="h-5 w-5 text-rose-500" />
                          Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Win Rate</span>
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-700 "
                          >
                            {winRate}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">
                            Avg. Votes per Argument
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-rose-100 text-rose-700"
                          >
                            {userArguments.length > 0
                              ? Math.round(totalVotes / userArguments.length)
                              : 0}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Active Debates</span>
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700"
                          >
                            {
                              debates.filter(
                                (d) =>
                                  d.isActive &&
                                  d.participants.some(
                                    (p) => p.userId === user?.id
                                  )
                              ).length
                            }
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <div>
                  <Card className="bg-transparent border border-rose-100 shadow-lg dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 ">
                        <FiMessageSquare className="h-5 w-5 text-rose-600" />
                        Recent Arguments
                      </CardTitle>
                      <CardDescription>
                        Your latest contributions to debates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentArguments.length > 0 ? (
                        recentArguments.map((argument, index) => {
                          const debate = debates.find((d) =>
                            d.arguments.some((a) => a.id === argument.id)
                          );
                          return (
                            <motion.div
                              key={argument.id}
                              className="border border-rose-100 rounded-lg p-4 hover:bg-rose-50/50 transition-colors"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <Badge
                                  variant={
                                    argument.side === "support"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className={
                                    argument.side === "support"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }
                                >
                                  {argument.side === "support"
                                    ? "Supporting"
                                    : "Opposing"}
                                </Badge>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                  <FiThumbsUp className="h-4 w-4" />
                                  <span>{argument.votes}</span>
                                  <FiClock className="h-4 w-4 ml-2" />
                                  <span>
                                    {new Date(
                                      argument.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <p className="text-slate-700 mb-2 line-clamp-2">
                                {argument.content}
                              </p>
                              {debate && (
                                <p className="text-sm text-slate-500">
                                  In debate:{" "}
                                  <span className="font-medium">
                                    {debate.title}
                                  </span>
                                </p>
                              )}
                            </motion.div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-slate-500">
                          <FiMessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                          <p>No arguments posted yet</p>
                          <p className="text-sm">
                            Join a debate and share your perspective!
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileComp;
