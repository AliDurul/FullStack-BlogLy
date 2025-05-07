import { ENV } from '../configs/env';

export const verificationEmailTemp = ({ verificationCode }) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
</head>

<body
  style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; max-width: 600px; margin: 0 auto; padding: 0;">

  <!-- Header with Logo -->
  <div style="text-align: center; padding: 30px 0; background-color: #4CAF50;">
    <!-- <img src="${ENV.backendUrl}/uploads/logo.png" alt="Your App Logo" style="width: 120px; height: auto; margin-bottom: 10px;" />  -->
    <h1 style="margin: 0; color: #ffffff;">Verify Your Email</h1>
  </div>

  <!-- Body -->
  <div
    style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
    <p>Hello,</p>
    <p>Thank you for signing up! Please verify your email by clicking the button below:</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${ENV.frontendUrl}/auth/verify-email?verification-code=${verificationCode}"
        style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Verify Email
      </a>
    </div>

    <p>This link will expire in 2 hours for security reasons.</p>
    <p>If you didn't create an account, you can safely ignore this email.</p>
    <p>Best regards,<br />Ali Durul</p>
  </div>

  <!-- Footer with Social Links -->
  <div style="text-align: center; padding: 20px 0; background-color: #f0f0f0;">
    <p style="color: #666; font-size: 0.9em; margin-bottom: 10px;">Stay connected with me</p>
    <div style="margin-bottom: 10px;">
      <a href="https://linkedin.com/in/ali-durul" target="_blank" style="margin: 0 10px; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/24/733/733561.png" alt="LinkedIn" />
      </a>
      <a href="https://github.com/AliDurul" target="_blank" style="margin: 0 10px; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/24/733/733553.png" alt="GitHub" />
      </a>
    </div>
    <p style="color: #999; font-size: 0.8em;">This is an automated message. Please do not reply.</p>
  </div>

</body>
</html>
`;
};

export const passResetReqTemp = ({ resetURL }) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset</title>
</head>

<body
  style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; max-width: 600px; margin: 0 auto; padding: 0;">

  <!-- Header with Logo -->
  <div style="text-align: center; padding: 30px 0; background-color: #4CAF50;">
    <!-- <img src="\${ENV.backendUrl}/uploads/logo.png" alt="Your App Logo" style="width: 120px; height: auto; margin-bottom: 10px;" /> -->
    <h1 style="margin: 0; color: #ffffff;">Password Reset</h1>
  </div>

  <!-- Body -->
  <div
    style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn’t make this request, you can safely ignore this email.</p>

    <p>To reset your password, simply click the button below:</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetURL}"
        style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; cursor: pointer;">
        Reset Password
      </a>
    </div>

    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Stay safe,<br />Ali Durul</p>
  </div>

  <!-- Footer with Social Links -->
  <div style="text-align: center; padding: 20px 0; background-color: #f0f0f0;">
    <p style="color: #666; font-size: 0.9em; margin-bottom: 10px;">Stay connected with me</p>
    <div style="margin-bottom: 10px;">
      <a href="https://linkedin.com/in/ali-durul" target="_blank" style="margin: 0 10px; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/24/733/733561.png" alt="LinkedIn" />
      </a>
      <a href="https://github.com/AliDurul" target="_blank" style="margin: 0 10px; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/24/733/733553.png" alt="GitHub" />
      </a>
    </div>
    <p style="color: #999; font-size: 0.8em;">This is an automated message. Please do not reply.</p>
  </div>

</body>
</html>
`;
};

export const passResetSuccessTemp = () => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset Successful</title>
</head>

<body
  style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; max-width: 600px; margin: 0 auto; padding: 0;">

  <!-- Header -->
  <div style="text-align: center; padding: 30px 0; background-color: #4CAF50;">
    <h1 style="margin: 0; color: #ffffff;">Password Reset Successful</h1>
  </div>

  <!-- Body -->
  <div
    style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
    <p>Hello,</p>
    <p>This is a confirmation that your password has been successfully reset.</p>

    <div style="text-align: center; margin: 30px 0;">
      <div
        style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>

    <p>If you did not initiate this change, please contact our support team immediately.</p>

    <p>To keep your account secure, we recommend:</p>
    <ul>
      <li>Using a strong, unique password</li>
      <li>Enabling two-factor authentication</li>
      <li>Avoiding reuse of passwords across sites</li>
    </ul>

    <p>Thank you for keeping your account secure.</p>
    <p>Best regards,<br />Ali Durul</p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; padding: 20px 0; background-color: #f0f0f0;">
    <p style="color: #666; font-size: 0.9em; margin-bottom: 10px;">Stay connected with me</p>
    <div style="margin-bottom: 10px;">
      <a href="https://linkedin.com/in/ali-durul" target="_blank" style="margin: 0 10px; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/24/733/733561.png" alt="LinkedIn" />
      </a>
      <a href="https://github.com/AliDurul" target="_blank" style="margin: 0 10px; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/24/733/733553.png" alt="GitHub" />
      </a>
    </div>
    <p style="color: #999; font-size: 0.8em;">This is an automated message. Please do not reply.</p>
  </div>

</body>
</html>
`;
};

export const welcomeEmailTemp = ({ name }) => {
  return `
  <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Blogly</title>
</head>

<body
  style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; max-width: 600px; margin: 0 auto; padding: 0;">

  <!-- Header with Logo -->
  <div style="text-align: center; padding: 30px 0; background-color: #4CAF50;">
    <!-- <img src="${ENV.backendUrl}/uploads/logo.png" alt="Blogly Logo" style="width: 120px; height: auto; margin-bottom: 10px;" /> -->
    <h1 style="margin: 0; color: #ffffff;">Welcome ${name} to Blogly!</h1>
  </div>

  <!-- Body -->
  <div
    style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
    <p>Hey there 👋</p>
    <p>Welcome to <strong>Blogly</strong> – your new space to share ideas, stories, and experiences with the world!</p>

    <p>Start by creating your very first post and tell us what you're passionate about. Whether it’s tech, travel, food, or thoughts on life – Blogly is the perfect place to express yourself.</p>

    <p>Need inspiration? Here are a couple of trending blogs you might like:</p>
    <ul>
      <li><a href="${ENV.frontendUrl}/blog/frontend-developer-roadmap-202511" target="_blank">Frontend Developer Roadmap 2025</a></li>
      <li><a href="${ENV.frontendUrl}/blog/backend-developer-roadmap-2025vh" target="_blank">Backend Developer Roadmap 2025</a></li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${ENV.frontendUrl}/editor"
        style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; cursor: pointer;">
        Create Your First Post
      </a>
    </div>

    <p>We're excited to have you on board. Let's make the blogosphere a little more interesting – together!</p>
    <p>Cheers,<br />Ali Durul</p>
  </div>

  <!-- Footer with Social Links -->
  <div style="text-align: center; padding: 20px 0; background-color: #f0f0f0;">
    <p style="color: #666; font-size: 0.9em; margin-bottom: 10px;">Stay connected with me</p>
    <div style="margin-bottom: 10px;">
      <a href="https://linkedin.com/in/ali-durul" target="_blank" style="margin: 0 10px; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/24/733/733561.png" alt="LinkedIn" />
      </a>
      <a href="https://github.com/AliDurul" target="_blank" style="margin: 0 10px; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/24/733/733553.png" alt="GitHub" />
      </a>
    </div>
    <p style="color: #999; font-size: 0.8em;">This is an automated message. Please do not reply.</p>
  </div>

</body>
</html>
  `
};

export const errorEmailTemp = (error) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error Notification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #FF5722, #E64A19); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Error Notification</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Dear Developer,</p>
    <p>An error has occurred in the application:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 24px; font-weight: bold; color: #FF5722;">Error Code: ${error.statusCode}</span>
    </div>
    <p style="font-size: 16px; color: #E64A19;">${error.message}</p>
    <p style="font-size: 16px; color: #E64A19;">${error.stack}</p>
    <p>Please investigate and resolve the issue as soon as possible.</p>
    <p>Thank you for your attention.</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;
};
