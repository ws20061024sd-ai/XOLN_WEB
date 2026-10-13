-- Apply only after exporting personal local progress.
-- Existing rows without user_id are preserved but hidden by RLS; do not guess their owner.
BEGIN;
ALTER TABLE public.card_progress ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.error_records ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.error_records ADD COLUMN IF NOT EXISTS count integer NOT NULL DEFAULT 1;
DROP INDEX IF EXISTS public.card_progress_word_id_unique;
CREATE UNIQUE INDEX IF NOT EXISTS card_progress_user_word_unique ON public.card_progress(user_id, word_id);
CREATE UNIQUE INDEX IF NOT EXISTS error_records_user_question_unique ON public.error_records(user_id, module, question_id);
CREATE UNIQUE INDEX IF NOT EXISTS user_progress_user_unique ON public.user_progress(user_id);
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous access" ON public.user_progress;
DROP POLICY IF EXISTS "Allow anonymous access" ON public.card_progress;
DROP POLICY IF EXISTS "Allow anonymous access" ON public.error_records;
DROP POLICY IF EXISTS "Personal learning access" ON public.user_progress;
DROP POLICY IF EXISTS "Personal learning access" ON public.card_progress;
DROP POLICY IF EXISTS "Personal learning access" ON public.error_records;
CREATE POLICY "Personal learning access" ON public.user_progress FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Personal learning access" ON public.card_progress FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Personal learning access" ON public.error_records FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
COMMIT;
-- Verify no additional permissive policies remain in pg_policies before deployment.
