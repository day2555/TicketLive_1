export default interface IEvent {
  id: number;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  capacity: number;
  price: number;
  imageUrl: string;
  status: boolean;
  category: string;
}