import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocale } from "@react-aria/i18n";
import { CalendarIcon, Clock4 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { timeZones } from "./time-zones";
import { useUser } from "@/contexts/userContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function LeftPanel({
  showForm,
  timeZone,
  setTimeZone,
}: {
  showForm: boolean | null;
  timeZone: string;
  setTimeZone: (timeZone: string) => void;
}) {
  const { locale } = useLocale();

  const searchParams = useSearchParams();
  const slotParam = searchParams.get("slot");
  const { user, setUser } = useUser();
  return (
    <div className="flex flex-col gap-4 w-[280px] border-r pr-6">
      <div className="grid gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  user?.user_metadata?.avatar_url ??
                  "https://example.com/default-avatar.png"
                }
                alt={user?.user_metadata?.full_name ?? "Usuario"}
              />
              <AvatarFallback className="bg-transparent">
                {(() => {
                  if (!user?.user_metadata?.full_name) return "U";
                  const names = user.user_metadata.full_name.split(" ");
                  return names
                    .slice(0, 2)
                    .map((name: any[]) => name[0])
                    .join("")
                    .toUpperCase();
                })()}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            {" "}
            {user?.user_metadata?.full_name ?? "Usuario"}
          </TooltipContent>
        </Tooltip>
        <p className="text-gray-11 text-sm font-semibold">
          {user?.user_metadata?.full_name ?? "Usuario"}
        </p>
      </div>
      <div className="grid gap-3">
        <p className="text-gray-12 text-2xl font-bold">Cita</p>
        {showForm && (
          <div className="flex text-gray-12">
            <CalendarIcon className="size-4 mr-2" />
            <div className="flex flex-col text-sm font-semibold">
              <p>
                {new Date(slotParam as string).toLocaleString(locale, {
                  dateStyle: "full",
                })}
              </p>
              <p>
                {new Date(slotParam as string).toLocaleString(locale, {
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center text-gray-12">
          <Clock4 className="size-4 mr-2" />
          <p className="text-sm font-semibold">30 mins</p>
        </div>

        <Select value={timeZone} onValueChange={setTimeZone}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Select time zone">
              {timeZone.replace(/_/g, " ").split("(")[0].trim()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="w-fit dark:bg-gray-5">
            {timeZones.map((timeZone) => (
              <SelectItem
                key={timeZone.label}
                value={timeZone.tzCode}
                className="dark:focus:bg-gray-2"
              >
                {timeZone.label.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
