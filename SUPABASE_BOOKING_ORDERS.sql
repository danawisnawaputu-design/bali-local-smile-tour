CREATE TABLE IF NOT EXISTS public.booking_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name text NOT NULL,
  category text NOT NULL,
  price_text text,
  amount numeric(14, 2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.booking_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can create pending booking orders" ON public.booking_orders;
CREATE POLICY "Public can create pending booking orders"
  ON public.booking_orders FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS "Authenticated users can read booking orders" ON public.booking_orders;
CREATE POLICY "Authenticated users can read booking orders"
  ON public.booking_orders FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can update booking orders" ON public.booking_orders;
CREATE POLICY "Authenticated users can update booking orders"
  ON public.booking_orders FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (status IN ('pending', 'accepted', 'rejected'));

GRANT INSERT ON public.booking_orders TO anon, authenticated;
GRANT SELECT, UPDATE ON public.booking_orders TO authenticated;