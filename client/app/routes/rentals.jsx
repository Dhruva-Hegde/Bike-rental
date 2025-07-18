import Rentalpage from "../rentals/Rentalpage";

export function meta({ }) {
  return [
    { title: "Rentals" },
    { name: "description", content: "View and manage your rentals" },
  ];
}

export default function Rentals() {
  return <Rentalpage />;
}
