
# Stage 1: Priority Inbox System Design

## Problem Statement
Users are overwhelmed by the high volume of incoming campus updates. The system must filter and display the top 'n' most important unread notifications based on category weight and recency.

## Prioritization Strategy
The priority is determined using the following hierarchy:
1. **Placement** (Highest Priority)
2. **Result**
3. **Event** (Lowest Priority)

In the event of a tie in category, recency (newer timestamps) acts as the tie-breaker.

## Algorithm & Complexity
* **Approach:** Utilizes a priority queue (Min-Heap / Max-Heap representation via language-specific implementations) to ensure that the highest-priority items can be retrieved efficiently in $O(n \log k)$ time, where $k$ is the number of items being retrieved.
* **Space Complexity:** $O(N)$ where $N$ is the total number of stored notifications in memory.
