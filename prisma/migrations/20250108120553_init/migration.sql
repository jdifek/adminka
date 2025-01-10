-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('standard', 'poor', 'rich');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('ACCEPTED', 'NOT_ACCEPTED');

-- CreateTable
CREATE TABLE "cars" (
    "id" SERIAL NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "car_body_type" VARCHAR(50) NOT NULL,
    "price_per_day" INTEGER NOT NULL,
    "engine_capacity" VARCHAR(10),
    "fuel_type" VARCHAR(50) NOT NULL,
    "seats_quantity" INTEGER NOT NULL,
    "deposit" INTEGER NOT NULL,
    "year" VARCHAR(4) NOT NULL,
    "transmission_type" VARCHAR(50) NOT NULL,
    "brand" VARCHAR(100) NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "car_number" TEXT NOT NULL DEFAULT '',
    "color" VARCHAR(20) NOT NULL,
    "oil_last_change" INTEGER,
    "ode" INTEGER,
    "is_available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "passport_number" VARCHAR(20),
    "phone_1" VARCHAR(20) NOT NULL,
    "phone_2" VARCHAR(20),
    "status" "ClientStatus" NOT NULL DEFAULT 'standard',
    "location_id" INTEGER,
    "hotel_name" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" SERIAL NOT NULL,
    "car_id" INTEGER,
    "rental_amount" DECIMAL(10,2) NOT NULL,
    "rental_currency" VARCHAR(3) DEFAULT 'THB',
    "deposit_currency" VARCHAR(3) NOT NULL,
    "pickup_location_id" INTEGER,
    "client_name" VARCHAR(100) NOT NULL,
    "client_passport_number" VARCHAR(50) NOT NULL,
    "client_phone_number" VARCHAR(20) NOT NULL,
    "client_second_phone_number" VARCHAR(20),
    "client_surname" VARCHAR(100) NOT NULL,
    "date_end" TIMESTAMP(3) NOT NULL,
    "date_start" TIMESTAMP(3) NOT NULL,
    "dropoff_address" VARCHAR(255) NOT NULL,
    "dropoff_location_id" INTEGER,
    "full_insurance" BOOLEAN NOT NULL DEFAULT false,
    "manager" VARCHAR(100) NOT NULL,
    "mileage_odo" INTEGER NOT NULL,
    "pickup_address" VARCHAR(255) NOT NULL,
    "rental_deposit_amount" DECIMAL(10,2) NOT NULL,
    "rental_deposit_currency" VARCHAR(3) DEFAULT 'USD',
    "time_return" TIMESTAMP(3),
    "status" "ContractStatus" NOT NULL DEFAULT 'PENDING',
    "client_id" INTEGER NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "contract_id" INTEGER NOT NULL,
    "payment_type" VARCHAR(50) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) DEFAULT 'THB',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "car_number" VARCHAR(20),
    "manager_id" INTEGER,
    "payment_sign" BOOLEAN NOT NULL DEFAULT true,
    "status" "PaymentStatus" NOT NULL DEFAULT 'NOT_ACCEPTED',

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "manager_id" INTEGER NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "car_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "review" TEXT NOT NULL,
    "rating" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location" (
    "id" SERIAL NOT NULL,
    "deliveryprice" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "hotels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_name_key" ON "admins"("name");

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
