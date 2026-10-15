export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          slot_id: string;
          customer_id: string | null;
          customer_name: string;
          customer_phone: string;
          notes: string | null;
          status: "confirmed" | "cancelled" | "completed";
          created_at: string;
        };
        Insert: {
          id?: string;
          slot_id: string;
          customer_id?: string | null;
          customer_name: string;
          customer_phone: string;
          notes?: string | null;
          status?: "confirmed" | "cancelled" | "completed";
          created_at?: string;
        };
        Update: {
          id?: string;
          slot_id?: string;
          customer_id?: string | null;
          customer_name?: string;
          customer_phone?: string;
          notes?: string | null;
          status?: "confirmed" | "cancelled" | "completed";
        };
      };
      slots: {
        Row: {
          id: string;
          service_id: string;
          start_at: string;
          end_at: string;
          is_booked: boolean;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          duration_minutes: number;
          price: number | null;
        };
      };
    };
  };
};