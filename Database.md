-- ============================================================
--  SALON SYSTEM – DATABASE SCHEMA v5.0 (MySQL)
--  Thay đổi so với v4.0:
--  + Thêm: password_reset_tokens (quên mật khẩu)
--  + Thêm: notifications.type bổ sung PASSWORD_RESET, PASSWORD_CHANGED
--  ~ Sửa: appointments – bổ sung rule gán thợ khi duyệt lịch NULL
--  ~ Sửa: staff – thêm is_active rõ ràng hơn
-- ============================================================

CREATE DATABASE IF NOT EXISTS salon_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE salon_db;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- NHÓM 1: AUTH & TÀI KHOẢN
-- ============================================================

-- ------------------------------------------------------------
-- 1.1 Vai trò
-- ------------------------------------------------------------
CREATE TABLE roles (
    id   TINYINT     UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL UNIQUE,   -- 'USER' | 'ADMIN'
    PRIMARY KEY (id)
);

-- ------------------------------------------------------------
-- 1.2 Người dùng
-- ------------------------------------------------------------
CREATE TABLE users (
    id            BIGINT       UNSIGNED NOT NULL AUTO_INCREMENT,
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(150) UNIQUE,
    phone         VARCHAR(15)  UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url    VARCHAR(500),
    role_id       TINYINT      UNSIGNED NOT NULL DEFAULT 1,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id)
);

-- ------------------------------------------------------------
-- 1.3 Token đặt lại mật khẩu
-- ------------------------------------------------------------
-- Luồng: User nhập email → sinh token UUID → gửi link email
--        User click link → verify token → đặt mật khẩu mới → đánh dấu is_used
-- ------------------------------------------------------------
CREATE TABLE password_reset_tokens (
    id         BIGINT       UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id    BIGINT       UNSIGNED NOT NULL,
    token      VARCHAR(255) NOT NULL UNIQUE,    -- UUID random
    is_used    BOOLEAN      NOT NULL DEFAULT FALSE,
    expires_at DATETIME     NOT NULL,           -- created_at + 15 phút
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_prt_token (token),
    INDEX idx_prt_user  (user_id),
    CONSTRAINT fk_prt_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- ============================================================
-- NHÓM 2: NGHIỆP VỤ ĐẶT LỊCH
-- ============================================================

-- ------------------------------------------------------------
-- 2.1 Giờ làm việc của salon (dùng để tính slot trống)
-- ------------------------------------------------------------
CREATE TABLE salon_working_hours (
    id              INT     UNSIGNED NOT NULL AUTO_INCREMENT,
    day_of_week     TINYINT NOT NULL,              -- 1=Thứ 2 ... 7=Chủ nhật
    open_time       TIME    NOT NULL,              -- VD: 08:00
    close_time      TIME    NOT NULL,              -- VD: 20:00
    slot_duration_m SMALLINT NOT NULL DEFAULT 30,  -- đơn vị slot (phút)
    is_open         BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    UNIQUE KEY uq_dow (day_of_week)
);

-- ------------------------------------------------------------
-- 2.2 Danh mục & dịch vụ
-- ------------------------------------------------------------
CREATE TABLE service_categories (
    id         INT          UNSIGNED NOT NULL AUTO_INCREMENT,
    name       VARCHAR(100) NOT NULL,
    sort_order TINYINT      NOT NULL DEFAULT 0,    -- thứ tự hiển thị
    is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id)
);

CREATE TABLE services (
    id          INT           UNSIGNED NOT NULL AUTO_INCREMENT,
    category_id INT           UNSIGNED NOT NULL,
    name        VARCHAR(150)  NOT NULL,
    description TEXT,
    price       DECIMAL(12,2) NOT NULL,
    duration_m  SMALLINT      NOT NULL,            -- thời gian thực hiện (phút)
    is_active   BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_services_category (category_id),
    CONSTRAINT fk_services_category FOREIGN KEY (category_id) REFERENCES service_categories (id)
);

-- ------------------------------------------------------------
-- 2.3 Thợ cắt tóc & khóa khung giờ
-- ------------------------------------------------------------
CREATE TABLE staff (
    id         INT          UNSIGNED NOT NULL AUTO_INCREMENT,
    full_name  VARCHAR(100) NOT NULL,
    phone      VARCHAR(15),
    avatar_url VARCHAR(500),
    bio        TEXT,                               -- giới thiệu chuyên môn
    is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Khóa khung giờ khi thợ nghỉ phép / bận đột xuất
CREATE TABLE staff_blocked_slots (
    id         INT      UNSIGNED NOT NULL AUTO_INCREMENT,
    staff_id   INT      UNSIGNED NOT NULL,
    block_date DATE     NOT NULL,
    start_time TIME     NOT NULL,
    end_time   TIME     NOT NULL,
    note       VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_staff_block (staff_id, block_date, start_time),
    INDEX idx_block_date (block_date),
    CONSTRAINT fk_block_staff FOREIGN KEY (staff_id) REFERENCES staff (id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 2.4 Lịch hẹn
-- ------------------------------------------------------------
-- Quy tắc staff_id:
--   NULL     = User chọn "bất kỳ thợ nào" → Admin PHẢI gán thợ khi CONFIRMED
--   NOT NULL = User chọn thợ cụ thể
-- ------------------------------------------------------------
CREATE TABLE appointments (
    id            BIGINT        UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id       BIGINT        UNSIGNED NOT NULL,
    staff_id      INT           UNSIGNED,               -- NULL = bất kỳ thợ nào
    appt_date     DATE          NOT NULL,
    start_time    TIME          NOT NULL,
    end_time      TIME          NOT NULL,
    total_price   DECIMAL(12,2) NOT NULL DEFAULT 0,
    status        ENUM(
                      'PENDING',       -- Chờ xác nhận (user có thể hủy)
                      'CONFIRMED',     -- Đã xác nhận (staff_id phải != NULL)
                      'IN_PROGRESS',   -- Đang thực hiện
                      'COMPLETED',     -- Hoàn thành
                      'CANCELLED'      -- Đã hủy
                  ) NOT NULL DEFAULT 'PENDING',
    cancel_reason VARCHAR(500),
    cancelled_by  ENUM('USER','ADMIN'),
    note          TEXT,
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_appt_user        (user_id),
    INDEX idx_appt_staff       (staff_id),
    INDEX idx_appt_date_status (appt_date, status),
    CONSTRAINT fk_appt_user  FOREIGN KEY (user_id)  REFERENCES users (id),
    CONSTRAINT fk_appt_staff FOREIGN KEY (staff_id) REFERENCES staff (id)
);

-- Dịch vụ trong 1 lịch hẹn (1 lịch có thể chứa nhiều dịch vụ)
CREATE TABLE appointment_services (
    id             BIGINT        UNSIGNED NOT NULL AUTO_INCREMENT,
    appointment_id BIGINT        UNSIGNED NOT NULL,
    service_id     INT           UNSIGNED NOT NULL,
    price_snapshot DECIMAL(12,2) NOT NULL,             -- giá tại thời điểm đặt
    PRIMARY KEY (id),
    CONSTRAINT fk_as_appt    FOREIGN KEY (appointment_id) REFERENCES appointments (id) ON DELETE CASCADE,
    CONSTRAINT fk_as_service FOREIGN KEY (service_id)     REFERENCES services (id)
);

-- ------------------------------------------------------------
-- 2.5 Đánh giá thợ (user đánh giá sau khi lịch COMPLETED)
-- ------------------------------------------------------------
CREATE TABLE staff_reviews (
    id             BIGINT   UNSIGNED NOT NULL AUTO_INCREMENT,
    appointment_id BIGINT   UNSIGNED NOT NULL UNIQUE,  -- 1 lịch chỉ được đánh giá 1 lần
    user_id        BIGINT   UNSIGNED NOT NULL,
    staff_id       INT      UNSIGNED NOT NULL,
    rating         TINYINT  NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment        TEXT,
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_sr_staff (staff_id),
    CONSTRAINT fk_sr_appointment FOREIGN KEY (appointment_id) REFERENCES appointments (id),
    CONSTRAINT fk_sr_user        FOREIGN KEY (user_id)        REFERENCES users (id),
    CONSTRAINT fk_sr_staff       FOREIGN KEY (staff_id)       REFERENCES staff (id)
);

-- ============================================================
-- NHÓM 3: NGHIỆP VỤ BÁN HÀNG
-- ============================================================

-- ------------------------------------------------------------
-- 3.1 Danh mục & sản phẩm
-- ------------------------------------------------------------
CREATE TABLE product_categories (
    id         INT          UNSIGNED NOT NULL AUTO_INCREMENT,
    name       VARCHAR(100) NOT NULL,
    sort_order TINYINT      NOT NULL DEFAULT 0,
    is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id)
);

CREATE TABLE products (
    id          INT           UNSIGNED NOT NULL AUTO_INCREMENT,
    category_id INT           UNSIGNED NOT NULL,
    name        VARCHAR(200)  NOT NULL,
    description TEXT,
    price       DECIMAL(12,2) NOT NULL,
    stock_qty   INT           NOT NULL DEFAULT 0,
    image_url   VARCHAR(500),                          -- ảnh chính (gallery mở rộng sau)
    is_active   BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_products_category (category_id),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES product_categories (id)
);

-- ------------------------------------------------------------
-- 3.2 Địa chỉ giao hàng
-- ------------------------------------------------------------
CREATE TABLE user_addresses (
    id         INT          UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id    BIGINT       UNSIGNED NOT NULL,
    receiver   VARCHAR(100) NOT NULL,
    phone      VARCHAR(15)  NOT NULL,
    province   VARCHAR(100) NOT NULL,
    district   VARCHAR(100) NOT NULL,
    ward       VARCHAR(100) NOT NULL,
    detail     VARCHAR(255) NOT NULL,
    is_default BOOLEAN      NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id),
    INDEX idx_addr_user (user_id),
    CONSTRAINT fk_addr_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 3.3 Giỏ hàng
-- ------------------------------------------------------------
CREATE TABLE carts (
    id         BIGINT   UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id    BIGINT   UNSIGNED NOT NULL UNIQUE,      -- 1 user chỉ có 1 giỏ
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    id         BIGINT   UNSIGNED NOT NULL AUTO_INCREMENT,
    cart_id    BIGINT   UNSIGNED NOT NULL,
    product_id INT      UNSIGNED NOT NULL,
    quantity   SMALLINT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    PRIMARY KEY (id),
    UNIQUE KEY uq_cart_product (cart_id, product_id),
    CONSTRAINT fk_ci_cart    FOREIGN KEY (cart_id)    REFERENCES carts (id) ON DELETE CASCADE,
    CONSTRAINT fk_ci_product FOREIGN KEY (product_id) REFERENCES products (id)
);

-- ------------------------------------------------------------
-- 3.4 Đơn hàng
-- ------------------------------------------------------------
CREATE TABLE orders (
    id             BIGINT        UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id        BIGINT        UNSIGNED NOT NULL,
    address_id     INT           UNSIGNED NOT NULL,
    total_amount   DECIMAL(12,2) NOT NULL,
    payment_method ENUM('COD','BANK_TRANSFER','MOMO','ZALOPAY') NOT NULL,
    status         ENUM(
                       'PENDING',     -- Chờ xác nhận (user có thể hủy)
                       'PROCESSING',  -- Đang xử lý   (chỉ admin hủy)
                       'SHIPPING',    -- Đang giao
                       'COMPLETED',   -- Hoàn thành
                       'CANCELLED'    -- Đã hủy
                   ) NOT NULL DEFAULT 'PENDING',
    cancel_reason  VARCHAR(500),
    cancelled_by   ENUM('USER','ADMIN'),
    refund_amount  DECIMAL(12,2),                      -- số tiền hoàn khi hủy
    refunded_at    DATETIME,                           -- thời điểm hoàn tiền
    note           TEXT,
    created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_orders_user   (user_id),
    INDEX idx_orders_status (status),
    CONSTRAINT fk_orders_user    FOREIGN KEY (user_id)    REFERENCES users (id),
    CONSTRAINT fk_orders_address FOREIGN KEY (address_id) REFERENCES user_addresses (id)
);

-- Chi tiết sản phẩm trong đơn hàng
CREATE TABLE order_items (
    id             BIGINT        UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id       BIGINT        UNSIGNED NOT NULL,
    product_id     INT           UNSIGNED NOT NULL,
    quantity       SMALLINT      NOT NULL CHECK (quantity > 0),
    price_snapshot DECIMAL(12,2) NOT NULL,             -- giá tại thời điểm đặt
    PRIMARY KEY (id),
    CONSTRAINT fk_oi_order   FOREIGN KEY (order_id)   REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_oi_product FOREIGN KEY (product_id) REFERENCES products (id)
);

-- ------------------------------------------------------------
-- 3.5 Đánh giá sản phẩm (sau khi đơn hàng COMPLETED)
-- ------------------------------------------------------------
CREATE TABLE product_reviews (
    id         BIGINT   UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id   BIGINT   UNSIGNED NOT NULL,
    product_id INT      UNSIGNED NOT NULL,
    user_id    BIGINT   UNSIGNED NOT NULL,
    rating     TINYINT  NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment    TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_review (user_id, product_id, order_id),  -- 1 user / 1 sản phẩm / 1 đơn
    INDEX idx_pr_product (product_id),
    CONSTRAINT fk_pr_order   FOREIGN KEY (order_id)   REFERENCES orders (id),
    CONSTRAINT fk_pr_product FOREIGN KEY (product_id) REFERENCES products (id),
    CONSTRAINT fk_pr_user    FOREIGN KEY (user_id)    REFERENCES users (id)
);

-- ============================================================
-- NHÓM 4: THANH TOÁN
-- ============================================================
-- Chỉ áp dụng cho đơn hàng – lịch hẹn không cần đặt cọc,
-- thanh toán trực tiếp tại salon.
-- ============================================================

CREATE TABLE payments (
    id              BIGINT        UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id        BIGINT        UNSIGNED NOT NULL,
    user_id         BIGINT        UNSIGNED NOT NULL,
    amount          DECIMAL(12,2) NOT NULL,
    method          ENUM('COD','BANK_TRANSFER','MOMO','ZALOPAY') NOT NULL,
    status          ENUM('PENDING','SUCCESS','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
    transaction_ref VARCHAR(255),                      -- mã giao dịch từ cổng thanh toán
    paid_at         DATETIME,
    created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_pay_order (order_id),
    INDEX idx_pay_user  (user_id),
    CONSTRAINT fk_pay_order FOREIGN KEY (order_id) REFERENCES orders (id),
    CONSTRAINT fk_pay_user  FOREIGN KEY (user_id)  REFERENCES users (id)
);

-- ============================================================
-- NHÓM 5: THÔNG BÁO
-- ============================================================

CREATE TABLE notifications (
    id         BIGINT       UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id    BIGINT       UNSIGNED NOT NULL,
    title      VARCHAR(200) NOT NULL,
    body       TEXT         NOT NULL,
    type       ENUM(
                   -- Lịch hẹn
                   'APPT_BOOKED',      -- Đặt lịch thành công
                   'APPT_CONFIRMED',   -- Lịch được duyệt
                   'APPT_REJECTED',    -- Lịch bị từ chối
                   'APPT_CANCELLED',   -- Lịch bị hủy
                   'APPT_REMINDER',    -- Nhắc lịch 24h / 2h
                   -- Đơn hàng
                   'ORDER_CONFIRMED',  -- Đơn hàng được xác nhận
                   'ORDER_STATUS',     -- Trạng thái đơn hàng thay đổi
                   -- Tài khoản
                   'PASSWORD_RESET',   -- Gửi link reset mật khẩu
                   'PASSWORD_CHANGED'  -- Xác nhận đổi mật khẩu thành công
               ) NOT NULL,
    ref_id     BIGINT UNSIGNED,                        -- id tham chiếu (appointment_id / order_id)
    ref_type   ENUM('APPOINTMENT','ORDER'),            -- loại tham chiếu
    is_read    BOOLEAN  NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_notif_user    (user_id),
    INDEX idx_notif_is_read (user_id, is_read),
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- ============================================================
-- DỮ LIỆU KHỞI TẠO
-- ============================================================

-- Vai trò
INSERT INTO roles (name) VALUES ('USER'), ('ADMIN');

-- Giờ làm việc mặc định: Thứ 2 – Chủ nhật, 08:00 – 20:00, slot 30 phút
INSERT INTO salon_working_hours (day_of_week, open_time, close_time, slot_duration_m, is_open) VALUES
    (1, '08:00', '20:00', 30, TRUE),
    (2, '08:00', '20:00', 30, TRUE),
    (3, '08:00', '20:00', 30, TRUE),
    (4, '08:00', '20:00', 30, TRUE),
    (5, '08:00', '20:00', 30, TRUE),
    (6, '08:00', '20:00', 30, TRUE),
    (7, '08:00', '20:00', 30, TRUE);

-- Danh mục dịch vụ
INSERT INTO service_categories (name, sort_order) VALUES
    ('Cắt tóc',    1),
    ('Uốn tóc',    2),
    ('Nhuộm tóc',  3),
    ('Chăm sóc tóc', 4);

-- Danh mục sản phẩm
INSERT INTO product_categories (name, sort_order) VALUES
    ('Dầu gội',      1),
    ('Dầu xả',       2),
    ('Sáp / Wax',    3),
    ('Serum',        4),
    ('Thuốc nhuộm',  5);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- TÓM TẮT – 18 BẢNG
-- ============================================================
-- Auth    : roles, users, password_reset_tokens
-- Booking : salon_working_hours, service_categories, services,
--           staff, staff_blocked_slots, appointments,
--           appointment_services, staff_reviews
-- Sales   : product_categories, products, user_addresses,
--           carts, cart_items, orders, order_items, product_reviews
-- Payment : payments
-- Notification: notifications
-- ============================================================