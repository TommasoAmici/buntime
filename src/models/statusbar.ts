import { db } from "../db.js";

export const getStatusbarData = (
  userID: number
): { project: string; timeSpent: number; timePercentage: number }[] => {
  const results = db
    .query(
      `
      WITH time_per_project AS (
        SELECT
              project,
              created_at,
              time,
              time - LAG (time, 1, time) OVER (ORDER BY time) AS time_spent
        FROM
              heartbeats h
        WHERE
              user_id = $userID AND created_at >= DATE('now', 'start of day'))
        SELECT
          project,
          time_spent as timeSpent,
          time_spent / (SELECT SUM(time_spent) FROM time_per_project) as timePercentage
        FROM
          (
          SELECT
            project,
            SUM(time_spent) AS time_spent
          FROM
            time_per_project
          GROUP BY
            project
         )
`
    )
    .all({ $userID: userID });
  return results;
};
