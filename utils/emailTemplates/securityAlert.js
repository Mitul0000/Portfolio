//Takes in user and otp, returns a beautifully designed HTML email template for security alert
const dotenv = require('dotenv');
dotenv.config();
exports.alertTemplate = (user, req) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Security Alert</title>
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

          <!-- Top Red Bar -->
          <tr>
            <td style="background: linear-gradient(90deg, #ff4444, #cc0000);
                        height: 6px; font-size:0;">
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center"
              style="padding: 40px 40px 20px 40px;">

              <!-- Shield Icon -->
              <div style="width:72px; height:72px; background:rgba(255,68,68,0.15);
                          border-radius:50%; display:inline-block;
                          line-height:72px; text-align:center;
                          border: 2px solid rgba(255,68,68,0.4);">
                <span style="font-size:32px;">🛡️</span>
              </div>

              <h1 style="color:#ff4444; font-size:22px; font-weight:700;
                          margin:20px 0 6px 0; letter-spacing:0.5px;">
                Security Alert
              </h1>
              <p style="color:#888888; font-size:13px; margin:0;">
                Unauthorized access attempt detected
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
                Hi <strong style="color:#ffffff;">${user.name}</strong>,
              </p>

              <p style="color:#cccccc; font-size:15px;
                         line-height:1.7; margin:0 0 24px 0;">
                We detected suspicious activity on your account.
                Someone attempted to reuse an <strong style="color:#ff4444;">
                already consumed session token</strong>, which may indicate
                that your session was compromised.
              </p>

              <!-- Alert Box -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:rgba(255,68,68,0.08);
                        border:1px solid rgba(255,68,68,0.25);
                        border-radius:12px; margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="color:#ff6666; font-size:13px;
                               font-weight:600; margin:0 0 14px 0;
                               text-transform:uppercase; letter-spacing:1px;">
                      ⚠ &nbsp;Incident Details
                    </p>

                    <!-- Detail Row -->
                    <table width="100%" cellpadding="0" cellspacing="0">

                      <tr>
                        <td style="padding: 6px 0; border-bottom:
                                    1px solid rgba(255,255,255,0.05);">
                          <span style="color:#777777; font-size:13px;">
                            👤 &nbsp;Account
                          </span>
                        </td>
                        <td align="right" style="padding: 6px 0; border-bottom:
                                    1px solid rgba(255,255,255,0.05);">
                          <span style="color:#ffffff; font-size:13px;
                                        font-weight:500;">
                            ${user.email}
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding: 6px 0; border-bottom:
                                    1px solid rgba(255,255,255,0.05);">
                          <span style="color:#777777; font-size:13px;">
                            🕐 &nbsp;Time
                          </span>
                        </td>
                        <td align="right" style="padding: 6px 0; border-bottom:
                                    1px solid rgba(255,255,255,0.05);">
                          <span style="color:#ffffff; font-size:13px;
                                        font-weight:500;">
                            ${new Date().toLocaleString()}
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding: 6px 0; border-bottom:
                                    1px solid rgba(255,255,255,0.05);">
                          <span style="color:#777777; font-size:13px;">
                            🌍 &nbsp;IP Address
                          </span>
                        </td>
                        <td align="right" style="padding: 6px 0; border-bottom:
                                    1px solid rgba(255,255,255,0.05);">
                          <span style="color:#ffffff; font-size:13px;
                                        font-weight:500;">
                            ${req.headers["x-forwarded-for"] || req.ip}
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding: 6px 0;">
                          <span style="color:#777777; font-size:13px;">
                            🖥 &nbsp;Device
                          </span>
                        </td>
                        <td align="right" style="padding: 6px 0;">
                          <span style="color:#ffffff; font-size:13px;
                                        font-weight:500;">
                            ${req.headers["user-agent"]}
                          </span>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>

              <!-- What we did -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:rgba(255,255,255,0.03);
                        border:1px solid rgba(255,255,255,0.08);
                        border-radius:12px; margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="color:#aaaaaa; font-size:13px;
                               font-weight:600; margin:0 0 14px 0;
                               text-transform:uppercase; letter-spacing:1px;">
                      🔒 &nbsp;What We Did
                    </p>
                    <ul style="color:#cccccc; font-size:14px;
                                line-height:1.9; margin:0; padding-left:18px;">
                      <li>Immediately <strong style="color:#ffffff;">
                        terminated your active session</strong></li>
                      <li>Invalidated <strong style="color:#ffffff;">
                        all session tokens</strong> for your account</li>
                      <li>Flagged the activity for
                        <strong style="color:#ffffff;">security review</strong></li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- What to do -->
              <p style="color:#aaaaaa; font-size:13px; font-weight:600;
                         text-transform:uppercase; letter-spacing:1px;
                         margin:0 0 12px 0;">
                ✅ &nbsp;What You Should Do
              </p>
              <ul style="color:#cccccc; font-size:14px;
                          line-height:1.9; margin:0 0 28px 0;
                          padding-left:18px;">
                <li>Login again with your credentials</li>
                <li>Change your password immediately</li>
                <li>Check for any unauthorized activity</li>
                <li>If this was you — you may safely ignore this</li>
              </ul>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${process.env.FRONTEND_URL}/login"
                      style="display:inline-block;
                              background: linear-gradient(135deg, #ff4444, #cc0000);
                              color:#ffffff; font-size:15px; font-weight:600;
                              text-decoration:none; padding:14px 40px;
                              border-radius:8px; letter-spacing:0.5px;">
                      🔐 &nbsp; Secure My Account
                    </a>
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
                If you did not attempt to login, your account session token
                may have been stolen. Please change your password immediately.
              </p>
              <p style="color:#444444; font-size:11px; margin:0;">
                © ${new Date().getFullYear()} ${process.env.APP_NAME} &nbsp;·&nbsp;
                <a href="${process.env.FRONTEND_URL}/privacy"
                  style="color:#555555; text-decoration:none;">
                  Privacy Policy
                </a>
                &nbsp;·&nbsp;
                <a href="${process.env.FRONTEND_URL}/support"
                  style="color:#555555; text-decoration:none;">
                  Support
                </a>
              </p>
            </td>
          </tr>

          <!-- Bottom Red Bar -->
          <tr>
            <td style="background: linear-gradient(90deg, #cc0000, #ff4444);
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