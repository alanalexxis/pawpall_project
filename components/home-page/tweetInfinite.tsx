import Marquee from "@/components/magicui/marquee";
import TweetCard from "../magicui/tweet";

export function MarqueeDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg  ">
      <Marquee pauseOnHover className="[--duration:20s]">
        <TweetCard
          id="1819599887459041461"
          className="  rounded-xl border p-4"
        />
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        <TweetCard
          id="1819599887459041461"
          className="  rounded-xl border p-4"
        />
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
