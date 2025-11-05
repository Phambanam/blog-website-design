# WSL Port Forwarding Setup

## Vấn đề

Backend và database đang chạy trong WSL2, nhưng không thể truy cập từ Windows host qua `localhost`.

## Giải pháp

Có **3 cách** để truy cập services từ Windows:

### ✅ Cách 1: Truy cập trực tiếp qua WSL IP (Nhanh nhất)

Từ Windows, truy cập qua IP của WSL thay vì localhost:

**IP của WSL**: `172.18.240.170`

- Backend API: `http://172.18.240.170:3001`
- Swagger Docs: `http://172.18.240.170:3001/api/docs`
- PostgreSQL: `172.18.240.170:5433`

**Lưu ý**: IP của WSL có thể thay đổi sau mỗi lần khởi động lại. Để kiểm tra IP hiện tại:
```bash
# Trong WSL
hostname -I
```

### ✅ Cách 2: Setup Port Forwarding (Khuyên dùng)

Chạy script PowerShell để forward ports từ Windows localhost vào WSL:

1. **Mở PowerShell as Administrator** trên Windows
2. Chạy script:
   ```powershell
   cd C:\Users\NamP7\Documents\workspace\blog-website-design\backend
   .\setup-port-forwarding.ps1
   ```

Sau khi chạy, bạn có thể truy cập từ Windows:
- Backend API: `http://localhost:3001`
- Swagger Docs: `http://localhost:3001/api/docs`
- PostgreSQL: `localhost:5433`

**Để xóa port forwarding:**
```powershell
.\remove-port-forwarding.ps1
```

**Xem danh sách port forwarding hiện tại:**
```powershell
netsh interface portproxy show v4tov4
```

### ✅ Cách 3: Chạy Backend trong Docker

Đưa backend vào Docker để tự động xử lý port forwarding (phức tạp hơn nhưng ổn định nhất).

## Docker Services (Đã hoạt động tốt)

PostgreSQL và pgAdmin đã chạy trong Docker nên tự động accessible từ Windows:

- ✅ **PostgreSQL**: `localhost:5433`
- ✅ **pgAdmin**: `http://localhost:5050`

## Kiểm tra kết nối

### Từ WSL:
```bash
# Test backend
curl http://localhost:3001/api/posts

# Test database
psql -h localhost -p 5433 -U blog_user -d blog_db
```

### Từ Windows (sau khi setup port forwarding):
```powershell
# Test backend
curl http://localhost:3001/api/posts

# Hoặc mở browser:
# http://localhost:3001/api/docs
```

## Troubleshooting

### Port forwarding không hoạt động?

1. Đảm bảo chạy PowerShell **as Administrator**
2. Kiểm tra Windows Firewall không block ports
3. Restart lại WSL:
   ```powershell
   wsl --shutdown
   wsl
   ```
4. Chạy lại script `setup-port-forwarding.ps1`

### WSL IP thay đổi?

Sau mỗi lần restart WSL, IP có thể thay đổi. Chạy lại script để update:
```powershell
.\setup-port-forwarding.ps1
```

## Tóm tắt

| Service | WSL (trong WSL) | Windows (qua WSL IP) | Windows (qua port forwarding) |
|---------|----------------|---------------------|------------------------------|
| Backend | localhost:3001 | 172.18.240.170:3001 | localhost:3001 (cần setup) |
| PostgreSQL | localhost:5433 | localhost:5433 ✅ | localhost:5433 ✅ |
| pgAdmin | localhost:5050 | localhost:5050 ✅ | localhost:5050 ✅ |
