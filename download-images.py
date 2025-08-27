#!/usr/bin/env python3
"""
트립페이지 원본 사이트에서 이미지들을 다운로드하는 스크립트
"""

import os
import requests
from urllib.parse import urlparse
import time

# 이미지 URL 목록 (크롤링한 결과)
IMAGES = [
    # 메인 배너 이미지들
    {
        "url": "https://file.cafe24cos.com/banner-admin-live/upload/trippage/149ae5e1-0e8b-441a-c99d-2b71e5615646.jpeg",
        "filename": "main-banner-1.jpeg",
        "category": "banners"
    },
    {
        "url": "https://file.cafe24cos.com/banner-admin-live/upload/trippage/4ea89b1c-c8f8-427b-8c8a-82a631c519db.jpeg",
        "filename": "main-banner-2.jpeg",
        "category": "banners"
    },
    {
        "url": "https://file.cafe24cos.com/banner-admin-live/upload/trippage/050bbf07-7c4e-442b-e4a3-b70d21e2c1bc.jpeg",
        "filename": "main-banner-3.jpeg",
        "category": "banners"
    },
    {
        "url": "https://ecimg.cafe24img.com/pg2178b33194251092/trippage/web/upload/NNEditor/20250826/de373df3906843d02b444446660c55c0.jpg",
        "filename": "long-banner.jpg",
        "category": "banners"
    },
    {
        "url": "https://ecimg.cafe24img.com/pg2178b33194251092/trippage/web/upload/NNEditor/20250826/013510930524111cad0c24b6b157ba70.jpg",
        "filename": "offline-shop-map.jpg",
        "category": "banners"
    },
    
    # 상품 이미지들
    {
        "url": "https://ecimg.cafe24img.com/pg2178b33194251092/trippage/web/product/medium/20250826/60864c60a5370fe980d9ce30ee0b64bf.jpg",
        "filename": "amigo-swiss-red-train.jpg",
        "category": "products"
    },
    {
        "url": "https://ecimg.cafe24img.com/pg2178b33194251092/trippage/web/product/medium/20250826/e98433c962aefa15a89c9ed5071c39a8.jpg",
        "filename": "modern-swiss-snow-train.jpg",
        "category": "products"
    },
    {
        "url": "https://ecimg.cafe24img.com/pg2178b33194251092/trippage/web/product/medium/20250826/530c0a4771ac3d76e997d8a353db436e.jpg",
        "filename": "amorel-blue-ocean-view.jpg",
        "category": "products"
    },
    {
        "url": "https://ecimg.cafe24img.com/pg2178b33194251092/trippage/web/product/medium/20250826/91724784e825750dd164fd056961b87d.jpg",
        "filename": "amorel-blue-ocean-drive.jpg",
        "category": "products"
    },
    {
        "url": "https://ecimg.cafe24img.com/pg2178b33194251092/trippage/web/product/medium/20250826/9fabe6b9a20bfb4d7350329993035d87.jpg",
        "filename": "amor-maldives-hammock.jpg",
        "category": "products"
    },
    {
        "url": "https://ecimg.cafe24img.com/pg2178b33194251092/trippage/web/product/medium/20250826/2a1ce85c83aeb1eb3babb6e8a4dbe029.jpg",
        "filename": "amorel-winter-snow-train.jpg",
        "category": "products"
    },
    {
        "url": "https://ecimg.cafe24img.com/pg2178b33194251092/trippage/web/product/medium/20250826/531e09b964cc8d4fe55f283744ef83e9.jpg",
        "filename": "amore-luxury-beach-resort.jpg",
        "category": "products"
    },
    {
        "url": "https://ecimg.cafe24img.com/pg2178b33194251092/trippage/web/product/medium/20250826/f84bc2a8383bdbe1c4e176e5dfdc1a41.jpg",
        "filename": "aqua-blue-maldives-package.jpg",
        "category": "products"
    },
    {
        "url": "https://ecimg.cafe24img.com/pg2178b33194251092/trippage/web/product/medium/20250826/4b8f06cf149aafdb920a20c9019f6f23.jpg",
        "filename": "amor-summer-beach.jpg",
        "category": "products"
    },
    {
        "url": "https://ecimg.cafe24img.com/pg2178b33194251092/trippage/web/product/medium/20250826/df8a6b4edfb5036196cca1bb592f73fc.jpg",
        "filename": "ultimate-snow-mountain-trekking.jpg",
        "category": "products"
    },
    {
        "url": "https://ecimg.cafe24img.com/pg2178b33194251092/trippage/web/product/medium/20250826/bd9be154e74d7d502993bdd96fc2eb02.jpg",
        "filename": "luminous-alps-trekking.jpg",
        "category": "products"
    },
    {
        "url": "https://ecimg.cafe24img.com/pg2178b33194251092/trippage/web/product/medium/20250826/592698b7a2509c38bb216c03e8a98454.jpg",
        "filename": "odyssey-elegant-cruise.jpg",
        "category": "products"
    },
    {
        "url": "https://ecimg.cafe24img.com/pg2178b33194251092/trippage/web/product/medium/20250826/3093a22de9e313f44022e6f75b02ee92.jpg",
        "filename": "aqua-blue-coral-snorkeling.jpg",
        "category": "products"
    },
    {
        "url": "https://ecimg.cafe24img.com/pg2178b33194251092/trippage/web/product/medium/20250826/41234f5f180d4db46fe72e06d471cc57.jpg",
        "filename": "ultimate-island-cliff-tour.jpg",
        "category": "products"
    },
    {
        "url": "https://ecimg.cafe24img.com/pg2178b33194251092/trippage/web/product/medium/20250826/4b5abf81f4dacbda6e015a86b0a4e0d8.jpg",
        "filename": "extreme-alpine-cablecar.jpg",
        "category": "products"
    },
    {
        "url": "https://ecimg.cafe24img.com/pg2178b33194251092/trippage/web/product/medium/20250826/539c5e518d911c88d054531c512b5061.jpg",
        "filename": "adeline-blueocean-yacht.jpg",
        "category": "products"
    },
    
    # 아이콘 이미지들
    {
        "url": "https://img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_wish_before.png",
        "filename": "wish-before.png",
        "category": "icons"
    },
    {
        "url": "https://img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_list_cart.gif",
        "filename": "cart-icon.gif",
        "category": "icons"
    },
    {
        "url": "https://img.echosting.cafe24.com/skin/skin/common/img_loading.gif",
        "filename": "loading.gif",
        "category": "icons"
    }
]

def create_directories():
    """필요한 디렉토리들을 생성합니다."""
    base_dir = "images"
    categories = ["banners", "products", "icons"]
    
    for category in categories:
        os.makedirs(f"{base_dir}/{category}", exist_ok=True)
    
    print(f"디렉토리 생성 완료: {base_dir}/")

def download_image(url, filepath):
    """이미지를 다운로드합니다."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ 다운로드 완료: {filepath}")
        return True
        
    except Exception as e:
        print(f"❌ 다운로드 실패: {filepath} - {str(e)}")
        return False

def main():
    """메인 함수"""
    print("🚀 트립페이지 이미지 다운로드를 시작합니다...")
    
    # 디렉토리 생성
    create_directories()
    
    success_count = 0
    total_count = len(IMAGES)
    
    for i, image_info in enumerate(IMAGES, 1):
        url = image_info["url"]
        filename = image_info["filename"]
        category = image_info["category"]
        
        filepath = f"images/{category}/{filename}"
        
        print(f"\n[{i}/{total_count}] {filename} 다운로드 중...")
        
        if download_image(url, filepath):
            success_count += 1
        
        # 서버에 부하를 주지 않기 위해 잠시 대기
        time.sleep(0.5)
    
    print(f"\n🎉 다운로드 완료!")
    print(f"성공: {success_count}/{total_count}")
    print(f"실패: {total_count - success_count}/{total_count}")

if __name__ == "__main__":
    main()
