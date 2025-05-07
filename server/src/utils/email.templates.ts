// export const verificationEmailTemp = ({ verificationCode }) => {
//   return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Verify Your Email</title>
// </head>
// <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
//   <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
//     <h1 style="color: white; margin: 0;">Verify Your Email</h1>
//   </div>
//   <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
//     <p>Hello,</p>
//     <p>Thank you for signing up! Your verification code is:</p>
//     <div style="text-align: center; margin: 30px 0;">
//       <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">${verificationCode}</span>
//     </div>
//     <p>Enter this code on the verification page to complete your registration.</p>
//     <p>This code will expire in 15 minutes for security reasons.</p>
//     <p>If you didn't create an account with us, please ignore this email.</p>
//     <p>Best regards,<br>Your App Team</p>
//   </div>
//   <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
//     <p>This is an automated message, please do not reply to this email.</p>
//   </div>
// </body>
// </html>
// `;
// };

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

export const passResetSuccessTemp = () => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Successful</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <p>Hello,</p>
        <p>We're writing to confirm that your password has been successfully reset.</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
            ✓
          </div>
        </div>
        <p>If you did not initiate this password reset, please contact our support team immediately.</p>
        <p>For security reasons, we recommend that you:</p>
        <ul>
          <li>Use a strong, unique password</li>
          <li>Enable two-factor authentication if available</li>
          <li>Avoid using the same password across multiple sites</li>
        </ul>
        <p>Thank you for helping us keep your account secure.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
        <p>This is an automated message, please do not reply to this email.</p>
      </div>
    </body>
    </html>
    `;
}

export const passResetReqTemp = ({ resetURL }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">Password Reset</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <p>Hello,</p>
      <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
      <p>To reset your password, click the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>
      <p>This link will expire in 1 hour for security reasons.</p>
      <p>Best regards,<br>Your App Team</p>
    </div>
    <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </body>
  </html>
  `;
}

export const welcomeEmailTemp = () => {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"><head><meta charset="UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport"><meta name="x-apple-disable-message-reformatting"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta content="telephone=no" name="format-detection"><title>New email template 2025-04-13</title> <!--[if (mso 16)]><style type="text/css"> a {text-decoration: none;}  </style><![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style>
<![endif]--><!--[if !mso]><!-- --><link href="https://fonts.googleapis.com/css?family=Montserrat:500,800" rel="stylesheet"><!--<![endif]--><!--[if gte mso 9]><noscript> <xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> </noscript><![endif]--><!--[if mso]><xml> <w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word"> <w:DontUseAdvancedTypographyReadingMail/> </w:WordDocument> </xml>
<![endif]--><style type="text/css">.rollover:hover .rollover-first { max-height:0px!important; display:none!important;}.rollover:hover .rollover-second { max-height:none!important; display:block!important;}.rollover span { font-size:0px;}u + .body img ~ div div { display:none;}#outlook a { padding:0;}span.MsoHyperlink,span.MsoHyperlinkFollowed { color:inherit; mso-style-priority:99;}a.es-button { mso-style-priority:100!important; text-decoration:none!important;}a[x-apple-data-detectors],#MessageViewBody a { color:inherit!important; text-decoration:none!important; font-size:inherit!important; font-family:inherit!important; font-weight:inherit!important; line-height:inherit!important;}.es-desk-hidden { display:none; float:left; overflow:hidden; width:0; max-height:0; line-height:0; mso-hide:all;}a.es-button:hover { border-color:#2CB543!important; background:#2CB543!important;}
a.es-secondary:hover { border-color:#ffffff!important; background:#ffffff!important;}@media only screen and (max-width:600px) {.es-m-p20b { padding-bottom:20px!important } .es-p-default { } *[class="gmail-fix"] { display:none!important } p, a { line-height:150%!important } h1, h1 a { line-height:120%!important } h2, h2 a { line-height:120%!important } h3, h3 a { line-height:120%!important } h4, h4 a { line-height:120%!important } h5, h5 a { line-height:120%!important } h6, h6 a { line-height:120%!important } .es-header-body p { } .es-content-body p { } .es-footer-body p { } .es-infoblock p { } h1 { font-size:30px!important; text-align:center } h2 { font-size:26px!important; text-align:center } h3 { font-size:20px!important; text-align:center } h4 { font-size:24px!important; text-align:left } h5 { font-size:20px!important; text-align:left } h6 { font-size:16px!important; text-align:left }
 .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a { font-size:24px!important } .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a { font-size:20px!important } .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a { font-size:16px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body a { font-size:16px!important } .es-content-body p, .es-content-body a { font-size:16px!important } .es-footer-body p, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock a { font-size:12px!important }
 .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 { text-align:right!important } .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 { text-align:justify!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second { display:inline!important }
 .es-m-txt-r .rollover span, .es-m-txt-c .rollover span, .es-m-txt-l .rollover span { line-height:0!important; font-size:0!important; display:block } .es-spacer { display:inline-table } a.es-button, button.es-button { font-size:16px!important; padding:10px 20px 10px 20px!important; line-height:120%!important } a.es-button, button.es-button, .es-button-border { display:block!important } .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button { display:block!important } .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu { display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .adapt-img { width:100%!important; height:auto!important } .es-mobile-hidden, .es-hidden { display:none!important }
 .es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } .h-auto { height:auto!important } u + #body { width:100vw!important } }@media screen and (max-width:384px) {.mail-message-content { width:414px!important } }</style>
 </head> <body class="body" style="width:100%;height:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"><div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#F7F7F7"><!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#F7F7F7"></v:fill> </v:background><![endif]--><table cellpadding="0" cellspacing="0" width="100%" class="es-wrapper" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#F7F7F7"><tr style="border-collapse:collapse">
<td valign="top" style="padding:0;Margin:0"><table cellpadding="0" cellspacing="0" align="center" class="es-header" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:#34265F;background-repeat:repeat;background-position:center bottom"><tr style="border-collapse:collapse">
<td align="center" bgcolor="#34265f" background="https://fujzbbc.stripocdn.email/content/guids/CABINET_3a7a698c62586f3eb3e12df4199718b8/images/6941564382201394.png" style="padding:0;Margin:0;background-image:url(https://fujzbbc.stripocdn.email/content/guids/CABINET_3a7a698c62586f3eb3e12df4199718b8/images/6941564382201394.png);background-color:#34265f;background-position:center bottom;background-repeat:repeat"><table cellspacing="0" cellpadding="0" align="center" bgcolor="transparent" class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" role="none"><tr style="border-collapse:collapse">
<td align="left" style="padding:0;Margin:0;padding-top:10px;padding-right:15px;padding-left:15px;background-position:center bottom"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" valign="top" style="padding:0;Margin:0;width:570px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="left" class="es-infoblock" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:Montserrat, Helvetica, Roboto, Arial, sans-serif;line-height:18px;letter-spacing:0;color:#cccccc;font-size:12px">Put your preheader text here</p> </td></tr></table></td></tr></table></td></tr>
 <tr style="border-collapse:collapse"><td align="left" style="Margin:0;padding-top:20px;padding-right:20px;padding-bottom:25px;padding-left:20px;background-position:center bottom"><table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td valign="top" align="center" style="padding:0;Margin:0;width:560px"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:center bottom" role="presentation"><tr style="border-collapse:collapse">
<td align="center" class="es-m-txt-c" style="padding:0;Margin:0;font-size:0"><a href="https://viewstripo.email/" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px"><img src="https://fujzbbc.stripocdn.email/content/guids/CABINET_84164752b8a377d5e94cfc0e1ea2c8e6/images/67161515063402891.png" alt="Hummingbird logo" title="Hummingbird logo" width="94" height="61" style="display:block;font-size:16px;border:0;outline:none;text-decoration:none"></a> </td></tr></table></td></tr></table></td></tr></table></td></tr></table> <table cellpadding="0" cellspacing="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important"><tr style="border-collapse:collapse">
<td align="center" style="padding:0;Margin:0"><table bgcolor="#ffffff" align="center" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:30px;padding-left:30px;background-position:center bottom"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" valign="top" style="padding:0;Margin:0;width:540px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse">
<td align="left" style="padding:0;Margin:0;padding-bottom:5px"><h1 style="Margin:0;font-family:Montserrat, Helvetica, Roboto, Arial, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:32px;font-style:normal;font-weight:bold;line-height:38.4px;color:#4A4A4A">Thank you for signing up!</h1> </td></tr></table></td></tr></table></td></tr> <tr style="border-collapse:collapse"><td align="left" style="Margin:0;padding-top:20px;padding-right:30px;padding-left:30px;padding-bottom:20px"><!--[if mso]><table style="width:540px" cellpadding="0" cellspacing="0"><tr><td style="width:156px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"><tr style="border-collapse:collapse">
<td align="left" class="es-m-p20b" style="padding:0;Margin:0;width:156px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0;font-size:0"><a target="_blank" href="https://viewstripo.email" style="mso-line-height-rule:exactly;text-decoration:underline;color:#3B2495;font-size:16px"><img src="https://fujzbbc.stripocdn.email/content/guids/fd4148ea-39df-4501-b78c-da6a6a7e3802/images/ali.jpg" alt="" width="156" class="adapt-img" style="display:block;font-size:16px;border:0;outline:none;text-decoration:none" height="156"></a> </td></tr></table></td></tr></table> <!--[if mso]></td><td style="width:20px"></td>
<td style="width:364px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;width:364px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-top:10px"><h3 class="es-m-txt-l" style="Margin:0;font-family:Montserrat, Helvetica, Roboto, Arial, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:17px;font-style:normal;font-weight:bold;line-height:20.4px;color:#4A4A4A">Hello Ivan!</h3></td></tr> <tr style="border-collapse:collapse">
<td align="left" style="padding:0;Margin:0;padding-top:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:Montserrat, Helvetica, Roboto, Arial, sans-serif;line-height:25.5px;letter-spacing:0;color:#4A4A4A;font-size:17px">Welcome to <a target="_blank" href="https://viewstripo.email/" style="mso-line-height-rule:exactly;text-decoration:underline;color:#3B2495;font-size:17px">“Our blog readers”</a> society. My name is Daria and I’m emailing you to let you know what to expect in our newsletters.</p></td></tr></table></td></tr></table><!--[if mso]></td></tr></table><![endif]--></td></tr></table></td></tr></table> <table cellpadding="0" cellspacing="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important"></table>
 <table cellpadding="0" cellspacing="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0"><table bgcolor="#ffffff" align="center" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:30px;padding-left:30px"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse">
<td align="center" valign="top" style="padding:0;Margin:0;width:540px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:Montserrat, Helvetica, Roboto, Arial, sans-serif;line-height:24px;letter-spacing:0;color:#4A4A4A;font-size:16px">I recommend that look through our recent blog posts on Blogly:</p> </td></tr></table></td></tr></table></td></tr> <tr class="es-visible-simple-html-only" style="border-collapse:collapse"><td align="left" class="es-struct-html" style="padding:0;Margin:0;padding-top:20px;padding-bottom:10px;background-position:left bottom"><!--[if mso]><table style="width:600px" cellpadding="0" cellspacing="0"><tr>
<td style="width:293px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"><tr style="border-collapse:collapse"><td align="left" class="es-m-p20b" style="padding:0;Margin:0;width:293px"><table cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" class="shadow" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#ffffff;border-radius:13px" role="presentation"><tr style="border-collapse:collapse">
<td align="center" style="padding:0;Margin:0;font-size:0"><a target="_blank" href="https://viewstripo.email" style="mso-line-height-rule:exactly;text-decoration:underline;color:#3B2495;font-size:16px"><img src="https://stripo.email/photos/shares/Blog//Stripo_Building-AMP-Emails-with-Stripo_Featured-Image.jpg" alt="" width="293" class="adapt-img" style="display:block;font-size:16px;border:0;outline:none;text-decoration:none;border-radius:13px 13px 0 0" height="104"></a> </td></tr><tr style="border-collapse:collapse">
<td align="left" style="Margin:0;padding-top:10px;padding-right:15px;padding-left:15px;padding-bottom:10px"><h3 class="es-m-txt-l" style="Margin:0;font-family:Montserrat, Helvetica, Roboto, Arial, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:20px;font-style:normal;font-weight:bold;line-height:30px;color:#4a4a4a"><a target="_blank" href="https://viewstripo.email/" style="mso-line-height-rule:exactly;text-decoration:none;color:#4a4a4a;font-size:20px">How to Build AMP Emails with Stripo</a></h3></td></tr> <tr style="border-collapse:collapse">
<td align="left" style="Margin:0;padding-top:10px;padding-right:15px;padding-left:15px;padding-bottom:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:Montserrat, Helvetica, Roboto, Arial, sans-serif;line-height:22.5px;letter-spacing:0;color:#4A4A4A;font-size:15px">Wanna keep up with the times and send AMP-powered emails over to your recipients? Gmail in its AMP emails guidelines specified that when building such...</p></td></tr><tr style="border-collapse:collapse"><td align="center" height="16" style="padding:0;Margin:0"></td></tr> <tr style="border-collapse:collapse">
<td align="left" style="padding:0;Margin:0;padding-right:15px;padding-left:15px;padding-bottom:15px"><h5 style="Margin:0;font-family:Montserrat, Helvetica, Roboto, Arial, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:16px;font-style:normal;font-weight:normal;line-height:19.2px;color:#3b2495"><a target="_blank" href="https://viewstripo.email/" style="mso-line-height-rule:exactly;text-decoration:none;color:#3B2495;font-size:15px">Read more ➟</a></h5></td></tr></table></td></tr></table> <!--[if mso]></td><td style="width:15px"></td><td style="width:292px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right"><tr style="border-collapse:collapse">
<td align="left" class="es-m-p20b" style="padding:0;Margin:0;width:292px"><table cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" class="shadow" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#ffffff;border-radius:13px" role="presentation"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0;font-size:0"><a target="_blank" href="https://stripo.email/blog/how-to-design-a-perfect-appointment-confirmation-email/" style="mso-line-height-rule:exactly;text-decoration:underline;color:#3B2495;font-size:16px"><img src="https://stripo.email/photos/shares/Blog//Stripo_How-to-Design-a-Perfect-Appointment-Confirmation-Email_Featured-Image.jpg" alt="" width="292" class="adapt-img" style="display:block;font-size:16px;border:0;outline:none;text-decoration:none;width:292px;border-radius:13px 13px 0 0" height="104"></a> </td></tr>
<tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-top:10px;padding-right:15px;padding-left:15px"><h3 class="es-m-txt-l" style="Margin:0;font-family:Montserrat, Helvetica, Roboto, Arial, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:20px;font-style:normal;font-weight:bold;line-height:30px;color:#4a4a4a"><a target="_blank" href="https://stripo.email/blog/how-to-design-a-perfect-appointment-confirmation-email/" style="mso-line-height-rule:exactly;text-decoration:none;color:#4a4a4a;font-size:20px">How to Design a Perfect Appointment Confirmation Email</a></h3></td></tr> <tr style="border-collapse:collapse">
<td align="left" style="Margin:0;padding-top:10px;padding-right:15px;padding-left:15px;padding-bottom:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:Montserrat, Helvetica, Roboto, Arial, sans-serif;line-height:22.5px;letter-spacing:0;color:#4A4A4A;font-size:15px">Your sales email worked pretty well and your potential client has agreed to meet you? You’re just halfway there. Anyone can forget about the meeting. A...</p></td></tr><tr style="border-collapse:collapse"><td align="center" height="16" style="padding:0;Margin:0"></td></tr> <tr style="border-collapse:collapse">
<td align="left" style="padding:0;Margin:0;padding-right:15px;padding-left:15px;padding-bottom:15px"><h5 style="Margin:0;font-family:Montserrat, Helvetica, Roboto, Arial, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:16px;font-style:normal;font-weight:normal;line-height:19.2px;color:#3b2495"><a target="_blank" href="https://stripo.email/blog/how-to-design-a-perfect-appointment-confirmation-email/" style="mso-line-height-rule:exactly;text-decoration:none;color:#3B2495;font-size:15px">Read more ➟</a></h5></td></tr></table></td></tr></table><!--[if mso]></td></tr></table><![endif]--></td></tr></table></td></tr></table> <table cellpadding="0" cellspacing="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important"><tr style="border-collapse:collapse">
<td align="center" style="padding:0;Margin:0"><table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"></table></td></tr></table> <table cellpadding="0" cellspacing="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0"><table bgcolor="#ffffff" align="center" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"><tr style="border-collapse:collapse">
<td align="left" style="Margin:0;padding-bottom:25px;padding-right:30px;padding-left:30px;padding-top:15px;background-position:center bottom"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" valign="top" style="padding:0;Margin:0;width:540px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse">
<td align="center" style="padding:0;Margin:0;padding-top:10px"><p class="es-m-txt-l" style="Margin:0;mso-line-height-rule:exactly;font-family:Montserrat, Helvetica, Roboto, Arial, sans-serif;line-height:21px;letter-spacing:0;color:#4A4A4A;font-size:14px">If you have any questions or suggestions, please <a target="_blank" href="mailto:your@mail.com" style="mso-line-height-rule:exactly;text-decoration:underline;color:#3B2495;font-size:14px">email us</a> or contact via Intercom - we will be happy to assist you!</p> </td></tr></table></td></tr></table></td></tr></table></td></tr></table>
 <table cellpadding="0" cellspacing="0" align="center" background="https://fujzbbc.stripocdn.email/content/guids/CABINET_3a7a698c62586f3eb3e12df4199718b8/images/75021564382669317.png" class="es-footer" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:#F7F7F7;background-image:url(https://fujzbbc.stripocdn.email/content/guids/CABINET_3a7a698c62586f3eb3e12df4199718b8/images/75021564382669317.png);background-repeat:repeat;background-position:center top"><tr style="border-collapse:collapse">
<td align="center" bgcolor="transparent" style="padding:0;Margin:0;background-color:transparent;background-position:left top"><table bgcolor="transparent" align="center" cellpadding="0" cellspacing="0" class="es-footer-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" role="none"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-bottom:5px;padding-top:30px"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse">
<td align="center" valign="top" style="padding:0;Margin:0;width:600px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" height="3" style="padding:0;Margin:0"></td> </tr></table></td></tr></table></td></tr></table></td></tr></table> <table cellpadding="0" cellspacing="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important"><tr style="border-collapse:collapse">
<td align="center" bgcolor="#333333" style="padding:0;Margin:0;background-color:#333333"><table bgcolor="#00000000" align="center" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-top:40px;padding-bottom:30px"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" valign="top" style="padding:0;Margin:0;width:600px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse">
<td align="center" class="es-m-txt-c" style="padding:0;Margin:0;font-size:0"><table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><a target="_blank" href="https://viewstripo.email/" style="mso-line-height-rule:exactly;text-decoration:underline;color:#3B2495;font-size:16px"><img title="Facebook" src="https://fujzbbc.stripocdn.email/content/assets/img/social-icons/logo-white/facebook-logo-white.png" alt="Fb" width="32" height="32" style="display:block;font-size:16px;border:0;outline:none;text-decoration:none"></a> </td>
<td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><a target="_blank" href="https://viewstripo.email/" style="mso-line-height-rule:exactly;text-decoration:underline;color:#3B2495;font-size:16px"><img title="Youtube" src="https://fujzbbc.stripocdn.email/content/assets/img/social-icons/logo-white/youtube-logo-white.png" alt="Yt" width="32" height="32" style="display:block;font-size:16px;border:0;outline:none;text-decoration:none"></a></td><td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><a target="_blank" href="https://viewstripo.email/" style="mso-line-height-rule:exactly;text-decoration:underline;color:#3B2495;font-size:16px"><img title="Instagram" src="https://fujzbbc.stripocdn.email/content/assets/img/social-icons/logo-white/instagram-logo-white.png" alt="Ig" width="32" height="32" style="display:block;font-size:16px;border:0;outline:none;text-decoration:none"></a></td>
 <td align="center" valign="top" style="padding:0;Margin:0"><a target="_blank" href="https://viewstripo.email/" style="mso-line-height-rule:exactly;text-decoration:underline;color:#3B2495;font-size:16px"><img title="Linkedin" src="https://fujzbbc.stripocdn.email/content/assets/img/social-icons/logo-white/linkedin-logo-white.png" alt="In" width="32" height="32" style="display:block;font-size:16px;border:0;outline:none;text-decoration:none"></a></td></tr></table></td></tr></table></td></tr></table></td></tr> <tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-right:30px;padding-left:30px;padding-bottom:30px;background-position:center bottom"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse">
<td align="center" valign="top" style="padding:0;Margin:0;width:540px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" class="es-infoblock" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:Montserrat, Helvetica, Roboto, Arial, sans-serif;line-height:18px;letter-spacing:0;color:#CCCCCC;font-size:12px">You are receiving this email because you have visited our site or asked us about regular newsletter. If you wish to unsubscribe from our newsletter, <a target="_blank" class="unsubscribe" style="mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px;line-height:18px" href="">click here</a>.</p> </td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></div></body></html>
  `
}

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
}
