-- Fix SELECT and UPDATE RLS policies on tasks table to allow creators (created_by) to view and manage their own tasks/meetings.
DROP POLICY IF EXISTS "Admin manager user task select" ON public.tasks;
DROP POLICY IF EXISTS "Admin manager task update and assigned status update" ON public.tasks;

CREATE POLICY "Admin manager user task select"
ON public.tasks
FOR SELECT
TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'manager'])
  OR assigned_to = auth.uid()
  OR assignee_id = auth.uid()
  OR created_by = auth.uid()
);

CREATE POLICY "Admin manager task update and assigned status update"
ON public.tasks
FOR UPDATE
TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'manager'])
  OR assigned_to = auth.uid()
  OR assignee_id = auth.uid()
  OR created_by = auth.uid()
)
WITH CHECK (
  public.has_any_role(auth.uid(), ARRAY['admin', 'manager'])
  OR assigned_to = auth.uid()
  OR assignee_id = auth.uid()
  OR created_by = auth.uid()
);
