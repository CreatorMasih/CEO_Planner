import type { Task } from "@/hooks/useData";

export const PLANNER_MEETING_TYPE_LINE = "Type: Meeting";

export function isPlannerMeetingTask(task: Task) {
  return task.description?.includes(PLANNER_MEETING_TYPE_LINE) ?? false;
}

export function isPlannerTask(task: Task) {
  return !!dateKeyForTask(task);
}

export function isTaskItem(task: Task) {
  return !isPlannerMeetingTask(task);
}

export function dateKeyForTask(task: Task) {
  return task.scheduled_date ?? task.due_date;
}
