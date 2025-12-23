import PortfolioForm from '@/components/PortfolioForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f0f2f5]">
      {/* ヘッダー */}
      <header className="instagram-gradient text-white py-6 px-4 mb-6">
        <div className="container mx-auto max-w-xl text-center">
          <h1 className="text-xl font-bold mt-2 mb-2">
            あなたのポートフォリオ診断テスト
          </h1>
          <p className="text-white/90 text-sm">
            2026年の投資を考えるきっかけに
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-xl pb-8">
        {/* 説明カード */}
        <div className="bg-white rounded-lg fb-shadow p-4 mb-4">
          <h2 className="font-bold text-[#1c1e21] mb-3 flex items-center gap-2">
            <span className="w-1 h-4 instagram-gradient rounded-full"></span>
            使い方
          </h2>
          <div className="flex gap-2 text-sm text-[#65676b]">
            <div className="flex-1 text-center">
              <div className="w-8 h-8 instagram-gradient rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">1</div>
              <p>金額を入力</p>
            </div>
            <div className="flex-1 text-center">
              <div className="w-8 h-8 instagram-gradient rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">2</div>
              <p>自動で比率計算</p>
            </div>
            <div className="flex-1 text-center">
              <div className="w-8 h-8 instagram-gradient rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">3</div>
              <p>診断結果を確認</p>
            </div>
          </div>
        </div>

        {/* フォームカード */}
        <div className="bg-white rounded-lg fb-shadow p-4">
          <h2 className="font-bold text-[#1c1e21] mb-4 flex items-center gap-2">
            <span className="w-1 h-4 instagram-gradient rounded-full"></span>
            お客様情報
          </h2>
          <PortfolioForm />
        </div>

        {/* フッター */}
        <footer className="mt-6 text-center text-[#65676b] text-xs">
          <p>© 株式会社投資の"KAWARA"版.com</p>
          <p className="mt-1">※ この診断はエンターテインメント目的です</p>
        </footer>
      </div>
    </main>
  );
}
