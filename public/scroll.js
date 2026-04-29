let lastScrollTop = 0; // 前回のスクロール位置
let topNav; // グローバル変数としてtopNavを定義

document.addEventListener('DOMContentLoaded', function () {
    topNav = document.querySelector('.top-nav'); // 固定ヘッダーの要素を取得
    const body = document.body;

    function adjustBodyPadding() {
        // ヘッダーの高さを取得
        const headerHeight = topNav.offsetHeight;

        // bodyの上部余白にヘッダーの高さを設定
        body.style.paddingTop = `${headerHeight}px`;
        //body.style.marginTop = `0px`; 
    }

    // ページ読み込み時とウィンドウリサイズ時に余白を調整
    adjustBodyPadding();
    window.addEventListener('resize', adjustBodyPadding);
});

window.addEventListener('scroll', function () {
    if (!topNav) return; // topNavがまだ取得できていない場合は処理しない

    let currentScroll = window.pageYOffset || document.documentElement.scrollTop; // 現在のスクロール位置
    const navHeight = topNav.offsetHeight; // ナビゲーションバーの実際の高さを取得

    if (currentScroll > lastScrollTop) {
        // スクロールダウンした場合、ナビゲーションバーを隠す
        topNav.style.top = `-${navHeight}px`; // 実際の高さに基づいて隠す
    } else {
        // スクロールアップした場合、ナビゲーションバーを表示
        topNav.style.top = "0"; // 元の位置に戻す
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // スクロール位置が負にならないようにする
});
