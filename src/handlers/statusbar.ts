import {
  formatDuration,
  formatDurationDigital,
  hoursFromSeconds,
  minutesFromSeconds,
  secondsFromSeconds,
} from "../lib/duration.js";
import { getStatusbarData } from "../models/statusbar.js";

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

export async function getStatusbar(req: Request, userID: number) {
  const data = getStatusbarData(userID);
  const projects = data.map((d) => ({
    color: null,
    decimal: (d.timeSpent / 3600).toFixed(2),
    digital: formatDurationDigital(d.timeSpent),
    hours: hoursFromSeconds(d.timeSpent),
    minutes: minutesFromSeconds(d.timeSpent),
    name: d.project,
    text: formatDuration(d.timeSpent),
    percent: d.timePercentage * 100,
    seconds: secondsFromSeconds(d.timeSpent),
    total_seconds: d.timeSpent,
  }));
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
      grand_total: {
        decimal: "0.00",
        digital: "0:00",
        hours: 0,
        minutes: 0,
        text: "0 secs",
        total_seconds: 0.0,
      },
      languages: [
        {
          decimal: "0.00",
          digital: "0:00:00",
          hours: 0,
          minutes: 0,
          name: "TypeScript",
          percent: 0,
          seconds: 0,
          text: "0 secs",
          total_seconds: 0.0,
        },
      ],
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
