import { prepare } from "./prepare"

type Builder<T> = () => void

export function builderFactory<T>(name: string): Builder<T> {
    return () => {
        prepare(name, {})
    }
}
