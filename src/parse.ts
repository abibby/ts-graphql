
export type Trim<T extends string> = 
    T extends ` ${infer Rest}` ? Trim<Rest>
    : T extends `${infer Rest} ` ? Trim<Rest>
    : T extends `\t${infer Rest}` ? Trim<Rest>
    : T extends `${infer Rest}\t` ? Trim<Rest>
    : T extends `\n${infer Rest}` ? Trim<Rest>
    : T extends `${infer Rest}\n` ? Trim<Rest>
    : T;

type Block<T extends string> =
    T extends `{${infer Source}}` ? Trim<Source>
    : never;

type Query<T extends string> =
    T extends `query ${infer Rest}` ? SelectionSet<Rest>
    : Block<T>;

type Union<T> = T extends Array<infer U> ? U : never

type SelectionSet<T extends string> = {
    [P in Union<
        MapTrim<
            SplitStrings<
                Block<
                    T extends `query ${infer Rest}` ? Rest : T
                >,
                '\n'
            >
        >
    >]: unknown
}

export type SplitStrings<T extends string, Sep extends string> = 
    T extends `${infer Start}${Sep}${infer Rest}` ? [Start, ...SplitStrings<Rest, Sep>]
    : [T];


export type MapTrim<T extends string[]> = 
    T extends [infer Head, ...infer Tail] ? Head extends string ? Tail extends string[] ? [Trim<Head>, ...MapTrim<Tail>] : never : never
    : T

const a: Query<`query {
    foo
    bar
    baz {
        a
    }
}`> = {
    foo: 1,
    bar: 1,
    baz: 1,
}
