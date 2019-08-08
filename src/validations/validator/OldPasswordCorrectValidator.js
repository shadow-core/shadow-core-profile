const bcrypt = require('bcryptjs');

/**
 * Check that user with this email exists.
 *
 * @param validation
 * @constructor
 */
export default function OldPasswordCorrectValidator(validation) {
  return (value, { req }) => new Promise((resolve, reject) => {
    if (!value) {
      return resolve();
    }
    validation.app.models.User.findById(req.user._id, function (err, user) {
      if (err) {
        return reject();
      } else {
        if (bcrypt.compareSync(value, user.passwordHash)) {
          return resolve();
        }

        return reject();
      }
    });
  });
}
