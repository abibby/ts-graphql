export interface GraphQLQuery<Name extends string, Selects extends Array<string | GraphQLQuery<any, any>>> {
    name: Name
    args: { [P in string]: unknown },
    selects: Selects
}

export function prepare<
    Name extends string,
    Selects extends Array<string | GraphQLQuery<any, any>>
>(
    name: Name,
    args: { [arg: string]: unknown },
    ...selects: Selects
): GraphQLQuery<Name, Selects> {
    return { name, args, selects }
}

type Union<T> = T extends Array<infer U> ? U : never

type Filter<T, U> = T extends U ? T : never;  // Remove types from T that are not assignable to U
type QueryNames<T extends GraphQLQuery<any, any>> = T['name']


type GraphQLResult<Q extends GraphQLQuery<any, any>> = {
    [P in Q['name']]: {
        [Z in Filter<Union<Q['selects']>, string>]: Z extends string ? number : never
    } & {
        [Z in QueryNames<Filter<Union<Q['selects']>, GraphQLQuery<any, any>>>]: Z extends string ? number : never
    }
}

function run<Q extends GraphQLQuery<any, any>>(query: Q): GraphQLResult<Q> {
    return {} as any
}

const t1 = prepare('movie', {},
    'title',
    prepare('characters', {},
        'name',
        prepare('friends', {},
            'relation'
        )
    ),
    prepare('reviews', {},
        'rating',
        'website',
    )
)

const t2 = run(t1)
t2.movie.reviews
t2.not_movie
