import { getWorks } from "@/lib/works";
import HomeClient from "./HomeClient";

export default function Home() {
  const projects = getWorks();
  return <HomeClient projects={projects} />;
}
