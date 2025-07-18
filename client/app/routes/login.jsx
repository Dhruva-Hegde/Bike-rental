import LoginPage from "../login/Loginpage";

export function meta({ }) {
  return [
    { title: "Login" },
    { name: "description", content: "Login to your account" },
  ];
}

export default function Login() {
  return <LoginPage />;
}
