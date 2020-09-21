export interface GraphQLQuery<Name extends string, Selects extends Array<string | GraphQLQuery<any, any>>> {
    name: Name
    args: { [P in string]: unknown },
    selects: Selects
}

type Union<T> = T extends Array<infer U> ? U : never

type Filter<T, U> = T extends U ? T : never;  // Remove types from T that are not assignable to U
type QueryNames<T extends GraphQLQuery<any, any>> = {
    [P in T['name']]: T extends GraphQLQuery<P, infer H> ? GraphQLQuery<P, H> : never
}


type GraphQLResult<Schema extends {}, Query extends GraphQLQuery<any, any>> = {
    [P in Query['name']]: SubQueryResult<Schema[Query['name']], Query['selects']>
}

type SubQueryResult<T extends {}, Selects> =
    T extends Array<infer U>
    ? Array<SubQueryResultType<U, Selects>>
    : SubQueryResultType<T, Selects>

type Extra<T extends {}, QueryMap> = {
    [P in Filter<keyof QueryMap, keyof T>]:
    QueryMap[P] extends GraphQLQuery<any, infer J>
    ? (
        T[P] extends infer V | null | undefined
        ? SubQueryResult<V, J> | null | undefined
        : T[P] extends infer V | null
        ? SubQueryResult<V, J> | null
        : T[P] extends infer V | undefined
        ? SubQueryResult<V, J> | undefined
        : SubQueryResult<T[P], J>
    )
    : never
}

type SubQueryResultType<T extends {}, Selects> =
    & Pick<T, Filter<Union<Selects>, keyof T>>
    & Extra<T, QueryNames<Filter<Union<Selects>, GraphQLQuery<any, any>>>>

export function runFactory<Schema>(): <Q extends GraphQLQuery<any, any>>(query: Q) => GraphQLResult<Schema, Q> {
    return () => {
        return {} as any
    }
}

export const prepareFactory = <T, Args extends {}, Name extends string>(name: Name) =>
    (args: Args) =>
        <Selects extends Array<(keyof T & string) | GraphQLQuery<keyof T & string, any>>>(
            ...selects: Selects
        ): GraphQLQuery<Name, Selects> => ({ name, args, selects })
