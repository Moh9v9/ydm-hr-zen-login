
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ar from "date-fns/locale/ar";
import enUS from "date-fns/locale/en-US";

interface AttendanceHeaderProps {
  selectedDate: Date;
}

export function AttendanceHeader({ selectedDate }: AttendanceHeaderProps) {
  const { t, language } = useLanguage();
  
  const locale = language === "ar" ? ar : enUS;
  const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy", { locale });
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">{t("attendance.title")}</h2>
          <p className="text-muted-foreground">
            {t("attendance.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
