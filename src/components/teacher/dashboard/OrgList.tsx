import type { OrgCard } from "@/types";

interface OrgListProps {
  orgsOwned: OrgCard[];
  orgsMember: OrgCard[];
  onSelectOrg?: (orgId: string) => void;
}

export default function OrgList({ orgsOwned = [], orgsMember = [], onSelectOrg }: OrgListProps) {
  const ownedIds = new Set(orgsOwned.map((o) => o.id));
  const memberOnly = orgsMember.filter((o) => !ownedIds.has(o.id));

  return (
    <div className="space-y-4">
      {orgsOwned && orgsOwned.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-3 text-secondary">Owned</p>
          <div className="space-y-2">
            {orgsOwned.map((o) => (
              <button key={o.id} onClick={() => onSelectOrg?.(o.id)} className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted-10 hover:bg-muted-20 transition">
                {o.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={o.logo} alt={o.name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-semibold text-white">{o.name?.[0]?.toUpperCase()}</div>
                )}
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">{o.name}</div>
                  <div className="text-xs text-muted">{o.type}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold mb-3 text-secondary">Member</p>
        <div className="space-y-2">
          {memberOnly && memberOnly.length > 0 ? (
            memberOnly.map((o) => (
              <button key={o.id} onClick={() => onSelectOrg?.(o.id)} className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted-10 hover:bg-muted-20 transition">
                {o.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={o.logo} alt={o.name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-semibold text-white">{o.name?.[0]?.toUpperCase()}</div>
                )}
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">{o.name}</div>
                  <div className="text-xs text-muted">{o.role}</div>
                </div>
              </button>
            ))
          ) : (
            <div className="text-sm text-muted">No organizations</div>
          )}
        </div>
      </div>
    </div>
  );
}
