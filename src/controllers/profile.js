import { BasicController } from 'shadow-core-basic';
import ProfileCore from '../ProfileCore';

const bcrypt = require('bcryptjs');

/**
 * @class ProfileController
 * @classdesc Profile controller class.
 */
export default class ProfileController extends BasicController {
  /**
   * Constructor. Pass application to it.
   *
   * @param {Object} app The main application with models, config, etc
   */
  constructor(app) {
    super(app);
    this.core = new ProfileCore(app);
  }

  /**
   * Return profile information for authenticated user.
   *
   * @param req
   * @param res
   */
  async getProfileAction(req, res) {
    const user = req.user;
    return res.json({
      'email': user.email,
    });
  }

  /**
   * Change password action
   *
   * @param req
   * @param res
   * @returns {Promise.<void>}
   */
  async changePasswordAction(req, res) {
    let user = req.user;

    const actionParams = this.getMatchedData(req);

    user.passwordHash = bcrypt.hashSync(actionParams.newPassword, 10);
    await user.save();
    return this.returnSuccess(this.core.getJsonResponse('changePassword', 'success'), res);
  }
}
