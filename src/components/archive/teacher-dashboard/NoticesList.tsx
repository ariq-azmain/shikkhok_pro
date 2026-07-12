import React from "react";

export default function NoticesList({ notices }: any) {
  if (!notices || notices.length === 0)
    return <p className="text-sm text-muted">No notices</p>;

  return (
    <div className="space-y-2">
      {notices.map((n: any) => (
        <div key={n.id} className="p-2 rounded-md bg-white/3">
          <div className="font-medium">{n.title}</div>
          <div className="text-xs text-muted">
            {n.postedBy?.displayName ?? n.postedBy?.username}
          </div>
        </div>
      ))}
    </div>
  );
}
