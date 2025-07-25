"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DebateForm } from "@/Type/type";
import { debateSchema } from "@/Zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateDebateComp = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    resetField,
  } = useForm<DebateForm>({
    resolver: zodResolver(debateSchema),
  });

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleGenerateContent = async () => {
    if (!topic) return;
    setGenerating(true);
    try {
      const response = await fetch("/api/generate-debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await response.json();
      setValue("title", data.title);
      setValue("description", data.description);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setGenerating(false);
    }
  };

  const onSubmit = async (data: DebateForm) => {
    if (!session) {
      router.push("/login");
      return;
    }

    const durationHours = Number.parseInt(data.duration);
    const endTime = new Date(
      Date.now() + durationHours * 60 * 60 * 1000
    ).toISOString();

    const newDebate = {
      title: data.title,
      description: data.description,
      tags,
      category: data.category,
      banner: data.banner || "/placeHolder.webp",
      duration: durationHours,
      endTime,
      createdBy: session?.user?.email,
    };

    try {
      const response = await fetch("/api/debates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDebate),
      });
      const createdDebate = await response.json();
      if (createdDebate._id) {
        resetField("title");
        resetField("description");
        setTags([]);
        setTagInput("");
        setTopic("");
        toast.success("Debate created successfully!");
        router.push(`/`);
      } else {
        toast.error("Failed to create debate.");
      }
    } catch (error) {
      console.error("Error creating debate:", error);
    }
  };

  const categories = [
    "tech",
    "ethics",
    "politics",
    "science",
    "society",
    "entertainment",
    "sports",
  ];
  const durations = [
    { value: "1", label: "1 Hour" },
    { value: "12", label: "12 Hours" },
    { value: "24", label: "24 Hours" },
    { value: "72", label: "3 Days" },
    { value: "168", label: "1 Week" },
  ];
  return (
    <section>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto mb-8">
          <CardHeader>
            <CardTitle>Generate Debate Content (AI)</CardTitle>
            <CardDescription>
              Enter a topic and let AI generate a title and description for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Enter a topic, e.g., 'The future of remote work'"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <Button onClick={handleGenerateContent} disabled={generating}>
                {generating ? "Generating..." : "Generate"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Debate</CardTitle>
            <CardDescription>
              Start a new discussion and let the community battle it out
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Debate Title *</Label>
                <Input
                  id="title"
                  placeholder="Should artificial intelligence replace human jobs?"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide context and background for your debate topic. What are the key points to consider?"
                  rows={4}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    onValueChange={(value) => setValue("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-600">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Select
                    onValueChange={(value) => setValue("duration", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((duration) => (
                        <SelectItem key={duration.value} value={duration.value}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.duration && (
                    <p className="text-sm text-red-600">
                      {errors.duration.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (max 5)</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    disabled={tags.length >= 5}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner">Banner Image URL (optional)</Label>
                <Input
                  id="banner"
                  placeholder="https://example.com/image.jpg"
                  {...register("banner")}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Create Debate
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CreateDebateComp;
