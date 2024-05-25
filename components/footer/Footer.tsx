export default function Footer() {
  return (
    <div className="z-[3] items-center absolute bottom-5 left-0 right-0 mx-auto">
      <ul className="flex flex-row justify-center">
        <li className="mr-4 md:mr-[44px]">
          <a
            className="text-[10px] font-medium text-zinc-950 dark:text-zinc-400 lg:text-sm"
            target="_blank"
            href="https://horizon-ui.notion.site/Terms-Conditions-c671e573673746e19d2fc3e4cba0c161"
          >
            Terms & Conditions
          </a>
        </li>
        <li className="mr-4 md:mr-[44px]">
          <a
            className="text-[10px] font-medium text-zinc-950 dark:text-zinc-400 lg:text-sm"
            target="_blank"
            href="https://horizon-ui.notion.site/Privacy-Policy-c22ff04f55474ae3b35ec45feca62bad"
          >
            Privacy Policy
          </a>
        </li>
        <li className="mr-4 md:mr-[44px]">
          <a
            className="text-[10px] font-medium text-zinc-950 dark:text-zinc-400 lg:text-sm"
            target="_blank"
            href="https://horizon-ui.notion.site/End-User-License-Agreement-8fb09441ea8c4c08b60c37996195a6d5"
          >
            License
          </a>
        </li>
        <li>
          <a
            className="text-[10px] font-medium text-zinc-950 dark:text-zinc-400 lg:text-sm"
            target="_blank"
            href="https://horizon-ui.notion.site/Refund-Policy-1b0983287b92486cb6b18071b2343ac9"
          >
            Refund Policy
          </a>
        </li>
      </ul>
    </div>
  );
}
