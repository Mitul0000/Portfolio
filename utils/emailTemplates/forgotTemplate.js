const dotenv = require('dotenv');
dotenv.config();

exports.forgotPasswordTemplate = (user, resetLink) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password</title>
</head>
<body style="margin:0; padding:0; background-color:#0f0f0f; font-family: 'Segoe UI', Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0"
    style="background-color:#0f0f0f; padding: 40px 20px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0"
          style="background-color:#1a1a1a; border-radius:16px;
                 overflow:hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.4);">

          <!-- Top Orange Bar -->
          <tr>
            <td style="background: linear-gradient(90deg, #f59e0b, #d97706);
                        height: 6px; font-size:0;">
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px;">

              <!-- Icon Circle -->
              <div style="width:72px; height:72px;
                          background:rgba(245,158,11,0.15);
                          border-radius:50%; display:inline-block;
                          line-height:72px; text-align:center;
                          border: 2px solid rgba(245,158,11,0.4);">
                <span style="font-size:32px;">🔓</span>
              </div>

              <h1 style="color:#f59e0b; font-size:22px; font-weight:700;
                          margin:20px 0 6px 0; letter-spacing:0.5px;">
                Reset Your Password
              </h1>
              <p style="color:#888888; font-size:13px; margin:0;">
                We received a request to reset your password
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height:1px; background:rgba(255,255,255,0.06);"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px 40px;">

              <p style="color:#cccccc; font-size:15px;
                         line-height:1.7; margin:0 0 20px 0;">
                Hi <strong style="color:#ffffff;">${user.firstName}</strong>,
              </p>

              <p style="color:#cccccc; font-size:15px;
                         line-height:1.7; margin:0 0 28px 0;">
                Someone requested a password reset for your account
                <strong style="color:#ffffff;">${user.email}</strong>.
                Click the button below to set a new password.
                This link is valid for
                <strong style="color:#f59e0b;">5 minutes only.</strong>
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${resetLink}"
                      style="display:inline-block;
                              background: linear-gradient(135deg, #f59e0b, #d97706);
                              color:#ffffff; font-size:15px; font-weight:600;
                              text-decoration:none; padding:14px 40px;
                              border-radius:8px; letter-spacing:0.5px;">
                      🔑 &nbsp; Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:rgba(255,255,255,0.03);
                        border:1px solid rgba(255,255,255,0.08);
                        border-radius:12px; margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="color:#888888; font-size:12px;
                               margin:0 0 8px 0;">
                      Button not working? Copy and paste this link:
                    </p>
                    <p style="color:#4f8ef7; font-size:12px;
                               margin:0; word-break:break-all;">
                      ${resetLink}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Warning Box -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:rgba(255,170,0,0.06);
                        border:1px solid rgba(255,170,0,0.2);
                        border-radius:12px; margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="color:#ffaa00; font-size:13px;
                               margin:0; line-height:1.7;">
                      ⚠️ &nbsp;If you did not request this, please ignore
                      this email. Your password will remain unchanged
                      and no further action is needed.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height:1px; background:rgba(255,255,255,0.06);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 40px;">
              <p style="color:#555555; font-size:12px;
                         line-height:1.7; margin:0 0 8px 0;">
                This is an automated message from
                <strong style="color:#666666;">${process.env.APP_NAME}</strong>.
                Please do not reply to this email.
              </p>
              <p style="color:#444444; font-size:11px; margin:0;">
                © ${new Date().getFullYear()} ${process.env.APP_NAME}
                &nbsp;·&nbsp;
                <a href="${process.env.FRONTEND_URL}/support"
                  style="color:#555555; text-decoration:none;">
                  Support
                </a>
              </p>
            </td>
          </tr>

          <!-- Bottom Orange Bar -->
          <tr>
            <td style="background: linear-gradient(90deg, #d97706, #f59e0b);
                        height: 4px; font-size:0;">
            </td>
          </tr>

        </table>
        <!-- End Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;