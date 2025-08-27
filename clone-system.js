// Trippage Clone System - 자동 페이지 클론 시스템

class TrippageCloneSystem {
    constructor() {
        this.baseUrl = 'https://trippage.cafe24.com';
        this.outputDir = 'trippage-clone';
        this.clonedPages = new Set();
        this.pageQueue = [];
        this.maxConcurrent = 3; // 동시 처리할 수 있는 최대 페이지 수
        this.delay = 1000; // 요청 간 지연 시간 (ms)
    }

    // 메인 페이지에서 모든 링크 수집
    async collectAllLinks() {
        console.log('🔍 모든 페이지 링크 수집 중...');
        
        const links = await this.extractLinksFromPage(this.baseUrl);
        const uniquePages = [...new Set(links)];
        
        console.log(`📊 총 ${links.length}개 링크, ${uniquePages.length}개 고유 페이지 발견`);
        
        return uniquePages;
    }

    // 페이지에서 링크 추출
    async extractLinksFromPage(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const links = Array.from(doc.querySelectorAll('a[href]'))
                .map(link => link.href)
                .filter(href => 
                    href.includes('trippage.cafe24.com') && 
                    !href.includes('#') && 
                    !href.includes('javascript:') &&
                    href !== url
                );
            
            return links;
        } catch (error) {
            console.error(`❌ ${url}에서 링크 추출 실패:`, error);
            return [];
        }
    }

    // 페이지 클론 시작
    async startCloning() {
        const pages = await this.collectAllLinks();
        
        // 페이지를 카테고리별로 분류
        const categorizedPages = this.categorizePages(pages);
        
        console.log('📁 페이지 카테고리별 분류:');
        Object.entries(categorizedPages).forEach(([category, urls]) => {
            console.log(`  ${category}: ${urls.length}개`);
        });
        
        // 우선순위에 따라 클론 시작
        await this.cloneByPriority(categorizedPages);
    }

    // 페이지를 카테고리별로 분류
    categorizePages(pages) {
        const categories = {
            'category': [],      // 카테고리 페이지
            'product': [],       // 상품 상세 페이지
            'member': [],        // 회원 관련 페이지
            'board': [],         // 게시판 페이지
            'shopinfo': [],      // 쇼핑몰 정보 페이지
            'order': [],         // 주문 관련 페이지
            'myshop': [],        // 마이샵 페이지
            'other': []          // 기타 페이지
        };

        pages.forEach(url => {
            if (url.includes('/category/')) {
                categories.category.push(url);
            } else if (url.includes('/product/')) {
                categories.product.push(url);
            } else if (url.includes('/member/')) {
                categories.member.push(url);
            } else if (url.includes('/board/')) {
                categories.board.push(url);
            } else if (url.includes('/shopinfo/')) {
                categories.shopinfo.push(url);
            } else if (url.includes('/order/')) {
                categories.order.push(url);
            } else if (url.includes('/myshop/')) {
                categories.myshop.push(url);
            } else {
                categories.other.push(url);
            }
        });

        return categories;
    }

    // 우선순위에 따라 클론 실행
    async cloneByPriority(categorizedPages) {
        const priority = ['category', 'product', 'member', 'board', 'shopinfo', 'order', 'myshop', 'other'];
        
        for (const category of priority) {
            const pages = categorizedPages[category];
            if (pages.length > 0) {
                console.log(`\n🚀 ${category} 카테고리 클론 시작 (${pages.length}개 페이지)`);
                await this.clonePages(pages, category);
            }
        }
    }

    // 페이지들을 병렬로 클론
    async clonePages(pages, category) {
        const chunks = this.chunkArray(pages, this.maxConcurrent);
        
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            console.log(`  📄 ${i + 1}/${chunks.length} 배치 처리 중...`);
            
            const promises = chunk.map(url => this.cloneSinglePage(url, category));
            await Promise.all(promises);
            
            // 요청 간 지연
            if (i < chunks.length - 1) {
                await this.sleep(this.delay);
            }
        }
    }

    // 단일 페이지 클론
    async cloneSinglePage(url, category) {
        if (this.clonedPages.has(url)) {
            return;
        }

        try {
            console.log(`    📝 클론 중: ${url}`);
            
            const pageData = await this.extractPageData(url);
            const fileName = this.generateFileName(url, category);
            
            await this.savePage(fileName, pageData);
            
            this.clonedPages.add(url);
            console.log(`    ✅ 완료: ${fileName}`);
            
        } catch (error) {
            console.error(`    ❌ 실패: ${url}`, error);
        }
    }

    // 페이지 데이터 추출
    async extractPageData(url) {
        const response = await fetch(url);
        const html = await response.text();
        
        // HTML 파싱
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        return {
            url: url,
            title: doc.title || 'Untitled',
            html: html,
            metadata: this.extractMetadata(doc),
            content: this.extractContent(doc),
            assets: this.extractAssets(doc, url)
        };
    }

    // 메타데이터 추출
    extractMetadata(doc) {
        const metadata = {};
        
        // 메타 태그들
        const metaTags = doc.querySelectorAll('meta');
        metaTags.forEach(meta => {
            const name = meta.getAttribute('name') || meta.getAttribute('property');
            const content = meta.getAttribute('content');
            if (name && content) {
                metadata[name] = content;
            }
        });
        
        // Open Graph 태그들
        const ogTags = doc.querySelectorAll('meta[property^="og:"]');
        ogTags.forEach(meta => {
            const property = meta.getAttribute('property');
            const content = meta.getAttribute('content');
            if (property && content) {
                metadata[property] = content;
            }
        });
        
        return metadata;
    }

    // 주요 콘텐츠 추출
    extractContent(doc) {
        const content = {};
        
        // 메인 콘텐츠 영역
        const mainContent = doc.querySelector('main, #contents, .content, .main');
        if (mainContent) {
            content.main = mainContent.innerHTML;
        }
        
        // 헤더
        const header = doc.querySelector('header, #header');
        if (header) {
            content.header = header.innerHTML;
        }
        
        // 푸터
        const footer = doc.querySelector('footer, #footer');
        if (footer) {
            content.footer = footer.innerHTML;
        }
        
        // 사이드바
        const sidebar = doc.querySelector('aside, .sidebar, .side');
        if (sidebar) {
            content.sidebar = sidebar.innerHTML;
        }
        
        return content;
    }

    // 자산 파일들 추출
    extractAssets(doc, baseUrl) {
        const assets = {
            css: [],
            js: [],
            images: [],
            fonts: []
        };
        
        // CSS 파일들
        const cssLinks = doc.querySelectorAll('link[rel="stylesheet"]');
        cssLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                assets.css.push(this.resolveUrl(href, baseUrl));
            }
        });
        
        // JavaScript 파일들
        const jsScripts = doc.querySelectorAll('script[src]');
        jsScripts.forEach(script => {
            const src = script.getAttribute('src');
            if (src) {
                assets.js.push(this.resolveUrl(src, baseUrl));
            }
        });
        
        // 이미지 파일들
        const images = doc.querySelectorAll('img[src]');
        images.forEach(img => {
            const src = img.getAttribute('src');
            if (src) {
                assets.images.push(this.resolveUrl(src, baseUrl));
            }
        });
        
        // 폰트 파일들
        const fonts = doc.querySelectorAll('link[rel="preload"][as="font"], link[rel="stylesheet"][href*="font"]');
        fonts.forEach(font => {
            const href = font.getAttribute('href');
            if (href) {
                assets.fonts.push(this.resolveUrl(href, baseUrl));
            }
        });
        
        return assets;
    }

    // 상대 URL을 절대 URL로 변환
    resolveUrl(url, baseUrl) {
        if (url.startsWith('http')) {
            return url;
        }
        
        if (url.startsWith('//')) {
            return 'https:' + url;
        }
        
        if (url.startsWith('/')) {
            const base = new URL(baseUrl);
            return base.origin + url;
        }
        
        const base = new URL(baseUrl);
        return base.origin + base.pathname.replace(/\/[^\/]*$/, '/') + url;
    }

    // 파일명 생성
    generateFileName(url, category) {
        const urlObj = new URL(url);
        let path = urlObj.pathname;
        
        // 파일 확장자 제거
        path = path.replace(/\.html?$/, '');
        
        // 슬래시를 언더스코어로 변환
        path = path.replace(/\//g, '_');
        
        // URL 인코딩된 문자들을 디코딩
        path = decodeURIComponent(path);
        
        // 특수문자 제거
        path = path.replace(/[^a-zA-Z0-9가-힣_]/g, '_');
        
        // 카테고리별 디렉토리 구조
        const fileName = `${category}/${path}.html`;
        
        return fileName;
    }

    // 페이지 저장
    async savePage(fileName, pageData) {
        const filePath = `${this.outputDir}/${fileName}`;
        
        // 디렉토리 생성
        const dir = filePath.substring(0, filePath.lastIndexOf('/'));
        await this.createDirectory(dir);
        
        // HTML 파일 생성
        const htmlContent = this.generateHTML(pageData);
        await this.writeFile(filePath, htmlContent);
        
        // 자산 파일들 다운로드
        await this.downloadAssets(pageData.assets, dir);
    }

    // HTML 생성
    generateHTML(pageData) {
        return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageData.title}</title>
    
    <!-- 원본 URL: ${pageData.url} -->
    
    <!-- 메타데이터 -->
    ${Object.entries(pageData.metadata).map(([name, content]) => 
        `<meta name="${name}" content="${content}">`
    ).join('\n    ')}
    
    <!-- CSS 파일들 -->
    ${pageData.assets.css.map(css => 
        `<link rel="stylesheet" href="${this.getRelativePath(css)}">`
    ).join('\n    ')}
</head>
<body>
    <!-- 헤더 -->
    ${pageData.content.header || ''}
    
    <!-- 메인 콘텐츠 -->
    ${pageData.content.main || ''}
    
    <!-- 사이드바 -->
    ${pageData.content.sidebar || ''}
    
    <!-- 푸터 -->
    ${pageData.content.footer || ''}
    
    <!-- JavaScript 파일들 -->
    ${pageData.assets.js.map(js => 
        `<script src="${this.getRelativePath(js)}"></script>`
    ).join('\n    ')}
</body>
</html>`;
    }

    // 상대 경로 생성
    getRelativePath(url) {
        // 간단한 상대 경로 생성 로직
        return url.split('/').pop();
    }

    // 디렉토리 생성
    async createDirectory(path) {
        // Node.js 환경에서는 fs.mkdir 사용
        if (typeof require !== 'undefined') {
            const fs = require('fs');
            const pathModule = require('path');
            
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path, { recursive: true });
            }
        }
    }

    // 파일 쓰기
    async writeFile(path, content) {
        // Node.js 환경에서는 fs.writeFile 사용
        if (typeof require !== 'undefined') {
            const fs = require('fs');
            await fs.promises.writeFile(path, content, 'utf8');
        }
    }

    // 자산 파일 다운로드
    async downloadAssets(assets, baseDir) {
        // CSS, JS, 이미지, 폰트 파일들을 다운로드
        for (const [type, urls] of Object.entries(assets)) {
            if (urls.length > 0) {
                console.log(`      📥 ${type} 파일 ${urls.length}개 다운로드 중...`);
                
                for (const url of urls) {
                    try {
                        await this.downloadAsset(url, baseDir, type);
                    } catch (error) {
                        console.error(`        ❌ ${url} 다운로드 실패:`, error);
                    }
                }
            }
        }
    }

    // 단일 자산 파일 다운로드
    async downloadAsset(url, baseDir, type) {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        
        const fileName = url.split('/').pop();
        const filePath = `${baseDir}/${type}/${fileName}`;
        
        // 타입별 디렉토리 생성
        await this.createDirectory(`${baseDir}/${type}`);
        
        // 파일 저장
        await this.writeFile(filePath, Buffer.from(buffer));
    }

    // 배열을 청크로 분할
    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    // 지연 함수
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 진행 상황 보고
    reportProgress() {
        const total = this.pageQueue.length;
        const completed = this.clonedPages.size;
        const percentage = Math.round((completed / total) * 100);
        
        console.log(`\n📊 진행 상황: ${completed}/${total} (${percentage}%)`);
        
        if (completed === total) {
            console.log('🎉 모든 페이지 클론 완료!');
        }
    }
}

// 사용법
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrippageCloneSystem;
} else {
    // 브라우저 환경에서 실행
    window.TrippageCloneSystem = TrippageCloneSystem;
    
    // 자동 실행
    document.addEventListener('DOMContentLoaded', async () => {
        const cloneSystem = new TrippageCloneSystem();
        await cloneSystem.startCloning();
    });
}
