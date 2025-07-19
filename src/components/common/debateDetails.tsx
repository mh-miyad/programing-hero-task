/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  AlertTriangle,
  Edit,
  MessageSquare,
  ThumbsUp,
  Trash2,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { useDebate } from "@/hooks/useDebate";
import { formatDistanceToNow } from "@/lib/date-fns";
import { Argument } from "@/Type/type";
import Loading from "../Animated/Loading";
import { CountdownTimer } from "./CountdownTimer";

const DebateDetails = ({ id }: { id: string }) => {
  const { data: session } = useSession();
  const {
    debate,
    loading,
    error,
    replyTimer,
    moderationWarning,
    joinDebate,
    addArgument,
    voteOnArgument,
    updateArgument,
    deleteArgument,
  } = useDebate(id);
  const [selectedSide, setSelectedSide] = useState<"support" | "oppose" | null>(
    null
  );
  const [argumentText, setArgumentText] = useState("");
  const [editingArgument, setEditingArgument] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  if (loading) {
    return <Loading />;
  }

  if (!debate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Debate Not Found</CardTitle>
            <CardDescription>
              {` The debate you're looking for doesn't exist.`}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const userParticipation = debate?.participants?.find(
    (p: any) => p.userId === session?.user?.email
  );
  const isDebateActive = debate?.isActive;
  const canEdit = (argumentId: string) => {
    const argument = debate?.arguments?.find(
      (a: Argument) => a?._id === argumentId
    );
    if (!argument || argument.authorId !== session?.user?.email) return false;
    const timeDiff =
      new Date().getTime() - new Date(argument.createdAt).getTime();
    return timeDiff < 5 * 60 * 1000; // 5 minutes
  };

  const handleJoinSide = async (side: "support" | "oppose") => {
    if (!session?.user?.email || !isDebateActive) return;
    const result = await joinDebate(side);
    if (!result.error) {
      setSelectedSide(side);
    }
  };

  const handleSubmitArgument = async () => {
    if (!session?.user?.email || !argumentText.trim()) return;
    await addArgument(argumentText);
    setArgumentText("");
  };

  const handleEditArgument = async (argumentId: string) => {
    if (!editText.trim()) return;
    await updateArgument(argumentId, editText);
    setEditingArgument(null);
    setEditText("");
  };

  // Move filter calls here to ensure debate is defined
  const supportArguments = debate.arguments.filter(
    (a: Argument) => a.side === "support"
  );
  const opposeArguments = debate.arguments.filter(
    (a: Argument) => a.side === "oppose"
  );

  const formatReplyTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Debate Header */}
      <Card className="mb-6 border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={isDebateActive ? "default" : "secondary"}>
                  {isDebateActive ? "Active" : "Ended"}
                </Badge>
                <Badge variant="outline">{debate.category}</Badge>
              </div>
              <CardTitle className="text-2xl md:text-3xl">
                {debate.title}
              </CardTitle>
              <CardDescription className="text-base text-justify">
                {debate.description}
              </CardDescription>
            </div>
            <div className="text-right space-y-2">
              <CountdownTimer endTime={debate.endTime} />
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{debate.participants.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{debate.arguments.length}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {debate.tags.map((tag: string) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Join Debate */}
      {session?.user && !userParticipation && isDebateActive && (
        <Card className="mb-6 border-0 shadow-lg">
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
              <Button
                onClick={() => handleJoinSide("support")}
                variant="outline"
                className="h-20 w-full text-green-600 border-green-200 hover:bg-green-50"
              >
                <div className="text-center">
                  <div className="font-semibold text-lg">Support</div>
                  <div className="text-sm opacity-80">
                    I agree with this topic
                  </div>
                </div>
              </Button>
              <Button
                onClick={() => handleJoinSide("oppose")}
                variant="outline"
                className="h-20 w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                <div className="text-center">
                  <div className="font-semibold text-lg">Oppose</div>
                  <div className="text-sm opacity-80">
                    I disagree with this topic
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reply Timer Warning */}
      {replyTimer !== null && replyTimer > 0 && (
        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            You have{" "}
            <span className="font-bold">{formatReplyTimer(replyTimer)}</span> to
            post your first argument or {`you'll`} be removed from the debate!
          </AlertDescription>
        </Alert>
      )}

      {/* Moderation Warning */}
      {moderationWarning && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{moderationWarning}</AlertDescription>
        </Alert>
      )}

      {/* Post Argument */}
      {session?.user && userParticipation && isDebateActive && (
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Post Your Argument
            </CardTitle>
            <CardDescription>
              {`You're `}arguing for the{" "}
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
              <Textarea
                placeholder="Share your argument..."
                value={argumentText}
                onChange={(e) => setArgumentText(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <Button
                onClick={handleSubmitArgument}
                disabled={!argumentText.trim()}
              >
                Post Argument
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vote Tally */}
      <Card className="mb-6 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Current Standing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {debate.supportVotes}
              </div>
              <div className="text-sm text-green-600 font-medium">
                Support Votes
              </div>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">
                {debate.opposeVotes}
              </div>
              <div className="text-sm text-red-600 font-medium">
                Oppose Votes
              </div>
            </div>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-red-500"
              style={{
                width:
                  debate.totalVotes > 0
                    ? `${(debate.supportVotes / debate.totalVotes) * 100}%`
                    : "50%",
              }}
            />
          </div>
          {!isDebateActive && debate.winner && (
            <div className="text-center">
              <Badge variant="default" className="text-lg px-6 py-2">
                🏆 Winner:{" "}
                {debate.winner.charAt(0).toUpperCase() + debate.winner.slice(1)}{" "}
                Side
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Arguments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support Arguments */}
        <Card className="border-0 shadow-lg py-0 overflow-hidden">
          <CardHeader className="bg-green-50 py-4">
            <CardTitle className="text-green-600 flex items-center gap-2">
              <ThumbsUp className="h-5 w-5" />
              Support Arguments ({supportArguments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {supportArguments.length > 0 ? (
              supportArguments.map((argument: Argument) => (
                <div
                  key={argument._id}
                  className="border rounded-lg p-4 bg-card"
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
                      {canEdit(argument._id) && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingArgument(argument._id);
                              setEditText(argument.content);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteArgument(argument._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  {editingArgument === argument._id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEditArgument(argument._id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingArgument(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm mb-4">{argument.content}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => voteOnArgument(argument._id)}
                      disabled={
                        !session?.user ||
                        !isDebateActive ||
                        argument.votedBy.includes(session?.user?.email || "")
                      }
                      className="flex items-center gap-2 hover:bg-green-50"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{argument.votes}</span>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                <p className="text-muted-foreground">No arguments yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Be the first to support this debate!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Oppose Arguments */}
        <Card className="border-0 shadow-lg py-0 overflow-hidden">
          <CardHeader className="bg-red-50 py-4">
            <CardTitle className="text-red-600 flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 rotate-180" />
              Oppose Arguments ({opposeArguments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {opposeArguments.length > 0 ? (
              opposeArguments.map((argument: Argument) => (
                <div
                  key={argument._id}
                  className="border rounded-lg p-4 bg-card"
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
                      {canEdit(argument._id) && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingArgument(argument._id);
                              setEditText(argument.content);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteArgument(argument._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  {editingArgument === argument._id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEditArgument(argument._id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingArgument(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm mb-4">{argument.content}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => voteOnArgument(argument._id)}
                      disabled={
                        !session?.user ||
                        !isDebateActive ||
                        argument.votedBy.includes(session?.user?.email || "")
                      }
                      className="flex items-center gap-2 hover:bg-red-50"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{argument.votes}</span>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                <p className="text-muted-foreground">No arguments yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Be the first to oppose this debate!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DebateDetails;
