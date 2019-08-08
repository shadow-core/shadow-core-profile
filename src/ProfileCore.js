import { ExpressCoreBasic } from 'shadow-core-basic';

export default class ProfileCore extends ExpressCoreBasic {
  /**
   * UserCore constructor.
   *
   * @param {Object} app
   */
  constructor(app) {
    super(app);

    this.addJsonResponses('changePassword', require('./json_responses/changePassword'));
  }

  /**
   * Get user
   *
   * @param userId
   * @returns {Promise}
   */
  async getUser(userId)
  {
    const user = await this.app.models.User.findById(userId).exec();
    return user;
  }
}
