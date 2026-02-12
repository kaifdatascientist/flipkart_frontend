import dynamic from "next/dynamic";

// 👇 Disable SSR ONLY for map
const LiveCourierMap = dynamic(
  () => import("./LiveCourierMap.client"),
  { ssr: false }
);

export default LiveCourierMap;
