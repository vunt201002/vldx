import Image from 'next/image';

export default function ColorSelector({ colors = [], selected, onChange }) {
  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Available Colors
      </label>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isSelected = selected?._id === color._id || selected?.name === color.name;

          return (
            <button
              key={color._id || color.name}
              onClick={() => onChange(color)}
              className="group relative"
              title={color.name}
            >
              {/* Color Swatch */}
              <div
                className={`
                  h-12 w-12 rounded-full border-2 transition-all
                  ${
                    isSelected
                      ? 'border-sandstone ring-2 ring-sandstone ring-offset-2'
                      : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                style={{ backgroundColor: color.hex }}
              >
                {/* Show image if available */}
                {color.image && (
                  <div className="relative h-full w-full overflow-hidden rounded-full">
                    <Image
                      src={color.image}
                      alt={color.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                )}
              </div>

              {/* Color Name Tooltip */}
              <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                {color.name}
                <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </div>

              {/* Selected Checkmark */}
              {isSelected && (
                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-sandstone text-white">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Color Name */}
      {selected && (
        <div className="text-sm text-gray-600">
          Selected: <span className="font-medium">{selected.name}</span>
        </div>
      )}
    </div>
  );
}
