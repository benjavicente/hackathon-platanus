import { Link } from '@tanstack/react-router';
import icon from "@/assets/icon.png";

export function NavBar() {


  return (
    <div className="flex justify-between max-w-screen-xl mx-auto w-full">
      <Link to="/">
      <div className="flex items-center gap-1 mb-5">
        <img src={icon} alt="quompy logo" className="h-10 mx-auto" />
        <span className='text-sky-600 font-medium text-xl'>quompy.com</span>
      </div>
      </Link>
      <div></div>
      </div>
  );
}