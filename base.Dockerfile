# base.Dockerfile
# 의존성 설치를 위한 베이스 이미지
FROM node:20-alpine AS base

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production && \
    npm cache clean --force

# 개발 의존성도 설치 (빌드를 위해)
RUN npm ci

# 이미지 크기 최적화
RUN rm -rf /root/.npm /tmp/*