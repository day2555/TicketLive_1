"use client";

import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getEvents } from "@/services/events.service";
import IEvent from "@/interfaces/event.interface";

export default function Events() {
  const { addToCart } = useCart();
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents: IEvent[] = await getEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        alert(error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <section className="min-h-screen px-4 md:px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-10">Eventos disponibles</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl bg-linear-to-b from-slate-900/70 to-slate-950/70 ring-1 ring-white/10 shadow-xl p-6 flex flex-col"
            >
              {/* IMAGEN */}
              <div className="w-full h-48 mb-4 rounded-xl overflow-hidden bg-secondary">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  height={192}
                  width={314.672}
                ></Image>
              </div>

              {/* INFORMACIÓN */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold">{event.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {event.description}
                </p>
              </div>

              {/* ACCIONES */}
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xl font-bold text-primary">
                  ${event.price.toFixed(2)}
                </span>

                <button
                  onClick={() => addToCart(event)}
                  className="form-button"
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
