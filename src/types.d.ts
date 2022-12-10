type User = {
  username: string;
  password: string;
  email: string | null;
  token: string;
};

type HeartBeat = {
  branch: string;
  category: string;
  cursorpos: number;
  dependencies: string[] | null;
  entity: string;
  is_write: boolean | null;
  language: string | null;
  lineno: number;
  lines: number;
  project: string;
  time: number;
  type: string;
  user_agent: string;
};

type Status = {
  decimal: string; // "0.00"
  digital: string; // "0:00:00"
  hours: number; // 0
  minutes: number; // 0
  text: string; // "0 secs"
  total_seconds: number; // 0.0
};

type DetailedStatus = Status & {
  seconds: number; // 0
  percent: number; // 0
  name: string; // "Coding"
};

type Category = DetailedStatus;

type Editor = DetailedStatus;

type Language = DetailedStatus;

type Machine = DetailedStatus & {
  machine_name_id: string; // "410bcd3a-f889-4aeb-adf3-d0b854992d8c"
};

type OperatingSystem = DetailedStatus;

type Project = DetailedStatus & {
  color: null | string;
};

type DateRange = {
  date: string; // "2022-12-09",
  end: string; // "2022-12-09T22:59:59Z",
  start: string; // "2022-12-08T23:00:00Z",
  text: string; // "Today",
  timezone: string; // "Europe/Amsterdam",
};
