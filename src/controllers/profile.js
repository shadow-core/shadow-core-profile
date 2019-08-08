import { BasicController } from 'shadow-core-basic';
import ProfileCore from '../ProfileCore';

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
    const userId = req.user._id;
    const user = await this.core.getUser(userId);
    if (!user) {
      return res.status(401).json({'success': false, 'code': 401, 'message': 'Unauthorized'});
    }
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
    let userId = req.user._id;
    let user = await this.core.getUser(userId);
    if (!user) {
      return res.status(401).json({'success': false, 'code': 401, 'message': 'Unauthorized'});
    }

    /*
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return this.returnInvalidErrors(errors.array(), res);
    }

    const _action_params = matchedData(req);
    */

    //update password and return success
    user.password_hash = bcrypt.hashSync(_action_params.new_password, 10);
    user.save();
    return this.returnSuccess(this.getJsonAnswer(_action_name).getJsonSuccess(), res);
  }
}
