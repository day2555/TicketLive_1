"use client";

import { EventCard } from './EventCard';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { getEvents } from '@/services/events.service';
import IEvent from '@/interfaces/event.interface';

 const CATEGORIES = [
   { key: "All", label: "Todos" },
   { key: "87eb6f79-7fcf-4cdf-b7f0-736a1b002c63", label: "Conciertos" },
   { key: "d2549a57-7969-4ac6-b43d-03a804793ddd", label: "Festivales" },
   { key: "95588a2a-0b64-49ef-9c02-d8e66bb858cc", label: "Deportes" },
   { key: "e3dbc0d0-ba32-4f65-8682-50bca56deed1", label: "Teatro" },
   { key: "7ab38443-37b3-4343-94d3-4825b3af27a3", label: "Conferencias" },
 ];

export function EventGrid() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [events, setEvents] = useState<IEvent[]>([]);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents: IEvent[] = await getEvents();
        setEvents(fetchedEvents);
        console.log("sample event:", fetchedEvents[0]);
      } catch (error) {
        alert(error);
      }
    };
    fetchEvents();
  }, []);
  
  const filteredEvents = activeCategory === "All" 
  ? events 
  : events.filter(event => event.category === activeCategory);
  
  return (
    <section className="py-24 relative">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-12 gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-bold text-white">Próximos eventos</h2>
              <p className="text-muted-foreground text-lg">No te pierdas estas experiencias increíbles.</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <Button 
                    key={category.key}
                    variant={activeCategory === category.key ? "primary" : "outline"}
                    onClick={() => setActiveCategory(category.key)}
                    className={`rounded-full ${activeCategory === category.key ? "" : "border-white/10 hover:bg-white/5 hover:text-white"}`}
                  >
                    {category.label}
                  </Button>
                ))}
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event: IEvent) => (
            <EventCard
              key={event.id}
              {...event}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
