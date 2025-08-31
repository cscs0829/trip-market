const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }, // iPhone SE 크기
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🚀 모바일 테스트 시작...');
    
    // 1. 페이지 로드 테스트
    console.log('📱 페이지 로드 테스트...');
    await page.goto('http://localhost:8000/index.html');
    await page.waitForLoadState('networkidle');
    console.log('✅ 페이지 로드 완료');
    
    // 2. 모바일 네비게이션 테스트
    console.log('🧭 모바일 네비게이션 테스트...');
    const bottomNav = await page.locator('.bottom-nav');
    await bottomNav.waitFor({ state: 'visible' });
    console.log('✅ 하단 네비게이션 표시됨');
    
    // 3. 인증 모달 테스트
    console.log('🔐 인증 모달 테스트...');
    const authLink = await page.locator('.show-auth-modal').first();
    await authLink.click();
    
    // 모달이 나타나는지 확인
    const modal = await page.locator('#authModal');
    await modal.waitFor({ state: 'visible' });
    console.log('✅ 인증 모달 표시됨');
    
    // 로그인/회원가입 토글 테스트
    const loginToggleBtn = await page.locator('button[data-mode="login"]');
    const registerToggleBtn = await page.locator('button[data-mode="register"]');
    
    await loginToggleBtn.click();
    await page.waitForTimeout(500);
    console.log('✅ 로그인 탭 활성화');
    
    await registerToggleBtn.click();
    await page.waitForTimeout(500);
    console.log('✅ 회원가입 탭 활성화');
    
    // 4. 폼 입력 테스트
    console.log('✏️ 폼 입력 테스트...');
    await loginToggleBtn.click();
    
    const emailInput = await page.locator('#loginForm input[type="email"]');
    const passwordInput = await page.locator('#loginForm input[type="password"]');
    
    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');
    console.log('✅ 폼 입력 완료');
    
    // 5. 버튼 클릭 테스트
    console.log('🔘 버튼 클릭 테스트...');
    const submitBtn = await page.locator('#loginForm button[type="submit"]');
    await submitBtn.click();
    console.log('✅ 로그인 버튼 클릭됨');
    
    // 모달 닫기
    console.log('🔒 모달 닫기...');
    const closeBtn = await page.locator('.close');
    await closeBtn.click();
    await page.waitForTimeout(500);
    console.log('✅ 모달 닫힘');
    
    // 6. 위시리스트 버튼 테스트
    console.log('❤️ 위시리스트 버튼 테스트...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    const wishlistBtn = await page.locator('button:has-text("♥")').first();
    await wishlistBtn.click();
    console.log('✅ 위시리스트 버튼 클릭됨');
    
    // 7. 장바구니 버튼 테스트
    console.log('🛒 장바구니 버튼 테스트...');
    const cartBtn = await page.locator('button:has-text("장바구니")').first();
    await cartBtn.click();
    console.log('✅ 장바구니 버튼 클릭됨');
    
    // 8. 모바일 메뉴 테스트
    console.log('🍔 모바일 메뉴 테스트...');
    // 페이지 상단으로 스크롤
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    
    const hamburgerBtn = await page.locator('.hamburger-btn');
    if (await hamburgerBtn.isVisible()) {
      await hamburgerBtn.click();
      await page.waitForTimeout(500);
      console.log('✅ 햄버거 메뉴 클릭됨');
      
      // 사이드 메뉴가 열렸는지 확인
      const sideMenu = await page.locator('.mobile-side-menu');
      if (await sideMenu.isVisible()) {
        console.log('✅ 모바일 사이드 메뉴 표시됨');
      }
    } else {
      console.log('ℹ️ 햄버거 메뉴 버튼이 보이지 않음');
    }
    
    // 9. 스크롤 테스트
    console.log('📜 스크롤 테스트...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    console.log('✅ 스크롤 테스트 완료');
    
    // 10. 스타일 및 레이아웃 확인
    console.log('🎨 스타일 및 레이아웃 확인...');
    
    // 텍스트 정렬 확인
    try {
      const title = await page.locator('.map_title');
      if (await title.isVisible()) {
        const titleBox = await title.boundingBox();
        console.log(`📝 제목 위치: x=${Math.round(titleBox.x)}, y=${Math.round(titleBox.y)}`);
      } else {
        console.log('ℹ️ 제목 요소를 찾을 수 없음');
      }
    } catch (error) {
      console.log('ℹ️ 제목 위치 측정 중 오류 발생:', error.message);
    }
    
    // 11. 오류 확인
    console.log('🚨 오류 확인...');
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    if (consoleErrors.length > 0) {
      console.log('❌ 발견된 오류들:');
      consoleErrors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('✅ 오류 없음');
    }
    
    // 12. 최종 스크린샷
    console.log('📸 최종 스크린샷 저장...');
    await page.screenshot({ 
      path: 'mobile-test-result.png',
      fullPage: true 
    });
    
    console.log('🎉 모바일 테스트 완료!');
    console.log('📱 결과: mobile-test-result.png');
    
  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
    await page.screenshot({ 
      path: 'mobile-test-error.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
})();
