export function SearchPanel() {
  return (
    <form
      action="/holidays"
      className="mx-auto -mt-10 grid max-w-4xl grid-cols-1 gap-3 rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/5 sm:grid-cols-2 lg:grid-cols-5"
    >
      <label className="flex flex-col text-left text-xs font-semibold text-gray-500 lg:col-span-2">
        Destination
        <input
          name="destination"
          type="text"
          placeholder="e.g. Benidorm, Spain"
          className="mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand-500"
        />
      </label>
      <label className="flex flex-col text-left text-xs font-semibold text-gray-500">
        Nights
        <input
          name="nights"
          type="number"
          min={1}
          placeholder="7"
          className="mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand-500"
        />
      </label>
      <label className="flex flex-col text-left text-xs font-semibold text-gray-500">
        Max price (£pp)
        <input
          name="maxPrice"
          type="number"
          min={0}
          placeholder="500"
          className="mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand-500"
        />
      </label>
      <button
        type="submit"
        className="self-end rounded-lg bg-sun-500 px-4 py-2 text-sm font-bold text-white hover:bg-sun-400"
      >
        Search holidays
      </button>
    </form>
  );
}
