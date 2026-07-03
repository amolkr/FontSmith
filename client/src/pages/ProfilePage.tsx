import { UserRound } from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

export function ProfilePage() {
  const { user } = useAuth();
  return (
    <div className="pb-24 lg:pb-0">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Workspace</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">Public workspace settings</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <GlassCard className="p-6">
          <div className="grid h-24 w-24 place-items-center rounded-lg bg-sea/15 text-sea">
            <UserRound className="h-10 w-10" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold">{user?.name}</h2>
          <p className="mt-1 text-ink/55 dark:text-paper/55">{user?.email}</p>
          <p className="mt-5 rounded-lg bg-brass/15 px-4 py-3 text-sm font-bold text-brass">{user.plan} access</p>
        </GlassCard>
        <GlassCard className="p-6">
          <h2 className="text-xl font-extrabold">Workspace details</h2>
          <div className="mt-5 grid gap-4">
            <Input label="Display name" value={user.name} readOnly />
            <Input label="Contact" value={user.email} readOnly />
            <Input label="Default preview sentence" defaultValue="The quick brown fox jumps over the lazy dog" />
            <Button className="w-fit">Save settings</Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
