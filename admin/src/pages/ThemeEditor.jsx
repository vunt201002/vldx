import React, { useReducer, useEffect, useCallback, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { get, put, post, del } from '@/lib/api'
import ThemeEditorSidebar from '@/components/theme-editor/ThemeEditorSidebar'
import ThemePreview from '@/components/theme-editor/ThemePreview'
import BlockEditorPanel from '@/components/theme-editor/BlockEditorPanel'
import { useLayout } from '@/context/LayoutContext'
import '@/styles/theme-editor.css'

const initialState = {
  page: { title: '', description: '', bodyClass: '' },
  headerBlocks: [],
  bodyBlocks: [],
  footerBlocks: [],
  fieldDefs: [],
  activeBlockId: null,
  activeSection: 'body', // 'header', 'body', or 'footer'
  dirty: false,
  dirtyGlobal: false, // Track if global sections (header/footer) are modified
  saving: false,
  loading: true,
  error: null,
  toast: null,
  previewKey: 0,
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...initialState, loading: true }
    case 'LOADED':
      return {
        ...state,
        page: action.page,
        headerBlocks: action.headerBlocks,
        bodyBlocks: action.bodyBlocks,
        footerBlocks: action.footerBlocks,
        fieldDefs: action.fieldDefs,
        loading: false,
        dirty: false,
        dirtyGlobal: false,
        activeBlockId: action.bodyBlocks[0]?._id || null,
        activeSection: 'body',
      }
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.error }
    case 'SELECT_BLOCK':
      return { ...state, activeBlockId: action.id, activeSection: action.section }
    case 'UPDATE_PAGE':
      return { ...state, page: action.page, dirty: true }
    case 'UPDATE_BLOCK': {
      const section = action.section || state.activeSection
      const blockKey = section === 'header' ? 'headerBlocks' : section === 'footer' ? 'footerBlocks' : 'bodyBlocks'
      const blocks = state[blockKey].map((b) =>
        b._id === action.id ? { ...b, ...action.updates } : b
      )
      const isGlobal = section === 'header' || section === 'footer'
      return {
        ...state,
        [blockKey]: blocks,
        dirty: !isGlobal || state.dirty,
        dirtyGlobal: isGlobal || state.dirtyGlobal
      }
    }
    case 'REORDER': {
      const section = action.section || state.activeSection
      const blockKey = section === 'header' ? 'headerBlocks' : section === 'footer' ? 'footerBlocks' : 'bodyBlocks'
      const blocks = [...state[blockKey]]
      const [moved] = blocks.splice(action.from, 1)
      blocks.splice(action.to, 0, moved)
      const isGlobal = section === 'header' || section === 'footer'
      return {
        ...state,
        [blockKey]: blocks,
        dirty: !isGlobal || state.dirty,
        dirtyGlobal: isGlobal || state.dirtyGlobal
      }
    }
    case 'ADD_BLOCK': {
      const section = action.section || state.activeSection
      const blockKey = section === 'header' ? 'headerBlocks' : section === 'footer' ? 'footerBlocks' : 'bodyBlocks'
      const isGlobal = section === 'header' || section === 'footer'
      return {
        ...state,
        [blockKey]: [...state[blockKey], action.block],
        activeBlockId: action.block._id,
        activeSection: section,
        dirty: !isGlobal || state.dirty,
        dirtyGlobal: isGlobal || state.dirtyGlobal
      }
    }
    case 'DELETE_BLOCK': {
      const section = action.section || state.activeSection
      const blockKey = section === 'header' ? 'headerBlocks' : section === 'footer' ? 'footerBlocks' : 'bodyBlocks'
      const blocks = state[blockKey].filter((b) => b._id !== action.id)
      const activeBlockId =
        state.activeBlockId === action.id
          ? blocks[0]?._id || null
          : state.activeBlockId
      const isGlobal = section === 'header' || section === 'footer'
      return {
        ...state,
        [blockKey]: blocks,
        activeBlockId,
        dirty: !isGlobal || state.dirty,
        dirtyGlobal: isGlobal || state.dirtyGlobal
      }
    }
    case 'SAVING':
      return { ...state, saving: true }
    case 'SAVED':
      return {
        ...state,
        saving: false,
        dirty: false,
        dirtyGlobal: false,
        previewKey: state.previewKey + 1,
        toast: { type: 'success', message: 'Saved! Preview updated.' },
      }
    case 'SAVE_ERROR':
      return { ...state, saving: false, toast: { type: 'error', message: action.error } }
    case 'CLEAR_TOAST':
      return { ...state, toast: null }
    default:
      return state
  }
}

export default function ThemeEditor() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [pages, setPages] = useState([])
  const [viewport, setViewport] = useState('desktop')
  const toastTimer = useRef(null)
  const layout = useLayout()

  const handleViewportChange = useCallback((vp) => {
    setViewport(vp)
    if (layout) {
      layout.setCollapsed(vp === 'desktop')
    }
  }, [layout])

  // Load page list
  useEffect(() => {
    get('/theme/pages').then((res) => setPages(res.data)).catch(() => {})
  }, [])

  // Redirect to first page if no slug
  useEffect(() => {
    if (!slug && pages.length > 0) {
      navigate(`/theme-editor/${pages[0].slug}`, { replace: true })
    }
  }, [slug, pages, navigate])

  // Load page data when slug changes
  useEffect(() => {
    if (!slug) return
    dispatch({ type: 'LOADING' })
    async function load() {
      try {
        const [themeRes, defsRes, activeThemeRes] = await Promise.all([
          get(`/theme/pages/${slug}`),
          get('/theme/field-defs'),
          get('/theme/active'),
        ])

        dispatch({
          type: 'LOADED',
          page: themeRes.data.page,
          headerBlocks: activeThemeRes.data?.header?.blocks || [],
          bodyBlocks: themeRes.data.blocks,
          footerBlocks: activeThemeRes.data?.footer?.blocks || [],
          fieldDefs: defsRes.data,
        })
      } catch (err) {
        dispatch({ type: 'LOAD_ERROR', error: err.message })
      }
    }
    load()
  }, [slug])

  useEffect(() => {
    if (state.toast) {
      clearTimeout(toastTimer.current)
      toastTimer.current = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 3000)
    }
    return () => clearTimeout(toastTimer.current)
  }, [state.toast])

  useEffect(() => {
    const handler = (e) => {
      if (state.dirty || state.dirtyGlobal) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [state.dirty, state.dirtyGlobal])

  const handlePageSwitch = useCallback((newSlug) => {
    const hasUnsaved = state.dirty || state.dirtyGlobal
    if (hasUnsaved && !window.confirm('You have unsaved changes. Switch page anyway?')) return
    navigate(`/theme-editor/${newSlug}`)
  }, [state.dirty, state.dirtyGlobal, navigate])

  const handleSave = useCallback(async () => {
    // Warn if saving global sections
    if (state.dirtyGlobal) {
      const confirmed = window.confirm(
        '⚠️ You are about to save changes to global header/footer sections.\n\nThese changes will affect ALL pages on your site.\n\nContinue?'
      )
      if (!confirmed) return
    }

    dispatch({ type: 'SAVING' })
    try {
      const promises = []

      // Save page body if dirty
      if (state.dirty) {
        promises.push(
          put(`/theme/pages/${slug}`, {
            page: state.page,
            blocks: state.bodyBlocks,
          })
        )
      }

      // Save global header if dirty
      if (state.dirtyGlobal) {
        promises.push(
          put('/theme/header', {
            blocks: state.headerBlocks,
          }),
          put('/theme/footer', {
            blocks: state.footerBlocks,
          })
        )
      }

      await Promise.all(promises)
      dispatch({ type: 'SAVED' })
    } catch (err) {
      dispatch({ type: 'SAVE_ERROR', error: err.message })
    }
  }, [slug, state.page, state.bodyBlocks, state.headerBlocks, state.footerBlocks, state.dirty, state.dirtyGlobal])

  const handleDiscard = useCallback(async () => {
    if (!window.confirm('Discard all unsaved changes?')) return
    dispatch({ type: 'LOADING' })
    try {
      const [themeRes, defsRes, activeThemeRes] = await Promise.all([
        get(`/theme/pages/${slug}`),
        get('/theme/field-defs'),
        get('/theme/active'),
      ])
      dispatch({
        type: 'LOADED',
        page: themeRes.data.page,
        headerBlocks: activeThemeRes.data?.header?.blocks || [],
        bodyBlocks: themeRes.data.blocks,
        footerBlocks: activeThemeRes.data?.footer?.blocks || [],
        fieldDefs: defsRes.data,
      })
    } catch (err) {
      dispatch({ type: 'LOAD_ERROR', error: err.message })
    }
  }, [slug])

  const handleAddBlock = useCallback(async (type, section = 'body') => {
    try {
      let res
      if (section === 'header') {
        res = await post('/theme/header/blocks', { type })
      } else if (section === 'footer') {
        res = await post('/theme/footer/blocks', { type })
      } else {
        res = await post(`/theme/pages/${slug}/blocks`, { type })
      }
      dispatch({ type: 'ADD_BLOCK', block: res.data, section })
    } catch (err) {
      dispatch({ type: 'SAVE_ERROR', error: err.message })
    }
  }, [slug])

  const handleCloneBlock = useCallback(async (sourceBlockId, section = 'body') => {
    try {
      let res
      if (section === 'header') {
        res = await post('/theme/header/blocks/clone', { sourceBlockId })
      } else if (section === 'footer') {
        res = await post('/theme/footer/blocks/clone', { sourceBlockId })
      } else {
        res = await post(`/theme/pages/${slug}/blocks/clone`, { sourceBlockId })
      }
      dispatch({ type: 'ADD_BLOCK', block: res.data, section })
    } catch (err) {
      dispatch({ type: 'SAVE_ERROR', error: err.message })
    }
  }, [slug])

  const handleDeleteBlock = useCallback(async (id, section = 'body') => {
    if (!window.confirm('Remove this section?')) return
    try {
      if (section === 'header') {
        await del(`/theme/header/blocks/${id}`)
      } else if (section === 'footer') {
        await del(`/theme/footer/blocks/${id}`)
      } else {
        await del(`/theme/pages/${slug}/blocks/${id}`)
      }
      dispatch({ type: 'DELETE_BLOCK', id, section })
    } catch (err) {
      dispatch({ type: 'SAVE_ERROR', error: err.message })
    }
  }, [slug])

  const handleCreatePage = useCallback(async (newSlug, newTitle) => {
    try {
      const res = await post('/theme/pages', { slug: newSlug, title: newTitle })
      if (res.success) {
        // Refresh page list and navigate to the new page
        const listRes = await get('/theme/pages')
        setPages(listRes.data)
        navigate(`/theme-editor/${newSlug}`)
      }
    } catch (err) {
      dispatch({ type: 'SAVE_ERROR', error: err.message })
    }
  }, [navigate])

  const handleDeletePage = useCallback(async (pageSlug) => {
    if (!window.confirm(`Delete page "/${pageSlug}"? This removes all its blocks.`)) return
    try {
      await del(`/theme/pages/${pageSlug}`)
      const listRes = await get('/theme/pages')
      setPages(listRes.data)
      if (listRes.data.length > 0) {
        navigate(`/theme-editor/${listRes.data[0].slug}`)
      }
    } catch (err) {
      dispatch({ type: 'SAVE_ERROR', error: err.message })
    }
  }, [navigate])

  const allBlocks = [...state.headerBlocks, ...state.bodyBlocks, ...state.footerBlocks]
  const activeBlock = allBlocks.find((b) => b._id === state.activeBlockId)

  if (!slug) {
    return (
      <div className="theme-editor">
        <div className="te-editor-empty" style={{ flex: 1 }}>
          {pages.length === 0 ? 'No pages found. Seed your database first.' : 'Redirecting...'}
        </div>
      </div>
    )
  }

  if (state.loading) {
    return (
      <div className="theme-editor">
        <div className="te-editor-empty" style={{ flex: 1 }}>Loading theme data...</div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="theme-editor">
        <div className="te-editor-empty" style={{ flex: 1, color: 'var(--color-danger)' }}>
          Error: {state.error}
        </div>
      </div>
    )
  }

  return (
    <div className="theme-editor">
      <ThemeEditorSidebar
        page={state.page}
        headerBlocks={state.headerBlocks}
        bodyBlocks={state.bodyBlocks}
        footerBlocks={state.footerBlocks}
        fieldDefs={state.fieldDefs}
        activeBlockId={state.activeBlockId}
        activeSection={state.activeSection}
        onSelectBlock={(id, section) => dispatch({ type: 'SELECT_BLOCK', id, section })}
        onReorder={(from, to, section) => dispatch({ type: 'REORDER', from, to, section })}
        onDeleteBlock={handleDeleteBlock}
        onAddBlock={handleAddBlock}
        onCloneBlock={handleCloneBlock}
        onUpdatePage={(page) => dispatch({ type: 'UPDATE_PAGE', page })}
        pages={pages}
        currentSlug={slug}
        onPageSwitch={handlePageSwitch}
        onCreatePage={handleCreatePage}
        onDeletePage={handleDeletePage}
      />

      <ThemePreview
        slug={slug}
        activeBlockType={activeBlock?.type}
        previewKey={state.previewKey}
        page={state.page}
        headerBlocks={state.headerBlocks}
        bodyBlocks={state.bodyBlocks}
        footerBlocks={state.footerBlocks}
        viewport={viewport}
        onViewportChange={handleViewportChange}
      />

      <BlockEditorPanel
        block={activeBlock}
        section={state.activeSection}
        fieldDefs={state.fieldDefs}
        onUpdateBlock={(id, updates) => dispatch({ type: 'UPDATE_BLOCK', id, updates, section: state.activeSection })}
        dirty={state.dirty || state.dirtyGlobal}
        saving={state.saving}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />

      {state.toast && (
        <div className={`te-toast ${state.toast.type}`}>
          {state.toast.message}
        </div>
      )}
    </div>
  )
}
