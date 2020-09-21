
type ParseTableSpecifier<T> =
T extends `${infer Source} AS ${infer Alias}` ? TableSpecifier<Identifier<Source>, Identifier<Alias>> :
T extends `${infer Source} ${infer Alias}` ? TableSpecifier<Identifier<Source>, Identifier<Alias>> :
T extends string ? TableSpecifier<Identifier<Trim<T>>> :
never;
