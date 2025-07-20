"use client";
import { useSession } from "next-auth/react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { useProfile } from "@/hooks/useProfile";
import { motion } from "framer-motion";
import { AlertTriangle, Trophy } from "lucide-react";
import {
  FiMessageSquare,
  FiThumbsUp,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const ProfileComp = () => {
  const { data: session } = useSession();
  const { data: profile, loading, error } = useProfile();

  const getUserBadge = () => {
    if (!profile)
      return { label: "Newcomer", color: "bg-green-500", icon: FiTrendingUp };
    const { totalVotes, debatesParticipated } = profile;
    if (totalVotes >= 100)
      return {
        label: "Expert Debater",
        color: "bg-yellow-500",
        icon: FiTrendingUp,
      };
    if (totalVotes >= 50)
      return {
        label: "Active Debater",
        color: "bg-rose-500",
        icon: FiThumbsUp,
      };
    if (debatesParticipated >= 10)
      return { label: "Regular", color: "bg-blue-500", icon: FiUsers };
    return { label: "Newcomer", color: "bg-green-500", icon: FiTrendingUp };
  };

  const badge = getUserBadge();
  const BadgeIcon = badge.icon;

  if (!session) {
    return (
      <motion.div
        className="container mx-auto px-4 py-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Please Sign In</AlertTitle>
          <AlertDescription>
            You must be signed in to view your profile.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div className="text-center mb-8" variants={{ itemVariants }}>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Track your debate performance and contributions
        </p>
      </motion.div>

      {/* Error and Loading States */}
      {error && (
        <motion.div variants={{ itemVariants }}>
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}
      {loading && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FiZap className="h-12 w-12 mx-auto text-blue-600 animate-spin" />
          <p className="text-gray-600 mt-4">Loading profile...</p>
        </motion.div>
      )}

      {!loading && !error && profile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div className="lg:col-span-1" variants={{ itemVariants }}>
            <Card className="bg-white shadow-lg dark:bg-gray-800">
              <CardHeader className="text-center pb-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 mx-auto mb-2 ring-4 ring-rose-100 dark:ring-rose-500/20">
                    <AvatarImage
                      src={session.user?.image || "/placeholder.svg"}
                    />
                    <AvatarFallback className="text-2xl font-bold bg-rose-100 dark:bg-rose-600/10 text-rose-700">
                      {profile.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <motion.div
                    className={`${badge.color} w-[110px] mx-auto px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <BadgeIcon className="h-3 w-3" />
                    {badge.label}
                  </motion.div>
                </div>
                <CardTitle className="text-2xl text-gray-900 dark:text-white mt-4">
                  {profile.user.name}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {profile.user.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-rose-50 dark:bg-rose-400/10 rounded-lg p-3">
                    <div className="text-2xl font-bold text-rose-700">
                      {profile.debatesParticipated}
                    </div>
                    <div className="text-xs text-rose-600">Debates</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-400/10 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-700">
                      {profile.totalVotes}
                    </div>
                    <div className="text-xs text-green-600">Votes</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 dark:bg-blue-600/10 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-700">
                      {profile.argumentsPosted}
                    </div>
                    <div className="text-xs text-blue-600">Arguments</div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-600/10 rounded-lg p-3">
                    <div className="text-2xl font-bold text-yellow-700">
                      {profile.winRate}%
                    </div>
                    <div className="text-xs text-yellow-600">Win Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-transparent border border-rose-100 dark:border-gray-700">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-white data-[state=active]:text-rose-700 dark:data-[state=active]:text-blue-400 dark:data-[state=active]:bg-blue-700/10"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="data-[state=active]:bg-white data-[state=active]:text-rose-700 dark:data-[state=active]:text-blue-400 dark:data-[state=active]:bg-blue-700/10"
                >
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Card className="bg-transparent border border-rose-100 dark:border-gray-700 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                          Achievements
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-300">
                            Debates Won
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 dark:bg-green-600/10 text-green-700"
                          >
                            {profile.debatesWon}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-300">
                            Total Votes Received
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 dark:bg-blue-600/10 text-blue-700"
                          >
                            {profile.totalVotes}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-300">
                            Arguments Posted
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-purple-100 dark:bg-purple-600/10 text-purple-700"
                          >
                            {profile.argumentsPosted}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card className="bg-transparent border border-rose-100 dark:border-gray-700 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FiTrendingUp className="h-5 w-5 text-rose-500" />
                          Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-300">
                            Win Rate
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 dark:bg-yellow-600/10 text-yellow-700"
                          >
                            {profile.winRate}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-300">
                            Avg. Votes per Argument
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-rose-100 dark:bg-rose-600/10 text-rose-700"
                          >
                            {profile.argumentsPosted > 0
                              ? Math.round(
                                  profile.totalVotes / profile.argumentsPosted
                                )
                              : 0}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-300">
                            Active Debates
                          </span>
                          {profile.debatesParticipated > 0 ? (
                            <>{profile.debatesParticipated}</>
                          ) : (
                            <>0</>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <div>
                  <Card className="bg-transparent border border-rose-100 dark:border-gray-700 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FiMessageSquare className="h-5 w-5 text-rose-600" />
                        Recent Arguments
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        Your latest contributions to debates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <FiMessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-500" />
                        <p>No arguments posted yet</p>
                        <p className="text-sm">
                          Join a debate and share your perspective!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProfileComp;
