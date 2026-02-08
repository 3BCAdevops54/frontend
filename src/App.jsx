import React, { useEffect, useState, useMemo } from 'react'

const API = '/jobs'

export default function App(){
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ companyName:'', jobTitle:'', status:'APPLIED', location:'', applicationDate:'' })

  useEffect(()=>{ loadJobs() }, [])

  async function loadJobs(){
    setLoading(true)
    try{
      const res = await fetch(API)
      const data = await res.json()
      setJobs(Array.isArray(data) ? data : [])
    } catch(err){
      console.error(err)
    } finally{ setLoading(false) }
  }

  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase()
    return jobs.filter(j=>{
      if(statusFilter !== 'ALL' && j.status !== statusFilter) return false
      if(!q) return true
      return (j.companyName||'').toLowerCase().includes(q) || (j.jobTitle||'').toLowerCase().includes(q) || (j.location||'').toLowerCase().includes(q)
    })
  }, [jobs, query, statusFilter])

  function openNew(){
    setEditing(null)
    setForm({ companyName:'', jobTitle:'', status:'APPLIED', location:'', applicationDate:'' })
    setShowModal(true)
  }

  function openEdit(job){
    setEditing(job.id)
    setForm({ companyName:job.companyName||'', jobTitle:job.jobTitle||'', status:job.status||'APPLIED', location:job.location||'', applicationDate:job.applicationDate||'' })
    setShowModal(true)
  }

  async function removeJob(id){
    if(!confirm('Delete this job?')) return
    await fetch(`${API}/${id}`, { method:'DELETE' })
    loadJobs()
  }

  async function submit(e){
    e.preventDefault()
    try{
      if(editing){
        await fetch(`${API}/${editing}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
      }else{
        await fetch(API, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
      }
      setShowModal(false)
      setEditing(null)
      loadJobs()
    }catch(err){
      console.error(err)
    }
  }

  function statusClasses(status){
    const s = (status||'').toUpperCase()
    if(s === 'INTERVIEW') return 'bg-amber-100 text-amber-800'
    if(s === 'OFFERED') return 'bg-green-100 text-green-800'
    if(s === 'REJECTED') return 'bg-red-100 text-red-800'
    return 'bg-slate-100 text-slate-800'
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-blue-600">JobTracker</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={openNew} className="transition-all inline-flex items-center py-2 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">Add Job</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter bar */}
        <div className="mb-6 flex items-center gap-4">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by company, title or location" className="flex-1 h-12 px-4 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="h-12 px-4 rounded-lg border border-slate-300 bg-white text-sm">
            <option value="ALL">All statuses</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFERED">Offered</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button onClick={loadJobs} className="h-12 px-4 rounded-lg border border-slate-300 bg-white text-sm">Refresh</button>
        </div>


        {/* Table card */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">Applications</h2>
          </div>


          <div className="p-4">
            {loading ? (
              <div className="py-12 text-center text-sm text-slate-500">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-3 text-center">
                <svg className="w-14 h-14 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7h18M3 12h18M3 17h18" />
                </svg>
                <div className="text-lg font-medium text-slate-700">No applications found yet</div>
                <div className="text-sm text-slate-400">You don't have any tracked applications. Click Add Job to create one.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-slate-500 font-bold uppercase text-xs">ID</th>
                      <th className="py-3 px-4 text-left text-slate-500 font-bold uppercase text-xs">Company</th>
                      <th className="py-3 px-4 text-left text-slate-500 font-bold uppercase text-xs">Title</th>
                      <th className="py-3 px-4 text-left text-slate-500 font-bold uppercase text-xs">Date</th>
                      <th className="py-3 px-4 text-left text-slate-500 font-bold uppercase text-xs">Status</th>
                      <th className="py-3 px-4 text-left text-slate-500 font-bold uppercase text-xs">Location</th>
                      <th className="py-3 px-4 text-right text-slate-500 font-bold uppercase text-xs">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map(job => (
                      <tr key={job.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-700">{job.id}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{job.companyName}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{job.jobTitle}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{job.applicationDate}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses(job.status)}`}>{job.status}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">{job.location}</td>
                        <td className="px-4 py-3 text-sm text-right">
                          <div className="inline-flex items-center gap-2 justify-end">
                            <button onClick={()=>openEdit(job)} className="px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-700 hover:bg-slate-50">Edit</button>
                            <button onClick={()=>removeJob(job.id)} className="px-3 py-1.5 border border-red-200 rounded-md text-sm text-red-600 hover:bg-red-50">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-800">{editing ? 'Edit Application' : 'Add Application'}</h3>
              <button onClick={()=>{ setShowModal(false); setEditing(null) }} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={form.companyName} onChange={e=>setForm({...form, companyName:e.target.value})} placeholder="Company" required className="px-3 py-2 border border-slate-200 rounded-md" />
                <input value={form.jobTitle} onChange={e=>setForm({...form, jobTitle:e.target.value})} placeholder="Job Title" required className="px-3 py-2 border border-slate-200 rounded-md" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})} className="px-3 py-2 border border-slate-200 rounded-md">
                  <option>APPLIED</option>
                  <option>INTERVIEW</option>
                  <option>OFFERED</option>
                  <option>REJECTED</option>
                </select>
                <input value={form.location} onChange={e=>setForm({...form, location:e.target.value})} placeholder="Location" className="px-3 py-2 border border-slate-200 rounded-md" />
              </div>
              <div>
                <input type="date" value={form.applicationDate} onChange={e=>setForm({...form, applicationDate:e.target.value})} className="px-3 py-2 border border-slate-200 rounded-md" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={()=>{ setShowModal(false); setEditing(null) }} className="px-4 py-2 rounded-md border border-slate-200">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
