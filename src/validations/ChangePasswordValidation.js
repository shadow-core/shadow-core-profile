import { BasicValidatorInterface } from 'shadow-core-basic';
import OldPasswordCorrectValidator from './validator/OldPasswordCorrectValidator';
import PasswordCheckValidatorNotEqual from './validator/PasswordCheckValidatorNotEqual';

const { body } = require('express-validator/check');
const jsonResponses = require('../json_responses/changePassword');

export default class ChangePasswordValidation extends BasicValidatorInterface {
  validators() {
    return [
      body('oldPassword')
        .not().isEmpty().withMessage(jsonResponses.errors.oldPassword.empty)
        .custom(OldPasswordCorrectValidator(this)).withMessage(jsonResponses.errors.oldPassword.incorrect),
      body('newPassword')
        .not().isEmpty().withMessage(jsonResponses.errors.newPassword.empty),
      body('newPasswordCheck')
        .not().isEmpty().withMessage(jsonResponses.errors.newPasswordCheck.empty)
        .custom(PasswordCheckValidatorNotEqual(this)).withMessage(jsonResponses.errors.newPasswordCheck.notEqual)
    ];
  }
}
