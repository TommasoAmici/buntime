import { db } from "../db.js";

const insertHeartbeat = db.prepare(`
INSERT INTO heartbeats (
  user_id,
  branch,
  category,
  cursorpos,
  dependencies,
  entity,
  is_write,
  language,
  lineno,
  lines,
  project,
  time,
  type,
  user_agent,
  machine,
  operating_system
) VALUES (
  $userID,
  $branch,
  $category,
  $cursorpos,
  $dependencies,
  $entity,
  $is_write,
  $language,
  $lineno,
  $lines,
  $project,
  $time,
  $type,
  $user_agent,
  $machine,
  $operating_system
);`);
const insertManyHeartbeats = db.transaction(
  (
    userID: number,
    heartbeats: HeartBeat[],
    machine: string,
    operatingSystem: string
  ) => {
    for (const hb of heartbeats) {
      const params = {
        $userID: userID,
        $branch: hb.branch,
        $category: hb.category,
        $cursorpos: hb.cursorpos,
        $dependencies: hb.dependencies ? JSON.stringify(hb.dependencies) : null,
        $entity: hb.entity,
        $is_write: hb.is_write ?? false,
        $language: hb.language ?? "",
        $lineno: hb.lineno,
        $lines: hb.lines,
        $project: hb.project,
        $time: hb.time,
        $type: hb.type,
        $user_agent: hb.user_agent,
        $machine: machine,
        $operating_system: operatingSystem,
      };
      insertHeartbeat.run(params);
    }
  }
);

const getOSFromUA = (userAgent: string) => {
  const match = userAgent.match(/\((.+)\)/);
  if (match === null) {
    return "";
  }
  return match[1].split("-")[0];
};

export async function postHeartbeats(req: Request, userID: number) {
  const heartbeats = await req.json<HeartBeat[]>();
  const machine = req.headers.get("X-Machine-Name") ?? "";
  const operatingSystem = getOSFromUA(req.headers.get("User-Agent") ?? "");

  insertManyHeartbeats(userID, heartbeats, machine, operatingSystem);

  const response = {
    responses: [heartbeats.map(() => [{ data: { id: null } }, 201])],
  };

  return new Response(JSON.stringify(response), {
    status: 202,
    headers: { "content-type": "application/json" },
  });
}
