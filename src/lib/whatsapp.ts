/**
 * WhatsApp helpers for booking notifications.
 * Uses wa.me deep links — opens WhatsApp app on mobile, WhatsApp Web on desktop.
 */

export interface BookingWhatsAppData {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  startAt: string; // ISO
  notes?: string | null;
  clinicPhone: string; // country code + number, no +, no spaces
}

function formatArabicDateTime(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} — ${time}`;
}

export function buildWhatsAppMessage(data: BookingWhatsAppData): string {
  const lines = [
    "🌸 *حجز جديد من شوشو كلينك*",
    "",
    `👤 الاسم: ${data.customerName}`,
    `📞 الهاتف: ${data.customerPhone}`,
    `💆 الخدمة: ${data.serviceName}`,
    `📅 الموعد: ${formatArabicDateTime(data.startAt)}`,
  ];

  if (data.notes) {
    lines.push(`📝 ملاحظات: ${data.notes}`);
  }

  lines.push("");
  lines.push(`🔖 رقم الحجز: ${data.bookingId.slice(-8).toUpperCase()}`);

  return lines.join("\n");
}

export function buildWhatsAppUrl(data: BookingWhatsAppData): string {
  const phone = data.clinicPhone.replace(/\D/g, "");
  const text = encodeURIComponent(buildWhatsAppMessage(data));
  return `https://wa.me/${phone}?text=${text}`;
}