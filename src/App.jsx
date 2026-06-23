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
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [activePanel, setActivePanel] = useState(null)
  const [activeSkill, setActiveSkill] = useState(null)
  const [skillOutput, setSkillOutput] = useState(null)
  const [postContext, setPostContext] = useState(null)
  const [toast, setToast] = useState({ msg: '', show: false })

  const showToast = useCallback((msg) => {
    setToast({ msg, show: true })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2200)
  }, [])

  const openSkillPanel = (skill) => { setActiveSkill(skill); setActivePanel('skill') }
  const openOutputPanel = (output) => { if (output) setSkillOutput(output); setActivePanel('output') }
  const openPostPanel = (ctx) => { setPostContext(ctx); setActivePanel('post') }
  const closePanel = () => setActivePanel(null)
  const runSkill = (output) => { closePanel(); setTimeout(() => openOutputPanel(output), 220) }

  const tabs = { home: HomeTab, tools: ToolsTab, capture: CaptureTab, posts: PostsTab, library: LibraryTab }
  const ActiveTab = tabs[activeTab]

  return (
    <div className="app">
      <Header tab={activeTab} />
      <main className="tab-area">
        <ActiveTab
          onOpenSkill={openSkillPanel}
          onOpenOutput={openOutputPanel}
          onOpenPost={openPostPanel}
          onSwitchTab={setActiveTab}
          showToast={showToast}
        />
      </main>
      <BottomNav active={activeTab} onSwitch={setActiveTab} />
      {activePanel && <div className="overlay" onClick={closePanel} />}
      <SkillPanel open={activePanel === 'skill'} skill={activeSkill} onClose={closePanel} onRun={runSkill} />
      <OutputPanel open={activePanel === 'output'} output={skillOutput} onClose={closePanel} showToast={showToast} />
      <PostPanel open={activePanel === 'post'} context={postContext} onClose={closePanel} showToast={showToast} />
      <Toast msg={toast.msg} show={toast.show} />
    </div>
  )
}
