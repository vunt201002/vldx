import React, { useReducer, useEffect, useCallback, useRef } from 'react'
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
  const toastTimer = useRef(null)

  useEffect(() => {
    if (!slug) return
    dispatch({ type: 'LOAD_ERROR', error: null })
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
        slug={slug}
        onBack={() => navigate('/theme-editor')}
      />

      <ThemePreview
        slug={slug}
        activeBlockType={activeBlock?.type}
        previewKey={state.previewKey}
      />

      <BlockEditorPanel
        block={activeBlock}
        fieldDefs={state.fieldDefs}
        onUpdateBlock={(id, updates) => dispatch({ type: 'UPDATE_BLOCK', id, updates })}
        dirty={state.dirty}
        saving={state.saving}
        onSave={handleSave}
      />

      {state.toast && (
        <div className={`te-toast ${state.toast.type}`}>
          {state.toast.message}
        </div>
      )}
    </div>
  )
}
