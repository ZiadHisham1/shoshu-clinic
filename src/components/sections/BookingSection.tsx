import { Calendar } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import {
  AnimatedContainer,
  AnimatedItem,
} from "@/components/ui/AnimatedContainer";

const BookingSection = () => (
  <section id="booking" aria-labelledby="booking-title">
    <AnimatedContainer>
      <AnimatedItem>
        <div className="w-full rounded-[24px] border border-black/10 bg-figma-card p-4 sm:rounded-[31px] sm:p-6">
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex flex-1 flex-col items-start gap-3 text-start sm:items-start sm:text-end">
             <div>
              <p className="font-tajawal text-start text-xl font-extrabold text-figma-text sm:text-2xl">
                احجزي جلستك الان
              </p>
              
              <div className="mt-2 font-tajawal text-start max-w-lg text-figma-text sm:text-lg">
                <span className="font-bold px-1 block mb-3">
                   كشف اولي يشمل قياس:
                </span>
                
                {/* 3 Columns x 2 Rows Grid */}
                <ul className="grid grid-cols-3 grid-rows-2 gap-x-2 gap-y-3 text-sm sm:text-base">
                  <li className="flex items-center gap-1.5">
                    <span className="text-green-600 font-bold">✓</span> InBody
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-green-600 font-bold">✓</span> نسبة الدهون
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-green-600 font-bold">✓</span> نسبة المياه
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-green-600 font-bold">✓</span> نسبة العضلات
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-green-600 font-bold">✓</span> معدلات الحرق
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-green-600 font-bold">✓</span> خطة لجسمك
                  </li>
                </ul>
              </div>
            </div>

              <a
                href={siteConfig.bookingUrl}
                className="flex h-16 w-full items-center border border-black/10 justify-center gap-2 rounded-[20px] bg-white px-6 font-tajawal text-base font-extrabold text-[#747474] transition hover:bg-white/90 sm:h-[43px] sm:w-auto sm:text-[18px]"
              >
                احجزي الان
                <Calendar className="h-5 w-5" />
              </a>
            </div>

            <div className="hidden h-[100px] w-[100px] shrink-0 items-center justify-center rounded-full bg-white sm:flex">
              <Calendar className="h-12 w-12 text-figma-card" />
            </div>
          </div>
        </div>
      </AnimatedItem>
    </AnimatedContainer>
  </section>
);

export default BookingSection;