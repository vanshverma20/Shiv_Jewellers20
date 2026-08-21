-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'STAFF',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "phone" TEXT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "publicId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JewelryDetails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "metalType" TEXT NOT NULL,
    "metalPurity" TEXT NOT NULL,
    "grossWeight" REAL NOT NULL,
    "netWeight" REAL NOT NULL,
    "stoneWeight" REAL,
    "stoneType" TEXT,
    "stoneCount" INTEGER NOT NULL DEFAULT 0,
    "stoneColor" TEXT,
    "diamondInfo" TEXT,
    "hallmarkInfo" TEXT,
    "huid" TEXT,
    CONSTRAINT "JewelryDetails_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "certNumber" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "issueDate" DATETIME,
    "documentUrl" TEXT,
    CONSTRAINT "Certification_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pricing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "basePrice" REAL NOT NULL,
    "makingCharge" REAL NOT NULL DEFAULT 0,
    "stoneCharge" REAL NOT NULL DEFAULT 0,
    "discount" REAL NOT NULL DEFAULT 0,
    "gstPercentage" REAL NOT NULL DEFAULT 3,
    "finalSellingPrice" REAL NOT NULL,
    CONSTRAINT "Pricing_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "availableQuantity" INTEGER NOT NULL DEFAULT 0,
    "reservedQuantity" INTEGER NOT NULL DEFAULT 0,
    "soldQuantity" INTEGER NOT NULL DEFAULT 0,
    "warehouseLoc" TEXT,
    "reorderThreshold" INTEGER NOT NULL DEFAULT 2,
    CONSTRAINT "Inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QRCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "qrData" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QRCode_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductScan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "scannedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipHash" TEXT,
    "userAgent" TEXT,
    CONSTRAINT "ProductScan_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "totalAmount" REAL NOT NULL,
    "discountAmount" REAL NOT NULL DEFAULT 0,
    "taxAmount" REAL NOT NULL,
    "finalAmount" REAL NOT NULL,
    "paymentMethod" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    CONSTRAINT "Wishlist_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WishlistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wishlistId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "WishlistItem_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    CONSTRAINT "Cart_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_publicId_key" ON "Product"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "JewelryDetails_productId_key" ON "JewelryDetails"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Pricing_productId_key" ON "Pricing"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_productId_key" ON "Inventory"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "QRCode_productId_key" ON "QRCode"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_customerId_key" ON "Wishlist"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_customerId_key" ON "Cart"("customerId");
