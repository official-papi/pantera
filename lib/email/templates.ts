// Email layout and notification templates for Pantera Capital

interface BaseEmailProps {
  title: string;
  preheader: string;
  content: string;
}

export function baseEmailHtml({ title, preheader, content }: BaseEmailProps): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0E101D;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #E2E4EC;
    }
    .wrapper {
      width: 100%;
      background-color: #0E101D;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #15182B;
      border: 1px solid #232742;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
    .header {
      background: linear-gradient(180deg, #1A1E36 0%, #15182B 100%);
      padding: 32px 36px 24px 36px;
      border-bottom: 1px solid #232742;
      text-align: left;
    }
    .brand {
      font-size: 22px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: -0.5px;
      text-decoration: none;
      display: inline-block;
    }
    .brand span {
      color: #E9B737;
    }
    .tagline {
      font-family: ui-monospace, Menlo, Monaco, monospace;
      font-size: 10px;
      color: #E9B737;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: 6px;
    }
    .body-content {
      padding: 36px;
      font-size: 14px;
      line-height: 1.6;
      color: #CBD5E1;
    }
    .body-content h1 {
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .body-content p {
      margin: 0 0 16px 0;
    }
    .stat-box {
      background-color: #0E101D;
      border: 1px solid #232742;
      border-left: 3px solid #E9B737;
      border-radius: 8px;
      padding: 16px 20px;
      margin: 24px 0;
    }
    .stat-label {
      font-family: ui-monospace, Menlo, Monaco, monospace;
      font-size: 11px;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .stat-value {
      font-family: ui-monospace, Menlo, Monaco, monospace;
      font-size: 22px;
      font-weight: 700;
      color: #FFFFFF;
      margin-top: 4px;
    }
    .btn {
      display: inline-block;
      background-color: #E9B737;
      color: #0E101D !important;
      font-weight: 700;
      font-size: 13px;
      font-family: ui-monospace, Menlo, Monaco, monospace;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 14px 28px;
      border-radius: 8px;
      text-decoration: none;
      margin-top: 16px;
    }
    .footer {
      background-color: #0E101D;
      padding: 24px 36px;
      border-top: 1px solid #232742;
      text-align: center;
      font-size: 11px;
      color: #64748B;
      font-family: ui-monospace, Menlo, Monaco, monospace;
    }
    .footer a {
      color: #94A3B8;
      text-decoration: none;
    }
    .preheader {
      display: none !important;
      visibility: hidden;
      mso-hide: all;
      font-size: 1px;
      line-height: 1px;
      max-height: 0;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <span class="preheader">${preheader}</span>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="brand">PANTERA<span>.</span></div>
        <div class="tagline">[ INSTITUTIONAL DIGITAL ASSETS ]</div>
      </div>
      <div class="body-content">
        ${content}
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Pantera Capital Management. All rights reserved.</p>
        <p>Support: <a href="mailto:support@pantera.cfd">support@pantera.cfd</a> | <a href="https://pantera.cfd">pantera.cfd</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// 1. WELCOME EMAIL
export function getWelcomeEmail(name: string, email: string) {
  const content = `
    <h1>Welcome to Pantera Capital, ${name || "Investor"}!</h1>
    <p>Your institutional investor account has been successfully provisioned. You now have direct access to automated digital asset yield strategies, portfolio vaults, and daily compounding returns.</p>
    
    <div class="stat-box">
      <div class="stat-label">ACCOUNT IDENTIFIER</div>
      <div class="stat-value" style="font-size: 15px;">${email}</div>
    </div>

    <p>To begin, make a deposit via USDT (TRC-20), Bitcoin, or Bank Wire, select an investment tier, and start earning weekly settlements.</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://pantera.cfd/dashboard" class="btn">ACCESS YOUR PORTFOLIO &rarr;</a>
    </div>

    <p style="font-size: 12px; color: #64748B;">If you did not create this account, please immediately contact our security desk at support@pantera.cfd.</p>
  `;

  return {
    subject: "Welcome to Pantera Capital — Account Ready",
    html: baseEmailHtml({
      title: "Welcome to Pantera Capital",
      preheader: "Your institutional investor account is ready.",
      content,
    }),
  };
}

// 2. DEPOSIT RECEIVED EMAIL
export function getDepositReceivedEmail(name: string, amount: number, gateway: string, trxId: string) {
  const content = `
    <h1>Deposit Request Received</h1>
    <p>Hello ${name || "Investor"},</p>
    <p>We have received your deposit request. Our automated settlement and verification desk is processing the transaction.</p>

    <div class="stat-box">
      <div class="stat-label">DEPOSIT AMOUNT</div>
      <div class="stat-value">$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      <div class="stat-label" style="margin-top: 10px;">GATEWAY / REFERENCE</div>
      <div style="font-family: ui-monospace; font-size: 13px; color: #CBD5E1; margin-top: 4px;">${gateway} | ${trxId}</div>
    </div>

    <p>Once verified on-chain, the funds will be credited to your Deposit Wallet and ready for plan allocation.</p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="https://pantera.cfd/dashboard/deposit" class="btn">VIEW DEPOSIT LEDGER</a>
    </div>
  `;

  return {
    subject: `Deposit Confirmation: $${amount.toFixed(2)} [Pending Verification]`,
    html: baseEmailHtml({
      title: "Deposit Confirmation",
      preheader: `Deposit of $${amount.toFixed(2)} received and pending verification.`,
      content,
    }),
  };
}

// 3. DEPOSIT APPROVED EMAIL
export function getDepositApprovedEmail(name: string, amount: number, gateway: string, newBalance: number) {
  const content = `
    <h1>Deposit Approved & Credited!</h1>
    <p>Hello ${name || "Investor"},</p>
    <p>Good news! Your deposit has been verified and your Deposit Wallet has been credited.</p>

    <div class="stat-box" style="border-left-color: #10B981;">
      <div class="stat-label">CREDITED AMOUNT</div>
      <div class="stat-value" style="color: #10B981;">+$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      <div class="stat-label" style="margin-top: 10px;">AVAILABLE DEPOSIT WALLET</div>
      <div style="font-family: ui-monospace; font-size: 18px; font-weight: bold; color: #FFFFFF; margin-top: 4px;">$${newBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    </div>

    <p>You can now allocate your capital into any of our high-yield packages to begin earning ROI.</p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="https://pantera.cfd/dashboard/investments" class="btn">START AN INVESTMENT &rarr;</a>
    </div>
  `;

  return {
    subject: `Deposit Approved: $${amount.toFixed(2)} has been credited`,
    html: baseEmailHtml({
      title: "Deposit Approved",
      preheader: `Your deposit of $${amount.toFixed(2)} has been approved and credited.`,
      content,
    }),
  };
}

// 4. WITHDRAWAL REQUESTED EMAIL
export function getWithdrawalRequestedEmail(name: string, amount: number, method: string, destination: string) {
  const content = `
    <h1>Withdrawal Request Submitted</h1>
    <p>Hello ${name || "Investor"},</p>
    <p>Your withdrawal payout request has been registered and placed in the settlement queue.</p>

    <div class="stat-box">
      <div class="stat-label">REQUESTED AMOUNT</div>
      <div class="stat-value">$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      <div class="stat-label" style="margin-top: 10px;">PAYOUT METHOD & DESTINATION</div>
      <div style="font-family: ui-monospace; font-size: 13px; color: #CBD5E1; margin-top: 4px; word-break: break-all;">${method} &bull; ${destination}</div>
    </div>

    <p>Our security desk verifies each payout to prevent unauthorized transfers. You will receive an update once the transaction is broadcast.</p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="https://pantera.cfd/dashboard/withdraw" class="btn">VIEW WITHDRAWAL STATUS</a>
    </div>
  `;

  return {
    subject: `Withdrawal Request: $${amount.toFixed(2)} [Processing]`,
    html: baseEmailHtml({
      title: "Withdrawal Request",
      preheader: `Withdrawal request for $${amount.toFixed(2)} submitted.`,
      content,
    }),
  };
}

// 5. WITHDRAWAL APPROVED EMAIL
export function getWithdrawalApprovedEmail(name: string, amount: number, method: string) {
  const content = `
    <h1>Withdrawal Processed & Dispatched</h1>
    <p>Hello ${name || "Investor"},</p>
    <p>Your withdrawal has been successfully verified and sent to your designated destination.</p>

    <div class="stat-box" style="border-left-color: #10B981;">
      <div class="stat-label">DISPATCHED AMOUNT</div>
      <div class="stat-value" style="color: #10B981;">$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      <div class="stat-label" style="margin-top: 10px;">PAYOUT CHANNEL</div>
      <div style="font-family: ui-monospace; font-size: 13px; color: #CBD5E1; margin-top: 4px;">${method}</div>
    </div>

    <p>Please check your wallet or account. Depending on network congestion, confirmations may take a few moments.</p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="https://pantera.cfd/dashboard" class="btn">GO TO DASHBOARD</a>
    </div>
  `;

  return {
    subject: `Withdrawal Completed: $${amount.toFixed(2)} sent`,
    html: baseEmailHtml({
      title: "Withdrawal Completed",
      preheader: `Your withdrawal of $${amount.toFixed(2)} has been completed.`,
      content,
    }),
  };
}
