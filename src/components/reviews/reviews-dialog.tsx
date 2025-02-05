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
import { Car } from "../data-table/columns";

// Схема валидации для модели reviews
const reviewSchema = z.object({
  car_id: z.number().int().positive(),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  review: z.string().min(1, "Review is required"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5").optional(),
});

export function ReviewsDialog({ open, onOpenChange, review, onClose }: any) {
  const { toast } = useToast();
  const [cars, setCars] = useState<Car[]>([]);

  const form = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: review || {
      car_id: 0,
      name: "",
      review: "",
      rating: null,
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const carRes = await fetch("/api/cars");
        const carData = await carRes.json();

        if (Array.isArray(carData.cars)) {
          setCars(carData.cars);
        } else {
          console.error("Полученные данные не являются массивом:", carData);
          setCars([]); // Устанавливаем пустой массив в случае ошибки
        }
      } catch (err) {}
    }

    fetchData();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/reviews${review ? `/${review.id}` : ""}`, {
        method: review ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save review");

      toast({
        title: review ? "Review updated" : "Review created",
        description: review ? "The review has been successfully updated." : "The review has been successfully created.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the review.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{review ? "Edit Review" : "Add New Review"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            style={{ maxHeight: "80vh", overflowY: "auto" }}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Car Selector */}
            <FormField
              control={form.control}
              name="car_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Car</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a car" />
                      </SelectTrigger>
                      <SelectContent>
                        {cars.map((car) => (
                          <SelectItem key={car.id} value={String(car.id)}>
                            {car.brand} {car.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter reviewer name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Review */}
            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter review" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="1"
                      min="1"
                      max="5"
                      placeholder="Enter rating (1-5)"
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    />
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
