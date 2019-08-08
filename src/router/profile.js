import ProfileController from '../controllers/profile';
import ProfileValidations from '../validations';
import { AuthPassportCheck } from 'shadow-core-auth';

const asyncHandler = require('express-async-handler');

/**
 * Return all default user routes for express router.
 *
 * @param {Object} router Express router
 * @param {Object} models Application models
 * @param {Object} config Additional configuration
 */
export default function (app) {
  const profileController = new ProfileController(app);
  const authPassportCheck = new AuthPassportCheck(app);

  const validations = {
    changePassword: new ProfileValidations.ChangePasswordValidation(app),
  };

  app.router
    .route('/profile')
    .get(
      authPassportCheck.authenticate.bind(authPassportCheck),
      asyncHandler(profileController.getProfileAction.bind(profileController)),
    );

  /*
  app.router
    .route('/profile/change_password')
    .post(
      authPassportCheck.authenticate,
      profileController.validate.bind(profileController),
      asyncHandler(profileController.changePasswordAction.bind(profileController))
    );
  */
}
