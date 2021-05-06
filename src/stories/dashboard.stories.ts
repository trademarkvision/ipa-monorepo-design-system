/* eslint-disable import/no-extraneous-dependencies */
import {storiesOf} from '@storybook/vue';
import {IssueSelectButton} from "../library";
import {text} from '@storybook/addon-knobs';


storiesOf('Dashboard', module)
  .add('issues popup', () => {
    return {
      components: {IssueSelectButton},
      template: `<issue-select-button :ip-right-id="ipRightId"
                     :start-issue="startIssue"
                     :start-issue-strength="startIssueStrength"
                     :title="title"
                     :popup-to-navbar="true"
                     :app-issues="appIssues"
                     @commit="commitIssue"/>`,
      props: {
        startIssueStrength: text('startIssueStrength', null),
        startIssue: text('startIssue', null),
        ipRightId: text('ipRightId', ''),
        title: text('title', 'Raise new issue'),
        appIssues: ["I-TMA-2", "I-TMA-3", "I-TMA-4", "I-TMA-5", "I-TMA-6", "I-TMA-7", "I-TMA-8", "I-TMA-9", "I-TMA-10", "I-TMA-11", "I-TMA-12", "I-TMA-13", "I-TMA-14", "I-TMA-15", "I-TMA-16", "I-TMA-17", "I-TMA-18", "I-TMA-19", "I-TMA-20", "I-TMA-21", "I-TMA-22", "I-TMA-23", "I-TMA-24", "I-TMA-25", "I-TMA-26", "I-TMA-27", "I-TMA-28", "I-TMA-29", "I-TMA-30", "I-TMA-31", "I-TMA-32", "I-TMA-33", "I-TMA-34", "I-TMA-35", "I-TMA-36", "I-TMA-37", "I-TMA-38", "I-TMA-39", "I-TMA-40", "I-TMA-41", "I-TMA-42", "I-TMA-43", "I-TMA-44", "I-TMA-45", "I-TMA-46", "I-TMA-47", "I-TMA-48", "I-TMA-49", "I-TMA-50", "I-TMA-51", "I-TMA-52", "I-TMA-53", "I-TMA-54", "I-TMA-55", "I-TMA-56", "I-TMA-57", "I-TMA-58", "I-TMA-59", "I-TMA-60", "I-TMA-61", "I-TMA-62", "I-TMA-63", "I-TMA-64", "I-TMA-65", "I-TMA-66", "I-TMA-67", "I-TMA-68", "I-TMA-69", "I-TMA-70", "I-TMA-71", "I-TMA-72", "I-TMA-73", "I-TMA-74", "I-TMA-75", "I-TMA-76", "I-TMA-77", "I-TMA-78", "I-TMA-79", "I-TMA-80", "I-TMA-81", "I-TMA-82", "I-TMA-83", "I-TMA-84", "I-TMA-85", "I-TMA-86", "I-TMA-88", "I-TMA-89", "I-TMA-90", "I-TMA-91", "I-TMA-92", "I-TMA-93", "I-TMA-94", "I-TMA-95", "I-TMA-96", "I-TMA-97", "I-TMA-98", "I-TMA-99", "I-TMA-100", "I-TMA-101", "I-TMA-102", "I-TMA-103", "I-TMA-104", "I-TMA-105", "I-TMA-106", "I-TMA-107", "I-TMA-109", "I-TMA-110", "I-TMA-111", "I-TMA-112", "I-TMA-113", "I-TMA-114", "I-TMA-115", "I-TMA-116", "I-TMA-117", "I-TMA-118", "I-TMA-119", "I-TMA-120", "I-TMA-121", "I-TMA-123", "I-TMA-124", "I-TMA-125", "I-TMA-126", "I-TMA-127", "I-TMA-128", "I-TMA-139", "I-TMA-140"]
      },
      methods: {
        commitIssue: (issue) => console.log(issue)
      },
      mounted(): void {
        (window as any).ISSUES = require('./issues.json');
      }
    };
  });
