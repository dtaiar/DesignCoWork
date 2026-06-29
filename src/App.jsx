import { useState, useCallback } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import HomeTab from './tabs/HomeTab'
import ToolsTab from './tabs/ToolsTab'
import CaptureTab from './tabs/CaptureTab'
import PostsTab from './tabs/PostsTab'
import LibraryTab from './tabs/LibraryTab'
import SkillPanel from './panels/SkillPanel'
import OutputPanel from './panels/OutputPanel'
import PostPanel from './panels/PostPanel'
import CaptureDetailPanel from './panels/CaptureDetailPanel'
import ProjectPanel from './panels/ProjectPanel'
import { useCaptures } from './hooks/useCaptures'
import { useDrafts } from './hooks/useDrafts'
import { useOutputs } from './hooks/useOutputs'
import { useProject } from './hooks/useProject'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [activePanel, setActivePanel] = useState(null)
  const [activeSkill, setActiveSkill] = useState(null)
  const [skillOutput, setSkillOutput] = useState(null)
  const [skillPrefill, setSkillPrefill] = useState(null)
  const [postContext, setPostContext] = useState(null)
  const [captureDetail, setCaptureDetail] = useState(null)
  const [toast, setToast] = useState({ msg: '', show: false })

  const { captures, addCapture } = useCaptures()
  const { drafts, addDraft, deleteDraft } = useDrafts()
  const { outputs, addOutput, deleteOutput } = useOutputs()
  const { project, setActiveProject, clearProject } = useProject()

  const showToast = useCallback((msg) => {
    setToast({ msg, show: true })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2200)
  }, [])

  // ── Panel openers ────────────────────────────────────────────────────────────

  const openSkillPanel = (skill) => {
    setSkillPrefill(null)
    setActiveSkill(skill)
    setActivePanel('skill')
  }

  // Pre-fill from a capture's enriched brief
  const openSkillWithContext = (skill, capture) => {
    const brief = [
      capture.title,
      capture.source,
      '',
      'Key points:',
      ...(capture.points || []).map(p => `- ${p}`),
      '',
      'Why it matters:',
      capture.relevance,
    ].join('\n')
    setSkillPrefill(brief)
    setActiveSkill(skill)
    setActivePanel('skill')
  }

  // Pre-fill from plain text (brief output → skill propagation)
  const openSkillWithPrefill = (skill, text) => {
    setSkillPrefill(text)
    setActiveSkill(skill)
    setActivePanel('skill')
  }

  const openOutputPanel = (output) => { if (output) setSkillOutput(output); setActivePanel('output') }
  const openPostPanel = (ctx) => { setPostContext(ctx); setActivePanel('post') }
  const openCapturePanel = (capture) => { setCaptureDetail(capture); setActivePanel('capture') }
  const openProjectPanel = () => setActivePanel('project')
  const closePanel = () => setActivePanel(null)
  const runSkill = (output) => { closePanel(); setTimeout(() => openOutputPanel(output), 220) }

  // ── Tab map ──────────────────────────────────────────────────────────────────

  const tabs = { home: HomeTab, tools: ToolsTab, capture: CaptureTab, posts: PostsTab, library: LibraryTab }
  const ActiveTab = tabs[activeTab]

  return (
    <div className="app">
      <Header tab={activeTab} project={project} />
      <main className="tab-area">
        <ActiveTab
          onOpenSkill={openSkillPanel}
          onOpenOutput={openOutputPanel}
          onOpenPost={openPostPanel}
          onOpenCapture={openCapturePanel}
          onSwitchTab={setActiveTab}
          onOpenProject={openProjectPanel}
          showToast={showToast}
          captures={captures}
          addCapture={addCapture}
          drafts={drafts}
          onDeleteDraft={deleteDraft}
          outputs={outputs}
          onDeleteOutput={deleteOutput}
          project={project}
        />
      </main>
      <BottomNav active={activeTab} onSwitch={setActiveTab} />

      {/* Overlay — skip for ProjectPanel which has its own */}
      {activePanel && activePanel !== 'project' && <div className="overlay" onClick={closePanel} />}

      <SkillPanel
        open={activePanel === 'skill'}
        skill={activeSkill}
        onClose={closePanel}
        onRun={runSkill}
        prefill={skillPrefill}
      />
      <OutputPanel
        open={activePanel === 'output'}
        output={skillOutput}
        onClose={closePanel}
        showToast={showToast}
        onSaveOutput={addOutput}
        onOpenSkillWithPrefill={openSkillWithPrefill}
      />
      <PostPanel
        open={activePanel === 'post'}
        context={postContext}
        onClose={closePanel}
        showToast={showToast}
        onSaveDraft={addDraft}
      />
      <CaptureDetailPanel
        open={activePanel === 'capture'}
        capture={captureDetail}
        onClose={closePanel}
        onOpenPost={openPostPanel}
        onUseAsContext={openSkillWithContext}
        showToast={showToast}
      />
      <ProjectPanel
        open={activePanel === 'project'}
        project={project}
        onSave={setActiveProject}
        onClear={clearProject}
        onClose={closePanel}
      />

      <Toast msg={toast.msg} show={toast.show} />
    </div>
  )
}
