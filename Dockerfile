# 1. Node.js 이미지로 애플리케이션 빌드
FROM node:18 AS builder

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 패키지 파일 복사 및 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 4. 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# 5. Nginx를 사용해 정적 파일 서빙
FROM nginx:alpine

# 6. Nginx 설정 파일 덮어쓰기 (옵션)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 7. React 빌드 결과를 Nginx의 기본 경로로 복사
# build가 아니라 dist다!
COPY --from=builder /app/dist /usr/share/nginx/html

# 8. 컨테이너 포트 설정
EXPOSE 80

# 9. Nginx 시작
CMD ["nginx", "-g", "daemon off;"]
