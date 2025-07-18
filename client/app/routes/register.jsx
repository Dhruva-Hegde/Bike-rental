import RegisterPage from "../register/RegisterPage";

export function meta({ }) {
  return [
    { title: "Register" },
    { name: "description", content: "Create a new account" },
  ];
}

export default function Register() {
  return <RegisterPage />;
}
