import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cars = await prisma.cars.findMany();
    console.log("Fetched cars:", cars); // Логируем данные, полученные от базы данных

    // Проверка на пустой массив
    if (cars.length === 0) {
      console.log("No cars found"); // Логируем, если машин нет
      return NextResponse.json({ message: "No cars found" }, { status: 404 });
    }

    // Возвращаем корректные данные
    return NextResponse.json({ cars });
  } catch (error) {
    console.error("Error fetching cars:", error); // Логируем ошибку
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
      const data = await request.json();

      // Деструктуризация входящих данных
      const {
        year,
        car_body_type,
        fuel_type,
        price_per_day,
        image_url,
        engine_capacity,
        seats_quantity,
        deposit,
        transmission_type,
        car_number,
        color,
        brand,
        model,
        ode,
        oil_last_change,
        is_available,
      } = data;

      // Валидация данных
      if (
        !year ||
        !car_body_type ||
        !fuel_type ||
        !price_per_day ||
        !image_url ||
        !seats_quantity ||
        !deposit ||
        !transmission_type ||
        !brand ||
        !model
      ) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      // Приведение типов для необязательных полей
      const parsedData = {
        year: year.toString(), // Убедитесь, что это строка
        car_body_type: car_body_type.toString(),
        fuel_type: fuel_type.toString(),
        price_per_day: parseInt(price_per_day),
        image_url: image_url.toString(),
        engine_capacity: engine_capacity ? engine_capacity.toString() : null,
        seats_quantity: parseInt(seats_quantity),
        deposit: parseInt(deposit),
        transmission_type: transmission_type.toString(),
        car_number: car_number ? car_number.toString() : "",
        color: color.toString(),
        brand: brand.toString(),
        model: model.toString(),
        ode: ode ? parseInt(ode) : null,
        oil_last_change: oil_last_change ? parseInt(oil_last_change) : null,
        is_available: is_available === true, // Приведение к Boolean
      };

      // Добавление записи в базу данных
      const car = await prisma.cars.create({ data: parsedData });
      console.log("Car created:", car);

      return NextResponse.json(car, { status: 201 });
    } catch (error: any) {
      console.error("Error creating car:", error);

      // Проверка на ошибки в базе данных (например, дублирование car_number)
      if (error.code === "P2002") {
        return NextResponse.json({ error: "Car with this number already exists" }, { status: 409 });
      }

      return NextResponse.json({ error: "Failed to create car" }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }
