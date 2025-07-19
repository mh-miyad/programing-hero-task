"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetAllDebates from "@/hooks/useGetAllDebates";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiFilter, FiSearch, FiTrendingUp } from "react-icons/fi";
import CardDebate from "../Animated/card";
import Loading from "../Animated/Loading";

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

export default function HomeSection() {
  const { debates, loading, errors } = useGetAllDebates();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredDebates = debates
    .filter((debate) => {
      const matchesSearch =
        debate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debate.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debate.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesCategory =
        categoryFilter === "all" || debate.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "ending-soon":
          return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
        case "most-voted":
          return b.totalVotes - a.totalVotes;
        default:
          return 0;
      }
    });

  const categories = [
    "all",
    "tech",
    "ethics",
    "politics",
    "science",
    "society",
  ];
  if (loading) {
    return <Loading />;
  }
  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.div className="text-center mb-12" variants={{ itemVariants }}>
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-4  "
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Welcome to DebateArena
        </motion.h1>
        <motion.p
          className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Join the ultimate battle of opinions and make your voice heard in our
          vibrant debate community
        </motion.p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="flex flex-col md:flex-row gap-4 mb-8"
        variants={{ itemVariants }}
      >
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 h-4 w-4 text-secondary-400" />
          <Input
            placeholder="Search debates by title, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 "
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48 bg-white border-primary-200">
            <FiFilter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-white border-primary-200">
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all"
                  ? "All Categories"
                  : category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48 bg-white border-primary-200">
            <FiTrendingUp className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white border-primary-200">
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="ending-soon">Ending Soon</SelectItem>
            <SelectItem value="most-voted">Most Voted</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Debates Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          {filteredDebates.map((debate) => (
            <div key={debate._id}>
              <CardDebate debate={debate} />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredDebates.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="mb-4"
          >
            <FiSearch className="h-16 w-16 mx-auto text-secondary-400" />
          </motion.div>
          <h3 className="text-xl font-semibold text-secondary-700 mb-2">
            No debates found
          </h3>
          <p className="text-secondary-500">
            Try adjusting your search or filters to find more debates
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
