import { Redirect } from "expo-router";

export default function Index() {
  //  maps "/" path to "/login"
  return <Redirect href="/login" />;
}
