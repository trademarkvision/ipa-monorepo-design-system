import axios from 'axios';
import {IssueModel} from "../models/issues";

declare const BASE_URL: string;

export default class CommonApi {

  public static async updateDashboardServiceIssue(data: IssueModel): Promise<string> {
    return axios.post(`${BASE_URL}/api/dashboard-service/issue/add`, {
      contextId: data.contextId,
      type: data.type,
      text: data.text,
      strength: data.strength
    }).then((response: { data: string }) => {
      return response.data;
    });
  }

  public static async updateDashboardServiceIssueWithHeaders(data: IssueModel): Promise<string> {
    return axios.post(`${BASE_URL}/api/dashboard-service/issue/add`, {
      contextId: data.contextId,
      type: data.type,
      text: data.text,
      strength: data.strength
    }, CommonApi.getClientHeaders())
      .then((response: { data: string }) => {
        return response.data;
      });
  }

  private static getClientHeaders() {
    const e = document.querySelector('meta[name=\'_csrf_header\']');
    const ee = document.querySelector('meta[name=\'_csrf\']');
    return {
      headers: {
        [<string>(e ? e.getAttribute('content') : '')]: ee ? ee.getAttribute('content') : ''
      }
    };
  }

}
