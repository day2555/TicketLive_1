import IEvent from "@/interfaces/event.interface";

export const getEvents = async (): Promise<IEvent[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  return res.json();
};
