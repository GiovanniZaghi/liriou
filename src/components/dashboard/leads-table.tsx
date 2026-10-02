import type { Lead } from '@/db/schema'
import { formatDateTime, formatPhone, painLabel } from '@/lib/format'

export function LeadsTable({ rows }: { rows: Lead[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-[20px] border border-linho bg-white px-6 py-14 text-center text-[14px] text-musgo">
        Nenhum cadastro encontrado.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-[20px] border border-linho bg-white">
      <table className="w-full min-w-[860px] text-left text-[14px]">
        <thead className="border-b border-linho text-[12px] font-semibold tracking-[0.08em] text-musgo uppercase">
          <tr>
            <th scope="col" className="px-5 py-3.5 font-semibold">Data</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Nome</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">E-mail</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">WhatsApp</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Pesadelo</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Origem</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((lead) => (
            <tr key={lead.id} className="border-b border-linho/70 last:border-0 hover:bg-leite/60">
              <td className="px-5 py-3.5 whitespace-nowrap text-musgo tabular-nums">{formatDateTime(lead.createdAt)}</td>
              <td className="px-5 py-3.5 font-medium whitespace-nowrap text-noite-900">{lead.name}</td>
              <td className="px-5 py-3.5">
                <a href={`mailto:${lead.email}`} className="text-tinta hover:text-rubor hover:underline">
                  {lead.email}
                </a>
              </td>
              <td className="px-5 py-3.5 whitespace-nowrap tabular-nums">
                <a
                  href={`https://wa.me/55${lead.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-folha hover:underline"
                >
                  {formatPhone(lead.whatsapp)}
                </a>
              </td>
              <td className={`px-5 py-3.5 ${lead.pain ? 'text-tinta' : 'text-musgo'}`}>{painLabel(lead.pain)}</td>
              <td className="px-5 py-3.5 text-musgo">{lead.utm?.utm_source ?? 'Direto'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
