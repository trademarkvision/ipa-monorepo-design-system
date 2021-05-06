import {PopupIssue, PopupIssueGroup} from "../models/issues";

export class CommonUtils {

  public static dateString(d?: string): string | null {
    if (d) {
      const date = new Date(d);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const min = date.getMinutes();
      const hr = date.getHours();
      return `${date.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hr < 10 ? '0' + hr : hr}:${min < 10 ? '0' + min : min}`;
    } else {
      return null;
    }
  }

  public static issuesData(filter: string[], allIssues: PopupIssueGroup[]): PopupIssueGroup[] {
    if (filter != null && !(filter == undefined) && filter.length > 0) {
      return this.filterGroup(allIssues, filter);
    }
    return allIssues;
  }

  public static findIssueById(id: string, allIssues: PopupIssueGroup[]): PopupIssue | null {
    return CommonUtils.allIssues(allIssues)[id];
  }

  public static nestedIssueName(id: string, allIssues: PopupIssueGroup[], includeSectionName: boolean = true): string {
    let x = CommonUtils.allIssues(allIssues)[id];
    return x ? `${includeSectionName ? `${x.parent} / ` : ''}${x.description}` : 'Other considered items';
  }

  public static copyToClipboard(stringOrElement: HTMLElement | string, keepSelected: boolean = false) {
    if (window.getSelection) {
      const s = window.getSelection()!;
      if (typeof stringOrElement === "string") {
        const e1 = document.createElement('input');
        document.body.appendChild(e1);
        e1.value = stringOrElement;
        e1.select();
        let d = false;
        try {
          d = document.execCommand('copy');
        } catch (err) {
        }
        document.body.removeChild(e1);
        s.removeAllRanges();
      } else {
        // Copy text
        CommonUtils.copyToClipboard(stringOrElement.innerText);
        if (keepSelected) {
          // Select node for CTRL+C in case copy didn't work...
          window.getSelection()!.removeAllRanges();
          const range = document.createRange();
          range.selectNode(stringOrElement);
          s.addRange(range);
        }
      }
    }
  }

  public static keyboardeEventInTextField(e: KeyboardEvent) {
    if (e) {
      return Array.from((e as any).path)
        .filter((x: HTMLElement | any) => (x.nodeName === 'INPUT' || x.nodeName === 'TEXTAREA' || x.contentEditable === "true"))
        .length > 0
    }
    return false;
  }

  private static filterGroup(groups: PopupIssueGroup[], filter: string[]): PopupIssueGroup[] {
    if (groups == null || groups === undefined || groups.length == 0) return [];
    return groups.map(v => {
      return {
        ...v,
        issues: v.issues ? v.issues.filter(k => filter && filter.indexOf(k.issue) > -1) : undefined,
        subGroup: v.subGroup && filter ? CommonUtils.filterGroup(v.subGroup, filter) : undefined,
      }
    }).filter(x => (x.issues && x.issues.length > 0 || x.subGroup && x.subGroup.length > 0));
  }

  private static allIssues(issues: PopupIssueGroup[]): { [id: string]: PopupIssue & { parent: string } } {
    let xs: { [id: string]: PopupIssue & { parent: string } } = {};
    issues.forEach(g => {
      if (g.subGroup) {
        g.subGroup.forEach(ss => {
          (ss.issues ? ss.issues : []).forEach(i => {
            xs[i.issue] = {...i, parent: ss.description};
          })
        });
      } else {
        (g.issues ? g.issues : []).forEach(i => {
          xs[i.issue] = {...i, parent: g.description};
        })
      }
    });
    return xs;
  }

}
