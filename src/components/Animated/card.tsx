"use client";
import { Debate } from "@/state/store";
import * as motion from "motion/react-client";
import Link from "next/link";
import {
  FiArrowRight,
  FiClock,
  FiMessageSquare,
  FiUsers,
} from "react-icons/fi";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
const CardDebate = ({ debate }: { debate: Debate }) => {
  const getTimeRemaining = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };
  return (
    <motion.div
      key={debate.id}
      variants={{
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
      }}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      layout
      transition={{ delay: Math.random() * 0.1 }}
    >
      <Card className="h-full dark:bg-transparent backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="space-y-3">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg line-clamp-2 leading-tight text-secondary-900">
              {debate.title}
            </CardTitle>
            <motion.div
              animate={
                new Date(debate.endTime) > new Date()
                  ? { scale: [1, 1.05, 1] }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              <Badge
                variant={
                  new Date(debate.endTime) > new Date()
                    ? "default"
                    : "secondary"
                }
                className={
                  new Date(debate.endTime) > new Date()
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-secondary-200 text-secondary-700"
                }
              >
                {new Date(debate.endTime) > new Date() ? "Active" : "Ended"}
              </Badge>
            </motion.div>
          </div>
          <CardDescription className="line-clamp-3 text-sm leading-relaxed text-secondary-600">
            {debate.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div
            className="flex flex-wrap gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {debate.tags.map((tag, tagIndex) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + tagIndex * 0.1 }}
              >
                <Badge
                  variant="outline"
                  className="text-xs  transition-colors dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
                >
                  {tag}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex items-center justify-between text-sm text-secondary-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FiUsers className="h-4 w-4" />
                <span>{debate.participants.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiMessageSquare className="h-4 w-4" />
                <span>{debate.arguments.length}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 font-medium">
              <FiClock className="h-4 w-4" />
              <span>{getTimeRemaining(debate.endTime)}</span>
            </div>
          </div>

          <motion.div
            className="bg-gradient-to-r from-green-50 to-red-50 dark:from-green-500/5 dark:to-red-500/5 rounded-lg p-3 "
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-green-600 font-medium">
                Support: {debate.supportVotes}
              </span>
              <span className="text-secondary-400">vs</span>
              <span className="text-red-600 font-medium">
                Oppose: {debate.opposeVotes}
              </span>
            </div>
            <div className="h-2 bg-secondary-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-red-500"
                initial={{ width: 0 }}
                animate={{
                  width:
                    debate.totalVotes > 0
                      ? `${(debate.supportVotes / debate.totalVotes) * 100}%`
                      : "90%",
                }}
                transition={{ duration: 1, delay: 0.7 }}
              />
            </div>
          </motion.div>

          <Link href={`/debate/${debate.id}`}>
            <Button className="w-full shadow-md hover:shadow-lg transition-all duration-200">
              Join Debate
              <FiArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CardDebate;
