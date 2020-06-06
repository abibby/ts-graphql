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


type GraphQLResult<T extends {}, Q extends GraphQLQuery<any, any>> = {
    [P in Q['name']]: SubQueryResult<T[Q['name']], Q['selects']>
}

type SubQueryResult<T extends {}, Selects> =
    & { [Z in Filter<Union<Selects>, keyof T>]: T[Z] }
    & Extra<T, QueryNames<Filter<Union<Selects>, GraphQLQuery<any, any>>>>

type Extra<T extends {}, QueryMap> = {
    [P in Filter<keyof QueryMap, keyof T>]: QueryMap[P] extends GraphQLQuery<any, infer J> ? SubQueryResult<T[P], J> : never
}

function run<T, Q extends GraphQLQuery<any, any>>(query: Q): GraphQLResult<Schema, Q> {
    return {} as any
}

type Schema = {
    movie: {
        title: string
        characters: {
            name: string
            friends: {
                relation: string
            }
        }
        reviews: {
            rating: number
            website: string
        }
    }
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
    )
)

const t2 = run(t1)
t2.movie.reviews.rating
t2.movie.characters.friends.relation
t2.movie.title
