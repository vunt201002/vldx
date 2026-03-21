import React, { useReducer, useEffect, useCallback, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { get, put, post, del } from '@/lib/api'
import ThemeEditorSidebar from '@/components/theme-editor/ThemeEditorSidebar'
import ThemePreview from '@/components/theme-editor/ThemePreview'
import BlockEditorPanel from '@/components/theme-editor/BlockEditorPanel'
import '@/styles/theme-editor.css'

const initialState = {
  page: { title: '', description: '', bodyClass: '' },
  blocks: [],
  fieldDefs: [],
  activeBlockId: null,
  dirty: false,
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
        blocks: action.blocks,
        fieldDefs: action.fieldDefs,
        loading: false,
        dirty: false,
        activeBlockId: action.blocks[0]?._id || null,
      }
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.error }
    case 'SELECT_BLOCK':
      return { ...state, activeBlockId: action.id }
    case 'UPDATE_PAGE':
      return { ...state, page: action.page, dirty: true }
    case 'UPDATE_BLOCK': {
      const blocks = state.blocks.map((b) =>
        b._id === action.id ? { ...b, ...action.updates } : b
      )
      return { ...state, blocks, dirty: true }
    }
    case 'REORDER': {
      const blocks = [...state.blocks]
      const [moved] = blocks.splice(action.from, 1)
      blocks.splice(action.to, 0, moved)
      return { ...state, blocks, dirty: true }
    }
    case 'ADD_BLOCK':
      return {
        ...state,
        blocks: [...state.blocks, action.block],
        activeBlockId: action.block._id,
        dirty: true,
      }
    case 'DELETE_BLOCK': {
      const blocks = state.blocks.filter((b) => b._id !== action.id)
      const activeBlockId =
        state.activeBlockId === action.id
          ? blocks[0]?._id || null
          : state.activeBlockId
      return { ...state, blocks, activeBlockId, dirty: true }
    }
    case 'SAVING':
      return { ...state, saving: true }
    case 'SAVED':
      return {
        ...state,
        saving: false,
        dirty: false,
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
  const toastTimer = useRef(null)

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
        const [themeRes, defsRes] = await Promise.all([
          get(`/theme/pages/${slug}`),
          get('/theme/field-defs'),
        ])
        dispatch({
          type: 'LOADED',
          page: themeRes.data.page,
          blocks: themeRes.data.blocks,
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
      if (state.dirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [state.dirty])

  const handlePageSwitch = useCallback((newSlug) => {
    if (state.dirty && !window.confirm('You have unsaved changes. Switch page anyway?')) return
    navigate(`/theme-editor/${newSlug}`)
  }, [state.dirty, navigate])

  const handleSave = useCallback(async () => {
    dispatch({ type: 'SAVING' })
    try {
      await put(`/theme/pages/${slug}`, {
        page: state.page,
        blocks: state.blocks,
      })
      dispatch({ type: 'SAVED' })
    } catch (err) {
      dispatch({ type: 'SAVE_ERROR', error: err.message })
    }
  }, [slug, state.page, state.blocks])

  const handleDiscard = useCallback(async () => {
    if (!window.confirm('Discard all unsaved changes?')) return
    dispatch({ type: 'LOADING' })
    try {
      const [themeRes, defsRes] = await Promise.all([
        get(`/theme/pages/${slug}`),
        get('/theme/field-defs'),
      ])
      dispatch({
        type: 'LOADED',
        page: themeRes.data.page,
        blocks: themeRes.data.blocks,
        fieldDefs: defsRes.data,
      })
    } catch (err) {
      dispatch({ type: 'LOAD_ERROR', error: err.message })
    }
  }, [slug])

  const handleAddBlock = useCallback(async (type) => {
    try {
      const res = await post(`/theme/pages/${slug}/blocks`, { type })
      dispatch({ type: 'ADD_BLOCK', block: res.data })
    } catch (err) {
      dispatch({ type: 'SAVE_ERROR', error: err.message })
    }
  }, [slug])

  const handleDeleteBlock = useCallback(async (id) => {
    if (!window.confirm('Remove this section?')) return
    try {
      await del(`/theme/pages/${slug}/blocks/${id}`)
      dispatch({ type: 'DELETE_BLOCK', id })
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

  const activeBlock = state.blocks.find((b) => b._id === state.activeBlockId)

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
        blocks={state.blocks}
        fieldDefs={state.fieldDefs}
        activeBlockId={state.activeBlockId}
        onSelectBlock={(id) => dispatch({ type: 'SELECT_BLOCK', id })}
        onReorder={(from, to) => dispatch({ type: 'REORDER', from, to })}
        onDeleteBlock={handleDeleteBlock}
        onAddBlock={handleAddBlock}
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
        blocks={state.blocks}
      />

      <BlockEditorPanel
        block={activeBlock}
        fieldDefs={state.fieldDefs}
        onUpdateBlock={(id, updates) => dispatch({ type: 'UPDATE_BLOCK', id, updates })}
        dirty={state.dirty}
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
