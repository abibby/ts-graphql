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
type QueryNames<T extends GraphQLQuery<any, any>> = {
    [P in T['name']]: T extends GraphQLQuery<P, infer H> ? GraphQLQuery<P, H> : never
}


type GraphQLResult<Q extends GraphQLQuery<any, any>> = {
    [P in Q['name']]: Extra2<Q['selects']>
}

type Extra2<T> =
    & { [Z in Filter<Union<T>, string>]: number }
    & Extra<QueryNames<Filter<Union<T>, GraphQLQuery<any, any>>>>

type Extra<T> = {
    [P in keyof T]: T[P] extends GraphQLQuery<any, infer J> ? Extra2<J> : never
}

function run<Q extends GraphQLQuery<any, any>>(query: Q): GraphQLResult<Q> {
    return {} as any
}

const t1 = prepare('movie' as const, {},
    'title' as const,
    prepare('characters' as const, {},
        'name' as const,
        prepare('friends' as const, {},
            'relation'
        )
    ),
    prepare('reviews' as const, {},
        'rating' as const,
        'website' as const,
        prepare('friends' as const, {},
            'relation' as const
        )
    )
)

const t2 = run(t1)
t2.movie.reviews.friends.relation
t2.movie.characters
t2.movie.title
