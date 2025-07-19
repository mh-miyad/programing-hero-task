"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "@/lib/date-fns";
import { useDebateStore } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  Edit,
  MessageSquare,
  ThumbsUp,
  Trash2,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

const argumentVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
    },
  },
};

const voteButtonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.1 },
  tap: { scale: 0.95 },
  voted: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.3,
    },
  },
};

const CountdownTimer = ({ endTime }: { endTime: string }) => {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeRemaining("Debate Ended");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setIsUrgent(diff < 60 * 60 * 1000); // Less than 1 hour
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <motion.div
      className="flex items-center gap-2 text-sm text-muted-foreground"
      animate={
        isUrgent
          ? {
              color: [
                "rgb(239 68 68)",
                "rgb(239 68 68 / 0.7)",
                "rgb(239 68 68)",
              ],
              scale: [1, 1.05, 1],
            }
          : {}
      }
      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
    >
      <Clock className="h-4 w-4" />
      <span className={`font-medium ${isUrgent ? "text-red-500" : ""}`}>
        {timeRemaining}
      </span>
    </motion.div>
  );
};

export default function DebatePage() {
  const params = useParams();
  const debateId = params.id as string;
  const {
    debates,
    user,
    joinDebate,
    addArgument,
    voteOnArgument,
    updateArgument,
    deleteArgument,
  } = useDebateStore();
  const [selectedSide, setSelectedSide] = useState<"support" | "oppose" | null>(
    null
  );
  const [argumentText, setArgumentText] = useState("");
  const [editingArgument, setEditingArgument] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [replyTimer, setReplyTimer] = useState<number | null>(null);
  const [moderationWarning, setModerationWarning] = useState("");

  const debate = debates.find((d) => d.id === debateId);

  useEffect(() => {
    if (replyTimer !== null && replyTimer > 0) {
      const interval = setInterval(() => {
        setReplyTimer((prev) => prev! - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [replyTimer]);

  if (!debate) {
    return (
      <motion.div
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Debate Not Found</CardTitle>
            <CardDescription>
              The debate you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
    );
  }

  const userParticipation = debate.participants.find(
    (p) => p.userId === user?.id
  );
  const isDebateActive = new Date(debate.endTime) > new Date();
  const canEdit = (argumentId: string) => {
    const argument = debate.arguments.find((a) => a.id === argumentId);
    if (!argument || argument.authorId !== user?.id) return false;
    const timeDiff =
      new Date().getTime() - new Date(argument.createdAt).getTime();
    return timeDiff < 5 * 60 * 1000; // 5 minutes
  };

  const bannedWords = ["stupid", "idiot", "dumb", "hate", "kill", "die"];

  const checkModeration = (text: string) => {
    const lowerText = text.toLowerCase();
    const foundBannedWord = bannedWords.find((word) =>
      lowerText.includes(word)
    );
    if (foundBannedWord) {
      setModerationWarning(
        `Your message contains inappropriate content: "${foundBannedWord}". Please revise your argument.`
      );
      return false;
    }
    setModerationWarning("");
    return true;
  };

  const handleJoinSide = (side: "support" | "oppose") => {
    if (!user || !isDebateActive) return;

    joinDebate(debateId, user.id, side);
    setSelectedSide(side);
    setReplyTimer(5 * 60); // 5 minutes to post first argument
  };

  const handleSubmitArgument = () => {
    if (!user || !argumentText.trim() || !userParticipation) return;

    if (!checkModeration(argumentText)) return;

    addArgument(debateId, {
      id: Date.now().toString(),
      authorId: user.id,
      authorName: user.name,
      side: userParticipation.side,
      content: argumentText,
      votes: 0,
      votedBy: [],
      createdAt: new Date().toISOString(),
    });

    setArgumentText("");
    setReplyTimer(null);
  };

  const handleEditArgument = (argumentId: string) => {
    if (!editText.trim()) return;

    if (!checkModeration(editText)) return;

    updateArgument(debateId, argumentId, editText);
    setEditingArgument(null);
    setEditText("");
  };

  const supportArguments = debate.arguments.filter((a) => a.side === "support");
  const opposeArguments = debate.arguments.filter((a) => a.side === "oppose");

  const formatReplyTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Debate Header */}
      <motion.div variants={itemVariants}>
        <Card className="mb-6 overflow-hidden bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    animate={isDebateActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <Badge
                      variant={isDebateActive ? "default" : "secondary"}
                      className={
                        isDebateActive ? "bg-green-500 hover:bg-green-600" : ""
                      }
                    >
                      {isDebateActive ? "Active" : "Ended"}
                    </Badge>
                  </motion.div>
                  <Badge variant="outline">{debate.category}</Badge>
                </div>
                <CardTitle className="text-2xl md:text-3xl leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {debate.title}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {debate.description}
                </CardDescription>
              </div>
              <div className="text-right space-y-2">
                <CountdownTimer endTime={debate.endTime} />
                <div className="flex items-center gap-4 text-sm">
                  <motion.div
                    className="flex items-center gap-1"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Users className="h-4 w-4" />
                    <span>{debate.participants.length}</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-1"
                    whileHover={{ scale: 1.1 }}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>{debate.arguments.length}</span>
                  </motion.div>
                </div>
              </div>
            </div>

            <motion.div
              className="flex flex-wrap gap-2 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {debate.tags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Badge
                    variant="outline"
                    className="hover:bg-primary/10 transition-colors"
                  >
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Join Debate */}
      <AnimatePresence>
        {user && !userParticipation && isDebateActive && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="mb-6 border-0 bg-gradient-to-r from-green-50/50 to-red-50/50 dark:from-green-950/20 dark:to-red-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Choose Your Side
                </CardTitle>
                <CardDescription>
                  Select whether you support or oppose this debate topic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => handleJoinSide("support")}
                      variant="outline"
                      className="h-20 w-full text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-950/20 relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-green-100 dark:bg-green-900/20 translate-x-[-100%] group-hover:translate-x-0"
                        transition={{ duration: 0.3 }}
                      />
                      <div className="text-center relative z-10">
                        <div className="font-semibold text-lg">Support</div>
                        <div className="text-sm opacity-80">
                          I agree with this topic
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => handleJoinSide("oppose")}
                      variant="outline"
                      className="h-20 w-full text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-red-100 dark:bg-red-900/20 translate-x-[-100%] group-hover:translate-x-0"
                        transition={{ duration: 0.3 }}
                      />
                      <div className="text-center relative z-10">
                        <div className="font-semibold text-lg">Oppose</div>
                        <div className="text-sm opacity-80">
                          I disagree with this topic
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reply Timer Warning */}
      <AnimatePresence>
        {replyTimer !== null && replyTimer > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </motion.div>
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                You have{" "}
                <span className="font-bold">
                  {formatReplyTimer(replyTimer)}
                </span>{" "}
                to post your first argument or you'll be removed from the
                debate!
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Moderation Warning */}
      <AnimatePresence>
        {moderationWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{moderationWarning}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Argument */}
      <AnimatePresence>
        {user && userParticipation && isDebateActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="mb-6 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Post Your Argument
                </CardTitle>
                <CardDescription>
                  You're arguing for the{" "}
                  <Badge
                    variant={
                      userParticipation.side === "support"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {userParticipation.side}
                  </Badge>{" "}
                  side
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Textarea
                      placeholder="Share your argument..."
                      value={argumentText}
                      onChange={(e) => setArgumentText(e.target.value)}
                      rows={4}
                      className="resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleSubmitArgument}
                      disabled={!argumentText.trim()}
                      className="relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%]"
                        transition={{ duration: 0.6 }}
                      />
                      Post Argument
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vote Tally */}
      <motion.div variants={itemVariants}>
        <Card className="mb-6 border-0 shadow-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Current Standing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <motion.div
                className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="text-3xl font-bold text-green-600"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  {debate.supportVotes}
                </motion.div>
                <div className="text-sm text-green-600 font-medium">
                  Support Votes
                </div>
              </motion.div>
              <motion.div
                className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 rounded-lg"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="text-3xl font-bold text-red-600"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  {debate.opposeVotes}
                </motion.div>
                <div className="text-sm text-red-600 font-medium">
                  Oppose Votes
                </div>
              </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-red-500"
                initial={{ width: 0 }}
                animate={{
                  width:
                    debate.totalVotes > 0
                      ? `${(debate.supportVotes / debate.totalVotes) * 100}%`
                      : "50%",
                }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>

            <AnimatePresence>
              {!isDebateActive && debate.winner && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <Badge
                    variant="default"
                    className="text-lg px-6 py-2 bg-gradient-to-r from-primary to-primary/80"
                  >
                    🏆 Winner:{" "}
                    {debate.winner.charAt(0).toUpperCase() +
                      debate.winner.slice(1)}{" "}
                    Side
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Arguments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support Arguments */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
              <CardTitle className="text-green-600 flex items-center gap-2">
                <ThumbsUp className="h-5 w-5" />
                Support Arguments ({supportArguments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <AnimatePresence>
                {supportArguments.map((argument, index) => (
                  <motion.div
                    key={argument.id}
                    variants={argumentVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -20 }}
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4 bg-gradient-to-br from-card to-card/50 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-green-100 text-green-700">
                            {argument.authorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">
                            {argument.authorName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(argument.createdAt), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {canEdit(argument.id) && (
                          <>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingArgument(argument.id);
                                  setEditText(argument.content);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  deleteArgument(debateId, argument.id)
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </>
                        )}
                      </div>
                    </div>

                    {editingArgument === argument.id ? (
                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                        <div className="flex gap-2">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="sm"
                              onClick={() => handleEditArgument(argument.id)}
                            >
                              Save
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingArgument(null)}
                            >
                              Cancel
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    ) : (
                      <p className="text-sm mb-4 leading-relaxed">
                        {argument.content}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <motion.div
                        variants={voteButtonVariants}
                        initial="idle"
                        whileHover="hover"
                        whileTap="tap"
                        animate={
                          argument.votedBy.includes(user?.id || "")
                            ? "voted"
                            : "idle"
                        }
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            voteOnArgument(
                              debateId,
                              argument.id,
                              user?.id || ""
                            )
                          }
                          disabled={
                            !user ||
                            !isDebateActive ||
                            argument.votedBy.includes(user?.id || "")
                          }
                          className="flex items-center gap-2 hover:bg-green-50 dark:hover:bg-green-950/20"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <motion.span
                            key={argument.votes}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {argument.votes}
                          </motion.span>
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {supportArguments.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                  <p className="text-muted-foreground">No arguments yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Be the first to support this debate!
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Oppose Arguments */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20">
              <CardTitle className="text-red-600 flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 rotate-180" />
                Oppose Arguments ({opposeArguments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <AnimatePresence>
                {opposeArguments.map((argument, index) => (
                  <motion.div
                    key={argument.id}
                    variants={argumentVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: 20 }}
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4 bg-gradient-to-br from-card to-card/50 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-red-100 text-red-700">
                            {argument.authorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">
                            {argument.authorName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(argument.createdAt), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {canEdit(argument.id) && (
                          <>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingArgument(argument.id);
                                  setEditText(argument.content);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  deleteArgument(debateId, argument.id)
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </>
                        )}
                      </div>
                    </div>

                    {editingArgument === argument.id ? (
                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                        <div className="flex gap-2">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="sm"
                              onClick={() => handleEditArgument(argument.id)}
                            >
                              Save
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingArgument(null)}
                            >
                              Cancel
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    ) : (
                      <p className="text-sm mb-4 leading-relaxed">
                        {argument.content}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <motion.div
                        variants={voteButtonVariants}
                        initial="idle"
                        whileHover="hover"
                        whileTap="tap"
                        animate={
                          argument.votedBy.includes(user?.id || "")
                            ? "voted"
                            : "idle"
                        }
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            voteOnArgument(
                              debateId,
                              argument.id,
                              user?.id || ""
                            )
                          }
                          disabled={
                            !user ||
                            !isDebateActive ||
                            argument.votedBy.includes(user?.id || "")
                          }
                          className="flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <motion.span
                            key={argument.votes}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {argument.votes}
                          </motion.span>
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {opposeArguments.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                  <p className="text-muted-foreground">No arguments yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Be the first to oppose this debate!
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
