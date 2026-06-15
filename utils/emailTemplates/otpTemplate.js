// Takes in user and otp, returns a beautifully designed HTML email template for OTP verification
const dotenv = require('dotenv');
dotenv.config();

exports.otpTemplate = (user, otp) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>OTP Verification</title>
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

          <!-- Top Blue Bar -->
          <tr>
            <td style="background: linear-gradient(90deg, #4f8ef7, #1a5fd4);
                        height: 6px; font-size:0;">
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px;">

              <!-- Lock Icon Circle -->
              <div style="width:72px; height:72px;
                          background:rgba(79,142,247,0.15);
                          border-radius:50%; display:inline-block;
                          line-height:72px; text-align:center;
                          border: 2px solid rgba(79,142,247,0.4);">
                <span style="font-size:32px;">🔑</span>
              </div>

              <h1 style="color:#4f8ef7; font-size:22px; font-weight:700;
                          margin:20px 0 6px 0; letter-spacing:0.5px;">
                Verify Your Identity
              </h1>
              <p style="color:#888888; font-size:13px; margin:0;">
                One-Time Password for account verification
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
                         line-height:1.7; margin:0 0 28px 0;">
                We received a request to verify your account
                <strong style="color:#ffffff;">${user.email}</strong>.
                Use the OTP below to complete your verification.
                This code is valid for
                <strong style="color:#4f8ef7;">10 minutes only.</strong>
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <div style="background:rgba(79,142,247,0.08);
                                border: 1px solid rgba(79,142,247,0.3);
                                border-radius:14px; padding:28px 40px;
                                display:inline-block;">

                      <p style="color:#777777; font-size:12px;
                                 font-weight:600; letter-spacing:2px;
                                 text-transform:uppercase; margin:0 0 16px 0;">
                        Your OTP Code
                      </p>

                      <!-- OTP Digits -->
                      <div style="display:flex; justify-content:center;
                                  gap:10px; text-align:center;">
                        ${otp.toString().split("").map(digit => `
                        <span style="display:inline-block;
                                     width:48px; height:58px;
                                     background:#242424;
                                     border:1px solid rgba(79,142,247,0.4);
                                     border-radius:10px;
                                     color:#ffffff;
                                     font-size:28px;
                                     font-weight:700;
                                     line-height:58px;
                                     text-align:center;
                                     letter-spacing:0;
                                     margin:0 4px;">
                          ${digit}
                        </span>`).join("")}
                      </div>

                      <p style="color:#555555; font-size:12px;
                                 margin:16px 0 0 0; text-align:center;">
                        ⏱ &nbsp;Expires in
                        <strong style="color:#4f8ef7;">10 minutes</strong>
                      </p>
                    </div>
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
                      ⚠️ &nbsp;<strong>Never share this OTP</strong>
                      with anyone. ${process.env.APP_NAME} will
                      never ask for your OTP via call or message.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- What to do if not you -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:rgba(255,255,255,0.03);
                        border:1px solid rgba(255,255,255,0.08);
                        border-radius:12px; margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="color:#aaaaaa; font-size:13px; font-weight:600;
                               margin:0 0 10px 0; text-transform:uppercase;
                               letter-spacing:1px;">
                      🚫 &nbsp;Didn't Request This?
                    </p>
                    <p style="color:#cccccc; font-size:14px;
                               line-height:1.7; margin:0;">
                      If you did not request this OTP, someone may have
                      entered your email address. You can safely ignore
                      this email. Your account remains secure as long as
                      you do not share this code.
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

          <!-- Bottom Blue Bar -->
          <tr>
            <td style="background: linear-gradient(90deg, #1a5fd4, #4f8ef7);
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