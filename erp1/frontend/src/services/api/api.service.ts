import type { App } from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
import { User } from "@/models/user.model";
// import JwtService from "@/core/services/JwtService";

interface AxiosOptions {
  baseUrl?: string;
  token?: string;
}

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL = "http://localhost:3000/api";
  }

  // /**
  //  * @description set the default HTTP request headers
  //  */
  // public static setHeader(): void {
  //   ApiService.vueInstance.axios.defaults.headers.common[
  //     "Authorization"
  //   ] = `Token ${JwtService.getToken()}`;
  // }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static query(
    resource: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(resource, params).catch((error) => {
      throw new Error(`[KT] ApiService ${error}`);
    });
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string or object
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static get(
    resource: string | User,
    slug = "" as string
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios
      .get(`${resource}/${slug}`)
      .catch((error) => {
        throw new Error(`ApiService ${error}`);
      });
  }

  /**
   * @description set the POST HTTP request
   * @param resource: object
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static post(
    resource: string | User,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.post(`${resource}`, params);
  }

  /**
   * @description send the UPDATE HTTP request
   * @param resource: object
   * @param slug: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static update(
    resource: User,
    slug: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}/${slug}`, params);
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string or objects
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static put(
    resource: string | User,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}`, params);
  }

  /**
   * @description Send the DELETE HTTP request
   * @param resource: string
   * @returns Promise<AxiosResponse>
   */
  public static delete(resource: string): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.delete(resource).catch((error) => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  }
}

export default ApiService;
