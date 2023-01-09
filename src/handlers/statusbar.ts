import { durationStatus } from "../lib/duration.js";
import { getStatusbarData, TimePerCategory } from "../models/statusbar.js";

type StatusbarResponse = {
  cached_at: Date;
  data: {
    categories: Category[];
    dependencies: [];
    editors: Editor[];
    grand_total: Status;
    languages: Language[];
    machines: Machine[];
    operating_systems: OperatingSystem[];
    projects: Project[];
    range: DateRange;
  };
};

const formatResponse = (data: TimePerCategory) =>
  data.map((d) => ({
    color: null,
    name: d.name,
    percent: d.timePercentage * 100,
    ...durationStatus(d.timeSpent),
  }));

export async function getStatusbar(req: Request, userID: number) {
  const data = getStatusbarData(userID);
  const projects: Project[] = formatResponse(data.projects);
  const languages: Language[] = formatResponse(data.languages);
  const grandTotal = durationStatus(
    data.projects.length === 0
      ? 0
      : data.projects.map((d) => d.timeSpent).reduce((a, b) => a + b)
  );
  const response: StatusbarResponse = {
    cached_at: new Date(),
    data: {
      categories: [
        {
          decimal: "0.00",
          digital: "0:00:00",
          hours: 0,
          minutes: 0,
          name: "Coding",
          percent: 0,
          seconds: 0,
          text: "0 secs",
          total_seconds: 0.0,
        },
      ],
      dependencies: [],
      editors: [
        {
          decimal: "0.00",
          digital: "0:00:00",
          hours: 0,
          minutes: 0,
          name: "VS Code",
          percent: 0,
          seconds: 0,
          text: "0 secs",
          total_seconds: 0.0,
        },
      ],
      grand_total: grandTotal,
      languages,
      machines: [
        {
          decimal: "0.00",
          digital: "0:00:00",
          hours: 0,
          machine_name_id: "410bcd3a-f889-4aeb-adf3-d0b854992d8c",
          minutes: 0,
          name: "Tommasos-MacBook-Pro.local",
          percent: 0,
          seconds: 0,
          text: "0 secs",
          total_seconds: 0.0,
        },
      ],
      operating_systems: [
        {
          decimal: "0.00",
          digital: "0:00:00",
          hours: 0,
          minutes: 0,
          name: "Mac",
          percent: 0,
          seconds: 0,
          text: "0 secs",
          total_seconds: 0.0,
        },
      ],
      projects,
      range: {
        date: "2022-12-09",
        end: "2022-12-09T22:59:59Z",
        start: "2022-12-08T23:00:00Z",
        text: "Today",
        timezone: "Europe/Amsterdam",
      },
    },
  };
  return new Response(JSON.stringify(response), {
    headers: { "content-type": "application/json" },
  });
}
