export default abstract class BaseMethods {
  static async getRelationData(model: any, id: string) {
    const data = await model.findOne(id);
    if (data) {
      return data;
    }
    return null;
  }

  static async getMultiRelationData(model: any, condition: any, res: any = []) {
    const data = await model.find(condition);
    if (data) {
      return data;
    }
    return res;
  }
}
