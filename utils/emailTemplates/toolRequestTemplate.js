const dotenv = require('dotenv');
dotenv.config();

exports.toolRequestTemplate = (data) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Tool Request</title>
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

          <!-- Top Green Bar -->
          <tr>
            <td style="background: linear-gradient(90deg, #22c55e, #16a34a);
                        height: 6px; font-size:0;">
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px;">

              <!-- Icon Circle -->
              <div style="width:72px; height:72px;
                          background:rgba(34,197,94,0.15);
                          border-radius:50%; display:inline-block;
                          line-height:72px; text-align:center;
                          border: 2px solid rgba(34,197,94,0.4);">
                <span style="font-size:32px;">🛠️</span>
              </div>

              <h1 style="color:#22c55e; font-size:22px; font-weight:700;
                          margin:20px 0 6px 0; letter-spacing:0.5px;">
                New Tool Request
              </h1>
              <p style="color:#888888; font-size:13px; margin:0;">
                Someone has submitted a tool request on ${process.env.APP_NAME}
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
                         line-height:1.7; margin:0 0 24px 0;">
                Hi <strong style="color:#ffffff;">Admin</strong>, you have
                received a new tool request. Here are the details:
              </p>

              <!-- Request Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:rgba(34,197,94,0.06);
                        border:1px solid rgba(34,197,94,0.2);
                        border-radius:12px; margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">

                    <p style="color:#22c55e; font-size:13px;
                               font-weight:600; margin:0 0 16px 0;
                               text-transform:uppercase; letter-spacing:1px;">
                      📋 &nbsp;Request Details
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0">

                      <!-- Name -->
                      <tr>
                        <td style="padding: 8px 0; border-bottom:
                                    1px solid rgba(255,255,255,0.05);
                                    width: 35%;">
                          <span style="color:#777777; font-size:13px;">
                            👤 &nbsp;Name
                          </span>
                        </td>
                        <td align="right" style="padding: 8px 0; border-bottom:
                                    1px solid rgba(255,255,255,0.05);">
                          <span style="color:#ffffff; font-size:13px;
                                        font-weight:500;">
                            ${data.name}
                          </span>
                        </td>
                      </tr>

                      <!-- Email -->
                      <tr>
                        <td style="padding: 8px 0; border-bottom:
                                    1px solid rgba(255,255,255,0.05);">
                          <span style="color:#777777; font-size:13px;">
                            📧 &nbsp;Email
                          </span>
                        </td>
                        <td align="right" style="padding: 8px 0; border-bottom:
                                    1px solid rgba(255,255,255,0.05);">
                          <a href="mailto:${data.email}"
                            style="color:#4f8ef7; font-size:13px;
                                    font-weight:500; text-decoration:none;">
                            ${data.email}
                          </a>
                        </td>
                      </tr>

                      <!-- Date -->
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color:#777777; font-size:13px;">
                            🕐 &nbsp;Submitted
                          </span>
                        </td>
                        <td align="right" style="padding: 8px 0;">
                          <span style="color:#ffffff; font-size:13px;
                                        font-weight:500;">
                            ${new Date().toLocaleString()}
                          </span>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>

              <!-- Tool Description Box -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:rgba(255,255,255,0.03);
                        border:1px solid rgba(255,255,255,0.08);
                        border-radius:12px; margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="color:#aaaaaa; font-size:13px; font-weight:600;
                               margin:0 0 12px 0; text-transform:uppercase;
                               letter-spacing:1px;">
                      💡 &nbsp;Tool Description
                    </p>
                    <p style="color:#cccccc; font-size:15px;
                               line-height:1.8; margin:0;
                               border-left: 3px solid #22c55e;
                               padding-left: 14px;">
                      ${data.toolDescription}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Reply CTA -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:rgba(255,255,255,0.03);
                        border:1px solid rgba(255,255,255,0.08);
                        border-radius:12px; margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="color:#aaaaaa; font-size:13px; font-weight:600;
                               margin:0 0 10px 0; text-transform:uppercase;
                               letter-spacing:1px;">
                      ↩️ &nbsp;Reply to Requester
                    </p>
                    <p style="color:#cccccc; font-size:14px;
                               line-height:1.7; margin:0 0 16px 0;">
                      You can reply directly to
                      <strong style="color:#ffffff;">${data.name}</strong>
                      at their email address below.
                    </p>
                    <a href="mailto:${data.email}?subject=Re: Your Tool Request on ${process.env.APP_NAME}"
                      style="display:inline-block;
                              background: linear-gradient(135deg, #22c55e, #16a34a);
                              color:#ffffff; font-size:14px; font-weight:600;
                              text-decoration:none; padding:12px 28px;
                              border-radius:8px; letter-spacing:0.5px;">
                      ✉️ &nbsp; Reply to ${data.name}
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
                This is an automated notification from
                <strong style="color:#666666;">${process.env.APP_NAME}</strong>.
                This request has been saved to your database.
              </p>
              <p style="color:#444444; font-size:11px; margin:0;">
                © ${new Date().getFullYear()} ${process.env.APP_NAME}
              </p>
            </td>
          </tr>

          <!-- Bottom Green Bar -->
          <tr>
            <td style="background: linear-gradient(90deg, #16a34a, #22c55e);
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