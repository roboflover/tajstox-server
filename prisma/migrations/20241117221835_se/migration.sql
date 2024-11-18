-- CreateTable
CREATE TABLE "OrderCatalog" (
    "id" SERIAL NOT NULL,
    "orderNumber" INTEGER,
    "orderTitle" TEXT,
    "orderDescription" TEXT,
    "quantity" INTEGER,
    "summa" DOUBLE PRECISION,
    "deliveryAddress" TEXT,
    "customerName" TEXT,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "orderStatus" TEXT,
    "comment" TEXT,

    CONSTRAINT "OrderCatalog_pkey" PRIMARY KEY ("id")
);
