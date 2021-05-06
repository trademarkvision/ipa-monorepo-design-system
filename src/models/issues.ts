export interface PopupIssueGroup {
  groupName: string;
  description: string;
  subGroup?: PopupIssueGroup[];
  issues?: PopupIssue[];
}

export interface PopupIssue {
  issue: string;
  description: string;
  strength: string;
}

export interface PopupIssueDTO {
  issue: string;
  comment: string;
  strength: string | null;
}

export interface IssueModel {
  contextId: string;
  type: string;
  text: string;
  strength: string | null;
}
