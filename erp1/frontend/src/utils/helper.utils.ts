export class Utils {
  constructor() {
    //
  }

  public async randomIntFromInterval(min: number, max: number) {
    return await Math.floor(Math.random() * (max - min + 1) + min);
  }

  // public static async name(params:type) {
  // }
}
