module.exports = {
  resetPassword: (newPassword) => ({
    subject: "Reset Password ✔",
    html: `
          <p>That is your new password: <strong>${newPassword}</strong></p>
          <p>Login with your new temporary password and make sure to configure a new password once you are logged in.</p>
          <p>Login: <a href='${process.env.CLIENT_ORIGIN}/login'>click here</a></p>
          <p>Regards</p>
          <p>Kendra Form2PDF</p>
      `,
  }),
};
