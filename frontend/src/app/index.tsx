import { useAuth } from "@/context/authContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Redirect href="/pages" />;
  } else {
    return <Redirect href="/auth/login" />;
  }
}
