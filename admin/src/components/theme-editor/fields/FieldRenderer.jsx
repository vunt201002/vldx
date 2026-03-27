import React from 'react'
import TextField from './TextField'
import TextareaField from './TextareaField'
import NumberField from './NumberField'
import BooleanField from './BooleanField'
import SelectField from './SelectField'
import ArrayField from './ArrayField'
import ImageField from './ImageField'
import MenuSelectField from './MenuSelectField'

const fieldComponents = {
  text: TextField,
  url: TextField,
  textarea: TextareaField,
  number: NumberField,
  boolean: BooleanField,
  select: SelectField,
  array: ArrayField,
  image: ImageField,
  'menu-select': MenuSelectField,
}

export default function FieldRenderer({ field, value, onChange }) {
  const Component = fieldComponents[field.type]
  if (!Component) return null
  return <Component field={field} value={value} onChange={onChange} />
}
