# Book Store - Trang web mua bán sách

## Giới thiệu

Book Store là một trang web mua bán sách trực tuyến với giao diện thân thiện, dễ sử dụng. Dự án được phát triển với các công nghệ hiện đại cho cả phía client và server, đồng thời được đóng gói bằng Docker để dễ dàng triển khai.

## Công nghệ sử dụng

### Frontend

[x] JavaScript
[x] Bootstrap
[x] CSS
[x] Webpack (Webpack-cli, webpack-dev-server)

### Backend

- Express.js (Node.js framework)
- lowdb (JSON database)
- fuse.js (Lightweight fuzzy-search library)

### DevOps

- Docker
- Docker Compose

### Testing

- Postman (API testing)

## Cấu trúc dự án

├── admin/ # Frontend (Admin) - JS + Bootstrap + Webpack
│ ├── assets/
│ ├── css/
│ ├── js/
│ ├── db.json
│ ├── Dockerfile
│ ├── index.html
│ ├── package.json
│ └── webpack.config.js
│
├── client/ # Frontend (User) - JS + Bootstrap + Webpack
│ ├── assets/
│ ├── pages/
│ ├── src/
│ ├── Dockerfile
│ ├── index.html
│ ├── main.css
│ └── webpack.config.js
|
├── server/ # Backend API
│ ├── controllers/
│ ├── middlewares/
│ ├── modules/
│ ├── appRoute.js
│ ├── index.js
│ ├── db.json # LowDB database
│ ├── Dockerfile
│ └── .env
│
├── docker-compose.yml # Cấu hình toàn bộ hệ thống
└── README.md

## Giao diện

### Mobile

<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
    <img src="client/pages/mobile/AboutUs.png" width="30%" /> 
    <img src="client/pages/mobile/Auth.png" width="30%" /> 
    <img src="client/pages/mobile/Blog-Banner.png" width="30%" /> 
    <img src="client/pages/mobile/Blog-Body.png" width="30%" />
    <img src="client/pages/mobile/Cart-Empty.png" width="30%" /> 
    <img src="client/pages/mobile/Cart.png" width="30%" /> 
    <img src="client/pages/mobile/Checkout-Empty.png" width="30%" />
    <img src="client/pages/mobile/Checkout.png" width="30%" /> 
    <img src="client/pages/mobile/Home-Bars.png" width="30%" /> 
    <img src="client/pages/mobile/Home-Cart-Empty.png" width="30%" />
    <img src="client/pages/mobile/Home-Cart.png" width="30%" /> 
    <img src="client/pages/mobile/Home-Wishlist-Empty.png" width="30%" /> 
    <img src="client/pages/mobile/Home-Wishlist.png" width="30%" />
    <img src="client/pages/mobile/Home.png" width="30%" /> 
    <img src="client/pages/mobile/Product-Info.png" width="30%" /> 
    <img src="client/pages/mobile/Product.png" width="30%" />
    <img src="client/pages/mobile/Shop-Banner.png" width="30%" /> 
    <img src="client/pages/mobile/Shop-Body.png" width="30%" /> 
    <img src="client/pages/mobile/Wishlist-Empty.png" width="30%" />
    <img src="client/pages/mobile/Wishlist.png" width="30%" />
</div>

_Hình ảnh: Trang thông tin sản phẩm trên thiết bị di động_

## Yêu cầu hệ thống

Để chạy dự án này, bạn cần cài đặt:

- [Node.js](https://nodejs.org/) (v18.x hoặc cao hơn)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Yarn](https://yarnpkg.com/getting-started/install)

## Hướng dẫn cài đặt

```bash
# 1. Clone dự án
git clone <your-repo-url>
cd <tên-thư-mục-dự-án>

# 2. Build Container
docker compose build --no-cache

# 3. Chạy ứng dụng
docker compose up

# 4. Truy cập các dịch vụ

- Client: http://localhost:5173
- Admin: http://localhost:5174
- Server API: http://localhost:3000/api

### Để dừng các dịch vụ

- Nhấn Ctrl+C trong terminal
```
