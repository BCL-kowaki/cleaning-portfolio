export interface PortfolioData {
  stocks: number;        // 株
  realEstate: number;    // 不動産
  gold: number;          // 金
  mutualFunds: number;   // 投信/ETF
  crypto: number;        // 暗号通貨
  cash: number;          // 現金
  other: number;         // その他
}

export interface UserInfo {
  name: string;          // 氏名
  phone: string;         // 電話番号
  email: string;         // メールアドレス
}

export type DiagnosisType = 
  | 'gambler'      // ギャンブラー型
  | 'safekeeper'   // 金庫番型
  | 'trendy'       // イナゴ型
  | 'balanced'     // 優等生型
  | 'landlord';    // 大家さん型

export interface DiagnosisResult {
  type: DiagnosisType;
  emoji: string;
  title: string;
  condition: string;
  diagnosis: string;
  newsForecast: string;
  cleanupAdvice: {
    action: string;
    description: string;
  }[];
  stats: {
    attack: number;      // 攻撃力
    defense: number;     // 防御力
    liquidity: number;   // 流動性
    inflationResist: number; // インフレ耐性
  };
}
