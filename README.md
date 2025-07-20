# Community Debate Arena

This project is a community debate platform where users can engage in discussions by taking a stance on various topics. It allows users to create debates, join existing ones, post arguments, and vote on compelling responses. The platform also includes features like a scoreboard for top debaters and auto-moderation to ensure a healthy discussion environment.

## Project Overview

### Core Features (Must Complete):

1.  **Debate Creation**
    Authenticated users can create a debate topic with the following fields:

    - Title
    - Description
    - Tags (e.g., tech, ethics)
    - Category
    - Image/banner
    - Debate duration selector (e.g., 1 hour, 12 hours, 24 hours)

2.  **Join a Debate**

    - Authenticated users can join a debate by selecting one side:
      - Support (in favor of the topic)
      - Oppose (against the topic)
    - A user cannot join both sides in the same debate.

3.  **Argument Posting**
    Users can post their arguments under their selected side. Each argument must display:

    - Author info
    - Timestamp
    - Vote count
    - Edit/delete option (allowed only within 5 minutes of posting)

4.  **Voting System**
    Users can vote on others’ arguments:

    - One vote per argument per user
    - You may implement upvote/downvote logic or just a single “Vote” button

5.  **Debate Countdown and Auto-Close**

    - Each debate will have a countdown timer
    - When time expires:
      - Posting arguments is disabled
      - Voting is disabled
      - The side with the highest total votes is marked as the winner

6.  **Scoreboard**
    A public leaderboard showing:

    - Username
    - Total votes received across all arguments
    - Number of debates participated in
    - Filters: weekly / monthly / all-time

7.  **Auto-Moderation (Toxic Words)**
    When a user submits an argument:
    - Check for banned/inappropriate words (predefined list)
    - Prevent submission if found, and show a warning
      // Example banned words list: ["stupid", "idiot", "dumb"];

### Bonus Features (Highly Recommended):

- **Reply Timer:** Once a user joins a side, they must post their first argument within 5 minutes
- **Dark Mode:** Add a dark/light mode toggle for better user experience
- **Mobile-Optimized UI:** Ensure responsiveness across all screen sizes
- **Public Debate Sharing:** Allow debates to be shared via public URLs
- **Search Debates:** Allow filtering debates by title, tag, or category; include sorting (e.g., most voted, newest, ending soon)
- **Debate Summary Generator:** Display a static or mock AI-generated summary of the final debate outcome

### Tech Stack Requirements:

- Next.js 15 with App Router
- Tailwind CSS
- NextAuth.js for authentication
- Zod + React Hook Form for form validation
- Bonus: Use framer-motion for smooth transitions and animations
