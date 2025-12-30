
export enum ProjectStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done'
}

export interface Project {
  id: string;
  name: string;
  owner: string;
  status: ProjectStatus;
  createdAt: number;
}
