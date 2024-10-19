import Navbar from "../components/Navbar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalenderMain from "../components/Calender/Calender";
import EventForm from "../components/Calender/createEvent";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EventList from "@/components/Calender/EventList";

const Home = () => {
  return (
    <div className="flex flex-col justify-center w-full h-full">
      <Navbar />;
      <div className="flex flex-row gap-4 w-full">
        <div className="ml-5 pt-7 h-[80vh]">
          <CalenderMain />
        </div>
        <EventList />
      </div>
    </div>
  );
};

export default Home;
