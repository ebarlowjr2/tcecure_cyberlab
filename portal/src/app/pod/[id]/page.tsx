import { redirect } from "next/navigation";

/**
 * Backward-compatible redirect: /pod/01 -> /training/status/pod/01
 * The old training.status.tcecure.com site used /pod/XX URLs directly.
 * This redirect ensures those links (including Guacamole banner links)
 * continue to work when nginx proxies to the portal.
 */
export default function PodRedirect({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/training/status/pod/${params.id}`);
}
