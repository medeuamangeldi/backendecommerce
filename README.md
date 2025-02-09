# Ecommerce Backend using NestJS

### .env content:

```yaml
DATABASE_URL=
JWT_SECRET=
SALT_ROUNDS=
MINIO_ENDPOINT=
MINIO_PORT=
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_USE_SSL=
MINIO_BUCKET_NAME=
RESET_CODE=
```

### docker-compose.yml content:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:13.5
    restart: always
    environment:
      - POSTGRES_USER=
      - POSTGRES_PASSWORD=
      - POSTGRES_DB=
    volumes:
      - postgres:/var/lib/postgresql/data
    ports:
      - '5432:5432'
    networks:
      - nesjs-network
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: nest-docker
    ports:
      - '3000:3000'
    depends_on:
      - postgres
    volumes:
      - ./app:/usr/src/app
      - /usr/src/app/node_modules
      - /app/prisma
    networks:
      - nesjs-network
    restart: unless-stopped
    environment:
      - DATABASE_HOST=
      - DATABASE_PORT=
      - DATABASE_USER=
      - DATABASE_PASSWORD=
  minio:
    image: docker.io/bitnami/minio:2022
    environment:
      MINIO_ROOT_USER:
      MINIO_ROOT_PASSWORD:
    ports:
      - '9000:9000'
      - '9001:9001'
    volumes:
      - 'minio_data:/data'
    networks:
      - nesjs-network
volumes:
  postgres:
  minio_data:
    driver: local
networks:
  nesjs-network:
    external: true
```
