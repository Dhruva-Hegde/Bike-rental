import DashboardPage from "../dashboard/DashboardPage";

export function meta({ }) {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Your dashboard" },
  ];
}

export default function Dashboard() {
  return <DashboardPage />;
}
