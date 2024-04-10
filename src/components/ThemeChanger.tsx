/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import { useTheme } from 'next-themes'

export const ThemeChanger = () => {
  const { theme, setTheme } = useTheme()
  const THEMES = [
    {
      label: "forest",
      name: "forest"
    },
    {
      label: "kernel",
      name: "kernel"
    },
    {
      label: "retro",
      name: "retro"
    },
    {
      label: "light",
      name: "light"
    },
    {
      label: "dark",
      name: "dark"
    }
  ]
  return (
    <div className="flex flex-row md:gap-2 gap-1 px-1 bg-neutral rounded-xl w-fit">
      {
        THEMES.map((th, key) => {
          return (
            <div className="form-control" key={key} onClick={() => setTheme(th.name)}>
              <label className="label cursor-pointer gap-4 ">
                <span className="label-text text-primary">{th.label}</span>
                <input type="radio" name="theme-radios" className="radio theme-controller" value={th.name} checked={theme === th.name}/>
              </label>
            </div>
          )
        })
      }
    </div>
  )
}
