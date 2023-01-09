import { db } from "../db.js";

export type TimePerCategory = {
  name: string;
  timeSpent: number;
  timePercentage: number;
}[];

const getTimePerProject = (userID: number): TimePerCategory => {
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
          project as name,
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
          ORDER BY time_spent DESC
         )
`
    )
    .all({ $userID: userID });
  return results;
};

const getTimePerLanguage = (userID: number): TimePerCategory => {
  const results = db
    .query(
      `
        WITH time_per_language AS (
        SELECT
              language,
              created_at,
              time,
              time - LAG (time, 1, time) OVER (ORDER BY time) AS time_spent
        FROM
              heartbeats h
        WHERE
              user_id = $userID AND created_at >= DATE('now', 'start of day'))
        SELECT
          language as name,
          time_spent as timeSpent,
          time_spent / (SELECT SUM(time_spent) FROM time_per_language) as timePercentage
        FROM
          (
          SELECT
            language,
            SUM(time_spent) AS time_spent
          FROM
            time_per_language
          GROUP BY
            language
          ORDER BY time_spent DESC
         )
`
    )
    .all({ $userID: userID });
  return results;
};

const getTimePerBranch = (userID: number): TimePerCategory => {
  const results = db
    .query(
      `
        WITH time_per_branch AS (
        SELECT
              branch,
              created_at,
              time,
              time - LAG (time, 1, time) OVER (ORDER BY time) AS time_spent
        FROM
              heartbeats h
        WHERE
              user_id = $userID AND created_at >= DATE('now', 'start of day'))
        SELECT
          branch as name,
          time_spent as timeSpent,
          time_spent / (SELECT SUM(time_spent) FROM time_per_branch) as timePercentage
        FROM
          (
          SELECT
            branch,
            SUM(time_spent) AS time_spent
          FROM
            time_per_branch
          GROUP BY
            branch
          ORDER BY time_spent DESC
         )
`
    )
    .all({ $userID: userID });
  return results;
};

export const getStatusbarData = (userID: number) => {
  const projects = getTimePerProject(userID);
  const languages = getTimePerLanguage(userID);
  return { projects, languages };
};
