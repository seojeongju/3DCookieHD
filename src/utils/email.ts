/**
 * 이메일 / 트랜잭션 메일 발송
 */

export type SendEmailResult = { ok: boolean; error?: string; simulated?: boolean };

export async function sendResetPasswordEmail(
  env: any,
  email: string,
  token: string,
  userName: string
): Promise<SendEmailResult> {
  const baseUrl = String(env.BASE_URL || 'https://3dcookiehd.com').replace(/\/$/, '');
  const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
  const apiKey = env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY 없음 — 발송 불가');
    return {
      ok: false,
      error: '이메일 발송 설정이 되어 있지 않습니다. 본인 인증으로 재설정해 주세요.',
      simulated: true,
    };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: env.MAIL_FROM || '3DCookie HD <noreply@3dcookiehd.com>',
        to: [email],
        subject: '[3DCookie HD] 비밀번호 재설정 안내',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #1e293b; margin-bottom: 24px;">안녕하세요, ${escapeHtml(userName)}님!</h2>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 32px;">
              비밀번호를 잊으셨나요? 요청하신 비밀번호 재설정을 위한 링크를 보내드립니다.<br>
              이 링크는 <b>1시간 동안만 유효</b>합니다.
            </p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              비밀번호 재설정하기
            </a>
            <p style="color: #64748b; font-size: 12px; margin-top: 24px; word-break: break-all;">
              버튼이 동작하지 않으면 아래 주소를 브라우저에 붙여넣으세요.<br>${resetUrl}
            </p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;">
            <p style="color: #94a3b8; font-size: 12px;">
              본인이 요청하지 않았다면 이 메일을 무시하셔도 됩니다.
            </p>
          </div>
        `,
      }),
    });

    if (response.ok) return { ok: true };

    let detail = '';
    try {
      const body = await response.json() as any;
      detail = body?.message || body?.error?.message || JSON.stringify(body?.error || body);
    } catch {
      detail = await response.text().catch(() => '');
    }
    console.error('[email] Resend failed', response.status, detail);
    return {
      ok: false,
      error: '이메일 발송에 실패했습니다. 본인 인증으로 재설정해 주세요.',
    };
  } catch (error) {
    console.error('[email] send exception', error);
    return {
      ok: false,
      error: '이메일 발송 중 오류가 발생했습니다. 본인 인증으로 재설정해 주세요.',
    };
  }
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
