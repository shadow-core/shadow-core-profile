/**
 * Passwords are not equal custom validator
 *
 * @return {Function}
 */
export default function PasswordCheckValidatorNotEqual() {
  return ((value, { req }) => {
    if (value && req.body.newPassword) {
      return value === req.body.newPassword;
    }
    return true;
  });
}
