
export async function sendResetPasswordEmail(env: any, email: string, token: string, userName: string) {
    const resetUrl = `${env.BASE_URL || 'https://3dcookiehd.pages.dev'}/reset-password?token=${token}`;

    // 💡 Resend API를 사용한 이메일 발송 로직
    // 실제 운영 시에는 env.RESEND_API_KEY가 설정되어 있어야 합니다.
    const apiKey = env.RESEND_API_KEY;

    if (!apiKey) {
        console.warn('⚠️ RESEND_API_KEY가 설정되지 않았습니다. 이메일 내용을 콘솔에 출력합니다.');
        console.log(`
            [이메일 발송 시뮬레이션]
            수신자: ${email} (${userName}님)
            제목: [3DCookie HD] 비밀번호 재설정 안내
            내용: 아래 링크를 클릭하여 비밀번호를 재설정하세요. (1시간 후 만료)
            링크: ${resetUrl}
        `);
        return true;
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                from: '3DCookie HD <noreply@3dcookiehd.com>', // ⚠️ 본인의 도메인으로 설정 필요
                to: [email],
                subject: '[3DCookie HD] 비밀번호 재설정 안내',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                        <h2 style="color: #1e293b; margin-bottom: 24px;">안녕하세요, ${userName}님!</h2>
                        <p style="color: #475569; line-height: 1.6; margin-bottom: 32px;">
                            비밀번호를 잊으셨나요? 요청하신 비밀번호 재설정을 위한 링크를 보내드립니다.<br>
                            이 링크는 <b>1시간 동안만 유효</b>합니다.
                        </p>
                        <a href="${resetUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                            비밀번호 재설정하기
                        </a>
                        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                        <p style="color: #94a3b8; font-size: 12px;">
                            본인이 요청하지 않았다면 이 메일을 무시하셔도 됩니다.
                        </p>
                    </div>
                `
            })
        });

        return response.ok;
    } catch (error) {
        console.error('이메일 발송 실패:', error);
        return false;
    }
}
