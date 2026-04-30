import { getNavigation } from "@/lib/content";
import NavInner from "@/components/nav-inner";

export default function Nav() {
  const nav = getNavigation();
  return <NavInner nav={nav} />;
}
