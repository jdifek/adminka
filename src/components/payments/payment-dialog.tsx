"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Car } from "../data-table/columns";

// Схема валидации для модели payments
const paymentSchema = z.object({
  contract_id: z.number().int().positive().nullable().optional(), // Contract ID может быть nullable
  payment_type: z.string().min(1, "Payment type is required").max(50, "Payment type must be less than 50 characters"),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Enter a valid amount (e.g. 100.00)" }),
  currency: z.string().max(3, "Currency code must be 3 characters").default("THB"),
  car_number: z.string().max(20, "Car number must be less than 20 characters").optional(), // Добавлено поле car_number
  created_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Enter a valid date",
    })
    .optional(),
  payment_sign: z.boolean().default(true), // Добавляем поле для оплаты
  status: z
    .enum(["ACCEPTED", "NOT_ACCEPTED"], {
      errorMap: () => ({ message: "Status must be either ACCEPTED or NOT_ACCEPTED" }),
    })
    .default("NOT_ACCEPTED"), // Статус по умолчанию - "NOT_ACCEPTED"
});

export function PaymentDialog({ open, onOpenChange, payment, onClose }: any) {
  const { toast } = useToast();
  const [managerId, setManagerId] = useState<number>();
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token); // Декодируем токен
        setManagerId(decoded.id);
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const carRes = await fetch("/api/cars");
        const carData = await carRes.json();
        console.log(carData);

        if (Array.isArray(carData.cars)) {
          setCars(carData.cars);
        } else {
          console.error("Полученные данные не являются массивом:", carData);
          setCars([]); // Устанавливаем пустой массив в случае ошибки
        }
      } catch (error) {
        console.error("Ошибка при получении данных", error);
      }
    }

    if (open) {
      fetchData();
    }
  }, [open]);

  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: payment || {
      contract_id: null,
      payment_type: "",
      amount: "",
      currency: "THB",
      car_number: "", // Добавлено поле car_number
      created_at: payment?.created_at
        ? new Date(payment.created_at).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      payment_sign: true, // Устанавливаем значение по умолчанию
      status: "NOT_ACCEPTED", // Значение по умолчанию для статуса
    },
  });

  const onSubmit = async (data: any) => {
    try {
      // Если это обновление, сохраняем старого менеджера
      const preparedData = {
        ...data,
        amount: parseFloat(data.amount),
        manager_id: payment?.manager_id || managerId, // Сохраняем старого менеджера, если это обновление
      };

      const response = await fetch(`/api/payments${payment ? `/${payment.id}` : ""}`, {
        method: payment ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preparedData),
      });

      if (!response.ok) throw new Error("Failed to save payment");

      toast({
        title: payment ? "Payment updated" : "Payment created",
        description: payment
          ? "The payment has been successfully updated."
          : "The payment has been successfully created.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the payment.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{payment ? "Edit Payment" : "Add New Payment"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            style={{ maxHeight: "80vh", overflowY: "auto" }}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Contract ID */}
            <FormField
              control={form.control}
              name="contract_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="1"
                      placeholder="Enter contract ID"
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)} // Преобразование в число
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Payment Type */}
            <FormField
              control={form.control}
              name="payment_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Type</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Credit Card" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="e.g. 100.00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Currency */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value || "THB"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="THB">THB (Thai Baht)</SelectItem>
                        <SelectItem value="USD">USD (US Dollar)</SelectItem>
                        <SelectItem value="RUB">RUB (Russian Ruble)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Car Number */}
            <FormField
              control={form.control}
              name="car_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select car" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cars.map((car: Car) => (
                        <SelectItem key={car.id} value={car.car_number}>
                          {car.car_number} {car.is_available ? "🟢" : "🔴"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Created At */}
            <FormField
              control={form.control}
              name="created_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Created At</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Payment Sign */}
            <FormField
              control={form.control}
              name="payment_sign"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Sign</FormLabel>
                  <FormControl>
                    <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value || "NOT_ACCEPTED"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACCEPTED">Accepted</SelectItem>
                        <SelectItem value="NOT_ACCEPTED">Not Accepted</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
