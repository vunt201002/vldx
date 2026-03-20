import React, { useReducer, useEffect, useCallback, useRef } from 'react'
import { get, put, post, del } from '@/lib/api'
import ThemeEditorSidebar from '@/components/theme-editor/ThemeEditorSidebar'
import ThemePreview from '@/components/theme-editor/ThemePreview'
import BlockEditorPanel from '@/components/theme-editor/BlockEditorPanel'
import '@/styles/theme-editor.css'

// --- Reducer ---
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
  previewKey: 0, // bump to force iframe reload after save
}

function reducer(state, action) {
  switch (action.type) {
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
  const [state, dispatch] = useReducer(reducer, initialState)
  const toastTimer = useRef(null)

  // Load data on mount
  useEffect(() => {
    async function load() {
      try {
        const [themeRes, defsRes] = await Promise.all([
          get('/theme/landing'),
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
  }, [])

  // Auto-clear toast
  useEffect(() => {
    if (state.toast) {
      clearTimeout(toastTimer.current)
      toastTimer.current = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 3000)
    }
    return () => clearTimeout(toastTimer.current)
  }, [state.toast])

  // Unsaved changes warning
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

  const handleSave = useCallback(async () => {
    dispatch({ type: 'SAVING' })
    try {
      await put('/theme/landing', {
        page: state.page,
        blocks: state.blocks,
      })
      dispatch({ type: 'SAVED' })
    } catch (err) {
      dispatch({ type: 'SAVE_ERROR', error: err.message })
    }
  }, [state.page, state.blocks])

  const handleAddBlock = useCallback(async (type) => {
    try {
      const res = await post('/theme/landing/blocks', { type })
      dispatch({ type: 'ADD_BLOCK', block: res.data })
    } catch (err) {
      dispatch({ type: 'SAVE_ERROR', error: err.message })
    }
  }, [])

  const handleDeleteBlock = useCallback(async (id) => {
    if (!window.confirm('Remove this section?')) return
    try {
      await del(`/theme/landing/blocks/${id}`)
      dispatch({ type: 'DELETE_BLOCK', id })
    } catch (err) {
      dispatch({ type: 'SAVE_ERROR', error: err.message })
    }
  }, [])

  const activeBlock = state.blocks.find((b) => b._id === state.activeBlockId)

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
      {/* Left — Section List */}
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
      />

      {/* Center — Live Preview */}
      <ThemePreview
        activeBlockType={activeBlock?.type}
        previewKey={state.previewKey}
      />

      {/* Right — Settings Panel */}
      <BlockEditorPanel
        block={activeBlock}
        fieldDefs={state.fieldDefs}
        onUpdateBlock={(id, updates) => dispatch({ type: 'UPDATE_BLOCK', id, updates })}
        dirty={state.dirty}
        saving={state.saving}
        onSave={handleSave}
      />

      {/* Toast */}
      {state.toast && (
        <div className={`te-toast ${state.toast.type}`}>
          {state.toast.message}
        </div>
      )}
    </div>
  )
}
