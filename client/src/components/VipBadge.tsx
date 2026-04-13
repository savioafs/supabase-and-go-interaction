import { Trophy } from 'lucide-react'

export const VipBadge = () => {
  return (
    <div className="vip-badge flex items-center gap-1.5 animate-bounce">
      <Trophy size={14} />
      <span>VIP MEMBER</span>
    </div>
  )
}
