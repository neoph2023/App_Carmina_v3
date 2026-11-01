'use client'

import { useRef, useState } from 'react'
import { Check, ChevronRight, FileText, FolderOpen, Sparkles, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type FilePickerProps = {
  label: string
  hint: string
  fileName?: string
  multiple?: boolean
  onChange: (files: FileList | null) => void
}

function FilePicker({ label, hint, fileName, multiple, onChange }: FilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-muted/20 p-4 transition-colors hover:border-primary/40 hover:bg-muted/35">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {multiple ? <FolderOpen aria-hidden="true" /> : <FileText aria-hidden="true" />}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>
          </div>
        </div>
        {fileName && <Check className="mt-1 text-emerald-600" aria-label="Archivo seleccionado" />}
      </div>
      {fileName ? (
        <div className="flex items-center justify-between gap-2 rounded-lg bg-background px-3 py-2 text-sm">
          <span className="truncate text-foreground">{fileName}</span>
          <button type="button" onClick={() => onChange(null)} className="text-muted-foreground transition-colors hover:text-foreground" aria-label={`Quitar ${label}`}>
            <X aria-hidden="true" />
          </button>
        </div>
      ) : (
        <>
          <input ref={inputRef} type="file" accept="application/pdf,.pdf" multiple={multiple} {...(multiple ? { webkitdirectory: '' } : {})} className="sr-only" onChange={(event) => onChange(event.target.files)} />
          <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => inputRef.current?.click()}>
            <Upload data-icon="inline-start" />
            {multiple ? 'Elegir carpeta' : 'Cargar PDF'}
          </Button>
        </>
      )}
    </div>
  )
}

export function EvaluationForm() {
  const [subject, setSubject] = useState('')
  const [criteria, setCriteria] = useState('')
  const [exam, setExam] = useState<File | null>(null)
  const [folderCount, setFolderCount] = useState(0)
  const canPickFiles = subject.trim().length > 0 && criteria.trim().length > 0
  const canProcess = canPickFiles && exam !== null && folderCount > 0

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-primary">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles aria-hidden="true" /></div>
              EVALUACIÓN IA
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Corrige exámenes con criterio y consistencia</h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">Configura la evaluación, añade el examen de referencia y deja que la IA revise cada entrega.</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex"><span className="size-2 rounded-full bg-emerald-500" />Listo para configurar</div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="flex flex-col gap-6" aria-labelledby="configuracion-title">
            <div className="flex flex-col gap-1"><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">01 / Configuración</p><h2 id="configuracion-title" className="text-xl font-semibold">Define el contexto de evaluación</h2></div>
            <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
              <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="subject">Materia a evaluar<input id="subject" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Ej. Historia del arte" className="min-h-12 rounded-xl border border-input bg-background px-4 text-base font-normal outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40" /></label>
              <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="criteria">Indicaciones para la corrección<textarea id="criteria" value={criteria} onChange={(event) => setCriteria(event.target.value)} placeholder="Describe qué debe valorar la IA: criterios, puntuación, errores frecuentes, nivel de exigencia…" rows={6} className="resize-none rounded-xl border border-input bg-background px-4 py-3 text-base font-normal leading-relaxed outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40" /></label>
              <p className="text-xs text-muted-foreground">Estos datos se usarán como guía común para todos los exámenes.</p>
            </div>
          </section>

          <section className="flex flex-col gap-6" aria-labelledby="archivos-title">
            <div className="flex flex-col gap-1"><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">02 / Archivos</p><h2 id="archivos-title" className="text-xl font-semibold">Añade el material</h2></div>
            <div className="flex flex-col gap-4">
              <FilePicker label="Preguntas del examen" hint="PDF de referencia con las preguntas y el enunciado." fileName={exam?.name} onChange={(files) => setExam(files?.[0] ?? null)} />
              <FilePicker label="Exámenes a corregir" hint="Selecciona una carpeta con los PDFs de los alumnos." multiple fileName={folderCount ? `${folderCount} PDF${folderCount === 1 ? '' : 's'} seleccionados` : undefined} onChange={(files) => setFolderCount(files ? Array.from(files).filter((file) => file.type === 'application/pdf' || file.name.endsWith('.pdf')).length : 0)} />
            </div>
            <Button type="button" size="lg" disabled={!canProcess} className="mt-2 h-12 w-full rounded-xl text-base shadow-sm" onClick={() => undefined}>
              <Sparkles data-icon="inline-start" />
              Procesar exámenes con IA
              <ChevronRight data-icon="inline-end" />
            </Button>
            <p className="text-center text-xs text-muted-foreground">{!canPickFiles ? 'Completa la materia y las indicaciones para continuar.' : !canProcess ? 'Carga el PDF de referencia y la carpeta de exámenes.' : 'Todo listo para iniciar la corrección.'}</p>
          </section>
        </div>
      </div>
    </main>
  )
}
