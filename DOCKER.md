# Docker Deployment Guide

## Hướng dẫn triển khai ứng dụng với Docker

### Yêu cầu
- Docker version 20.10+
- Docker Compose version 2.0+ (tùy chọn)

---

## 🚀 Cách 1: Sử dụng Docker Compose (Khuyến nghị)

### Bước 1: Cấu hình biến môi trường

```bash
# Copy file .env.docker thành .env
cp .env.docker .env

# Chỉnh sửa file .env và cập nhật API endpoint
nano .env
```

### Bước 2: Build và chạy

```bash
# Build và start container
docker-compose up -d

# Xem logs
docker-compose logs -f

# Stop container
docker-compose down
```

Ứng dụng sẽ chạy tại: **http://localhost:3000**

---

## 🐳 Cách 2: Sử dụng Docker Commands

### Build Docker Image

```bash
# Build với API endpoint mặc định
docker build -t sim-analyzer:latest .

# Build với custom API endpoint
docker build \
  --build-arg REACT_APP_API_ENDPOINT=https://api.yourdomain.com \
  -t sim-analyzer:latest .
```

### Chạy Container

```bash
# Chạy container
docker run -d \
  --name sim-analyzer-app \
  -p 3000:80 \
  --restart unless-stopped \
  sim-analyzer:latest

# Xem logs
docker logs -f sim-analyzer-app

# Stop container
docker stop sim-analyzer-app

# Remove container
docker rm sim-analyzer-app
```

---

## 📝 Các lệnh hữu ích

### Kiểm tra container đang chạy
```bash
docker ps
```

### Xem logs
```bash
docker logs -f sim-analyzer-app
```

### Truy cập vào container
```bash
docker exec -it sim-analyzer-app sh
```

### Kiểm tra health status
```bash
docker inspect --format='{{.State.Health.Status}}' sim-analyzer-app
```

### Rebuild container
```bash
# Với docker-compose
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Với docker commands
docker stop sim-analyzer-app
docker rm sim-analyzer-app
docker rmi sim-analyzer:latest
docker build -t sim-analyzer:latest .
docker run -d --name sim-analyzer-app -p 3000:80 sim-analyzer:latest
```

---

## 🌐 Production Deployment

### Build cho production với custom API

```bash
docker build \
  --build-arg REACT_APP_API_ENDPOINT=https://api.production.com \
  -t sim-analyzer:prod .
```

### Sử dụng với reverse proxy (nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 Troubleshooting

### Container không start được
```bash
# Kiểm tra logs
docker logs sim-analyzer-app

# Kiểm tra port đã được sử dụng chưa
sudo netstat -tulpn | grep :3000
```

### Rebuild khi có thay đổi code
```bash
# Với docker-compose
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Hoặc
docker-compose up -d --build --force-recreate
```

### Kiểm tra API endpoint
```bash
# Vào trong container và kiểm tra
docker exec -it sim-analyzer-app sh
cat /usr/share/nginx/html/static/js/main.*.js | grep -o "http://[^\"]*"
```

---

## 📊 Image Size Optimization

Image hiện tại sử dụng multi-stage build:
- **Build stage**: node:18-alpine (~170MB)
- **Final image**: nginx:1.25-alpine + build files (~30-50MB)

Để giảm thêm kích thước:
```bash
# Sử dụng --no-cache khi build
docker build --no-cache -t sim-analyzer:latest .

# Loại bỏ các image không dùng
docker image prune -a
```

---

## 🔐 Security Notes

1. **Không commit .env file** vào Git
2. **Sử dụng secrets** cho production:
   ```bash
   docker secret create api_endpoint /path/to/secret
   ```
3. **Update nginx và node** thường xuyên
4. **Sử dụng HTTPS** cho production

---

## 📦 CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: |
          docker build \
            --build-arg REACT_APP_API_ENDPOINT=${{ secrets.API_ENDPOINT }} \
            -t sim-analyzer:${{ github.sha }} .

      - name: Push to registry
        run: docker push sim-analyzer:${{ github.sha }}
```

---

## 📞 Support

Nếu gặp vấn đề, vui lòng kiểm tra:
1. Docker daemon đang chạy: `docker info`
2. Port 3000 chưa được sử dụng: `lsof -i :3000`
3. API endpoint đúng trong .env file
4. Container logs: `docker logs -f sim-analyzer-app`
