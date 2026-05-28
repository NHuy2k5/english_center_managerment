# **Hướng dẫn làm việc nhóm bằng Git và Github**

## Yêu cầu hệ thống

1. node js bản lts
2. mariadb
3. git

## Các bước làm việc

1. Clone project

- Chọn thư mục cần lưu project và clone repository về máy

```bash
#clone repository
git clone https://github.com/NHuy2k5/english_center_managerment.git

#Di chuyển vào thư mục english_center_managerment
cd english_center_managerment

# Kiểm tra xem đã kết nối tới link github trên chưa bằng lệnh
git remote -v
```

2. Tạo nhánh mới
   Luôn tạo nhánh mới cho tính năng hoặc sửa lỗi

```bash
#Tạo brach mới và chuyển sang nhánh vừa tạo
git checkout -b feature/ten-tinh-nang
#hoặc
git checkout -b fix/ten-loi
#hoặc
git checkout -b hotfix/ten-loi
```

3. Thực hiện thay đổi

- Trước khi viết code, cần phải cài đặt đầy đủ các file package, module trên 2 folder _client_ và _server_

```bash
#B1: Chuyển v ào thư mục client
cd client
#B2: Cài đặt các file cần thiết cho folder client
npm install
#B3: Từ folder client chuyển sang server
cd ../server
#B4: Cài đặt các file cần thiết cho folder server
npm install
```

- Khi viết code thì viết code sạch, dễ đọc
- Chú thích về biến, hàm nếu cần

4. Add và Commit change

- Sau khi code được **chạy thử** mà **không thấy lỗi và đúng logic** thì sử dụng lệnh `add`

```bash
git add <folder hoac file là con cua folder english_center_managerment>
```

- Sau khi thực hiện xong thì tiếp tục sử dụng lệnh commit. Sử dụng commit message rõ ràng và mô tả.

```bash
#commit message tổng quát:
<type>: <fe/be/dia> - <mô tả>
<mô tả chi tiết>
#Ví dụ về commit message:
feat: fe - thêm header component
- Thêm Header.jsx
- Cập nhật App.jsx
```

Trong đó:
|type|Chú thích|
|:----------:|:-------------:|
|`feat`|thêm một feature|
|`fix`|fix bug|
|`refactor`|sửa code nhưng không fix bug cũng không thêm feature|
|`perf`|code cải tiến về mặt hiệu năng|
|`chore`|những sửa đổi nhỏ nhặt không liên quan tới code|

| fe/be/dia |  Chú thích  |
| :-------: | :---------: |
|   `fe`    | `front end` |
|   `be`    | `back end`  |
|   `dia`   |  `diagram`  |

```bash
#Ví dụ về lệnh commit
git commit -m "feat: fe - thêm header component" -m "- Thêm Header.jsx" -m "- Cập nhật App.jsx"
```

5. Đẩy nhánh lên github

- Sau khi đã commit thành công thì đẩy nhánh đó lên github

```bash
git push origin <ten-nhanh>
```

6. Tạo **Pull Request (PR)**
   Tạo pull request trên github với:

- Tiêu đề mô tả rõ ràng
- Mô tả chi tiết thay đổi

7. Review & merge **PR**

- Người quản lý repo hoặc các thành viên khác sẽ review code
- Nếu **OK**, người quản lý repo nhấn **"Merge pull request"**
- Sau đó, các thành viên khác nên `git pull` để cập nhật source code mới nhất về máy local.

8. Đồng bộ source code mới nhất về máy local sau khi **"Merge pull request"**

```bash
#B1: Quay về nhánh chính main
git push checkout main
#B2: Kéo source code mới nhất từ githhub
git pull origin main
```

Sau khi kéo code xong, các thành viên trong nhóm có thể quay trở lại nhánh làm việc hoặc tạo nhánh mới ở **bước 2**
