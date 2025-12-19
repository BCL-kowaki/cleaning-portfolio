import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// メール送信設定（本番環境では環境変数から取得）
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

interface EmailRequest {
  userInfo: {
    name: string;
    phone: string;
    email: string;
  };
  portfolio: {
    stocks: number;
    realEstate: number;
    gold: number;
    mutualFunds: number;
    crypto: number;
    cash: number;
    other: number;
  };
  totalAmount: number;
  diagnosisResult: {
    emoji: string;
    title: string;
    diagnosis: string;
    newsForecast: string;
    cleanupAdvice: { action: string; description: string }[];
    stats: {
      attack: number;
      defense: number;
      liquidity: number;
      inflationResist: number;
    };
  };
}

function generateEmailHTML(data: EmailRequest): string {
  const { userInfo, portfolio, totalAmount, diagnosisResult } = data;
  
  const portfolioItems = [
    { label: '株式', value: portfolio.stocks, emoji: '📈' },
    { label: '不動産', value: portfolio.realEstate, emoji: '🏢' },
    { label: '金', value: portfolio.gold, emoji: '🥇' },
    { label: '投信/ETF', value: portfolio.mutualFunds, emoji: '📊' },
    { label: '暗号通貨', value: portfolio.crypto, emoji: '₿' },
    { label: '現金', value: portfolio.cash, emoji: '💵' },
    { label: 'その他', value: portfolio.other, emoji: '📦' },
  ].filter(item => item.value > 0);

  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ポートフォリオ年末大掃除診断 結果</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', sans-serif; background-color: #f0f2f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- ヘッダー -->
    <div style="background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 10px;">🧹</div>
      <h1 style="color: white; margin: 0; font-size: 24px;">ポートフォリオ年末大掃除診断</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">診断結果レポート</p>
    </div>

    <!-- コンテンツ -->
    <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
      <!-- 挨拶 -->
      <p style="color: #1c1e21; font-size: 16px; margin-bottom: 20px;">
        ${userInfo.name} 様<br><br>
        この度はポートフォリオ年末大掃除診断をご利用いただき、誠にありがとうございます。<br>
        以下に診断結果をお送りいたします。
      </p>

      <!-- 診断タイプ -->
      <div style="background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
        <div style="font-size: 48px; margin-bottom: 10px;">${diagnosisResult.emoji}</div>
        <h2 style="color: white; margin: 0; font-size: 20px;">${diagnosisResult.title}</h2>
      </div>

      <!-- ポートフォリオ概要 -->
      <div style="background: #f0f2f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1c1e21; margin: 0 0 15px 0; font-size: 16px;">📊 あなたのポートフォリオ</h3>
        <p style="color: #65676b; margin: 0 0 10px 0; font-size: 14px;">総資産額: ¥${totalAmount.toLocaleString('ja-JP')}</p>
        <div>
          ${portfolioItems.map(item => `
            <span style="display: inline-block; background: white; padding: 5px 10px; border-radius: 20px; margin: 3px; font-size: 12px;">
              ${item.emoji} ${item.label}: ${item.value.toFixed(1)}%
            </span>
          `).join('')}
        </div>
      </div>

      <!-- スコア -->
      <div style="background: #f0f2f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1c1e21; margin: 0 0 15px 0; font-size: 16px;">📈 ポートフォリオスコア</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-size: 14px;">⚔️ 攻撃力</td>
            <td style="padding: 8px; font-size: 14px; font-weight: bold; text-align: right;">${diagnosisResult.stats.attack}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-size: 14px;">🛡️ 防御力</td>
            <td style="padding: 8px; font-size: 14px; font-weight: bold; text-align: right;">${diagnosisResult.stats.defense}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-size: 14px;">💧 流動性</td>
            <td style="padding: 8px; font-size: 14px; font-weight: bold; text-align: right;">${diagnosisResult.stats.liquidity}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-size: 14px;">🔥 インフレ耐性</td>
            <td style="padding: 8px; font-size: 14px; font-weight: bold; text-align: right;">${diagnosisResult.stats.inflationResist}</td>
          </tr>
        </table>
      </div>

      <!-- 診断結果 -->
      <div style="background: #f0f2f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1c1e21; margin: 0 0 10px 0; font-size: 16px;">🔮 診断結果</h3>
        <p style="color: #1c1e21; font-size: 14px; line-height: 1.6; margin: 0;">
          ${diagnosisResult.diagnosis}
        </p>
      </div>

      <!-- 2026年ニュース予報 -->
      <div style="background: #e8eaf6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1c1e21; margin: 0 0 10px 0; font-size: 16px;">📰 2026年ニュース予報</h3>
        <p style="color: #1c1e21; font-size: 14px; line-height: 1.6; margin: 0;">
          ${diagnosisResult.newsForecast}
        </p>
      </div>

      <!-- 大掃除アドバイス -->
      <div style="background: #f0f2f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1c1e21; margin: 0 0 15px 0; font-size: 16px;">🧹 大掃除アドバイス</h3>
        ${diagnosisResult.cleanupAdvice.map((advice, index) => `
          <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
            <div style="font-weight: bold; color: #dc2743; margin-bottom: 5px; font-size: 14px;">${advice.action}</div>
            <p style="color: #1c1e21; font-size: 14px; line-height: 1.5; margin: 0;">${advice.description}</p>
          </div>
        `).join('')}
      </div>

      <!-- 免責事項 -->
      <div style="background: #f0f2f5; padding: 15px; border-radius: 8px; text-align: center;">
        <p style="color: #65676b; font-size: 12px; margin: 0;">
          ⚠️ この診断はエンターテインメントコンテンツです。<br>
          投資判断は専門家にご相談の上、ご自身の責任で行ってください。
        </p>
      </div>
    </div>

    <!-- フッター -->
    <div style="text-align: center; padding: 20px;">
      <p style="color: #65676b; font-size: 12px; margin: 0;">
        © 2025 ポートフォリオ年末大掃除診断<br>
        株式会社投資の"KAWARA"版.com
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateAdminEmailText(data: EmailRequest): string {
  const { userInfo, portfolio } = data;
  
  // 日本時間でフォーマット
  const now = new Date();
  const jstDate = now.toLocaleString('ja-JP', { 
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '/');

  return `登録日時：${jstDate}
フォーム名：【KAWARA版】ポートフォリオ大掃除診断テストフォーム
氏名：${userInfo.name}
電話番号：${userInfo.phone}
メールアドレス：${userInfo.email}
株式：${portfolio.stocks.toFixed(1)}%
不動産：${portfolio.realEstate.toFixed(1)}%
金：${portfolio.gold.toFixed(1)}%
投信／ETF：${portfolio.mutualFunds.toFixed(1)}%
暗号通貨：${portfolio.crypto.toFixed(1)}%
現金：${portfolio.cash.toFixed(1)}%
その他：${portfolio.other.toFixed(1)}%`;
}

export async function POST(request: NextRequest) {
  try {
    const data: EmailRequest = await request.json();
    const { userInfo, diagnosisResult } = data;

    // 1. ユーザーへの自動返信メール
    const userMailOptions = {
      from: '"ポートフォリオ年末大掃除診断" <send@example.com>',
      to: userInfo.email,
      subject: `【診断結果】${diagnosisResult.emoji} ${diagnosisResult.title} - ポートフォリオ年末大掃除診断`,
      html: generateEmailHTML(data),
    };

    // 2. 管理者への通知メール（テキスト形式）
    const adminMailOptions = {
      from: '"ポートフォリオ診断システム" <send@example.com>',
      to: ['quest@kawaraban.co.jp', 'y3awtd-hirayama-p@hdbronze.htdb.jp'],
      subject: `【ポートフォリオ大掃除診断結果】${userInfo.name} 様`,
      text: generateAdminEmailText(data),
    };

    // メール送信（本番環境ではコメントを外す）
    // await transporter.sendMail(userMailOptions);
    // await transporter.sendMail(adminMailOptions);

    // 開発環境ではログ出力
    console.log('=== ユーザー宛メール ===');
    console.log('To:', userMailOptions.to);
    console.log('Subject:', userMailOptions.subject);
    console.log('');
    console.log('=== 管理者宛メール ===');
    console.log('To:', adminMailOptions.to);
    console.log('Subject:', adminMailOptions.subject);

    return NextResponse.json({ 
      success: true, 
      message: 'メール送信処理が完了しました',
      // 開発用: 送信内容の確認
      debug: {
        userEmail: userMailOptions.to,
        adminEmails: adminMailOptions.to,
      }
    });

  } catch (error) {
    console.error('メール送信エラー:', error);
    return NextResponse.json(
      { success: false, message: 'メール送信に失敗しました' },
      { status: 500 }
    );
  }
}

