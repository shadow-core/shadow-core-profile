import { RouterBasic } from 'shadow-core-basic';

import ProfileController from '../controllers/profile';
import ProfileValidations from '../validations';
import { AuthPassportCheck } from 'shadow-core-auth';

const asyncHandler = require('express-async-handler');

export default class ProfileRouter extends RouterBasic {
  prepare() {
    this.profileController = new ProfileController(this.app);

    this.authPassportCheck = new AuthPassportCheck(this.app);

    this.validations = {
      changePassword: new ProfileValidations.ChangePasswordValidation(this.app),
    };
  }

  compile() {
    this.routeProfile();
    this.routeProfileChangePassword();
  }

  routeProfile() {
    this.app.router
      .route('/profile')
      .get(
        this.authPassportCheck.authenticate.bind(this.authPassportCheck),
        asyncHandler(this.profileController.getProfileAction.bind(this.profileController)),
      );
  }

  routeProfileChangePassword() {
    this.app.router
      .route('/profile/change_password')
      .post(
        this.authPassportCheck.authenticate.bind(this.authPassportCheck),
        this.validations.changePassword.validators(),
        this.profileController.validate.bind(this.profileController),
        asyncHandler(this.profileController.changePasswordAction.bind(this.profileController))
      );
  }
}
