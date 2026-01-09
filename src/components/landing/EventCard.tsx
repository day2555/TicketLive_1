import Image from "next/image";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import IEvent from "@/interfaces/event.interface";
import { useCart } from "@/contexts/CartContext";

export function EventCard({
  title,
  date,
  location,
  price,
  imageUrl,
  category,
  capacity,
}: IEvent) {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-secondary/30 border border-white/5 hover:border-sidebar-accent/50 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(139,92,246,0.2)]">
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden">
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/10 uppercase tracking-wider">
            {category}
          </span>
        </div>
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="relative p-6 -mt-12 space-y-4">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 -top-8">
          <Button
            size="sm"
            className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
          >
            <Ticket className="h-4 w-4" />
          </Button>
        </div>

        <h3 className="text-xl font-bold text-white leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase">
              Desde
            </span>
            <span className="text-lg font-bold text-white">{price}$</span>
          </div>
          <Button variant="ghost" size="sm" className="form-button">
            Reservar ahora &rarr;
          </Button>
        </div>
      </div>
    </div>
  );
}
