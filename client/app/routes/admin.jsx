import AdminPage from "../admin/AdminPage"

export function meta({}) {
  return [
    { title: "Admin Panel - BikeRent" },
    { name: "description", content: "Admin panel for managing bikes and rentals" },
  ]
}

export default function Admin() {
  return <AdminPage />
}
