// Starts every loader at once (functions taking a callback, such as
// loadLanguage or loadCity) and calls `done` a single time with all their
// results, keyed like `loaders`. Pages render once from it instead of again
// after each stored setting arrives, which is slow on the band. A loader
// that calls back with several values (loadLayout) gives an array.
export function loadAll(loaders, done) {
  const keys = Object.keys(loaders)
  const values = {}
  let left = keys.length
  keys.forEach((key) => {
    loaders[key]((...args) => {
      if (key in values) return
      values[key] = args.length > 1 ? args : args[0]
      left -= 1
      if (left === 0) done(values)
    })
  })
}
