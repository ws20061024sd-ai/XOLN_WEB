-- Repair the constraint required by upsert(..., { onConflict: 'word_id' }).
-- This retains the latest stored snapshot if historical duplicates exist.
-- Intended for the current shared, single-user schema; user isolation needs a separate migration.
BEGIN;
LOCK TABLE public.card_progress IN SHARE ROW EXCLUSIVE MODE;
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY word_id ORDER BY updated_at DESC NULLS LAST, total_reviews DESC NULLS LAST, id DESC
  ) AS position
  FROM public.card_progress
)
DELETE FROM public.card_progress WHERE id IN (SELECT id FROM ranked WHERE position > 1);
CREATE UNIQUE INDEX IF NOT EXISTS card_progress_word_id_unique ON public.card_progress(word_id);
COMMIT;
