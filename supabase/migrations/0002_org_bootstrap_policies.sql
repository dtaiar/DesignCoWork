-- Allow a signed-in user to create their own organization and add themself as owner.
-- Invite-based membership (adding other users) is not yet supported.

create policy "authenticated users can create an org" on organizations
  for insert to authenticated
  with check (true);

create policy "users can add themself to an org" on org_members
  for insert to authenticated
  with check (user_id = auth.uid());
