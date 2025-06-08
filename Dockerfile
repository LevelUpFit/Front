# 1단계: 빌드 단계
FROM node:18 AS build

# 앱 소스 복사
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN chmod +x node_modules/.bin/vite
RUN npm run build

# 2단계: Nginx로 정적 파일 서빙
FROM nginx:stable-alpine

# React build 결과물을 Nginx의 정적 파일 디렉토리로 복사
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 설정 파일 덮어쓰기 (필요할 경우만)
# COPY nginx.conf /etc/nginx/nginx.conf

# 80포트 노출
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
