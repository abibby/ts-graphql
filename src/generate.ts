import fetch from 'node-fetch'
import { prepare, GraphQLQuery } from './prepare';
import { generate } from './index';

async function main() {
    const data = await fetch('https://api.graph.cool/simple/v1/ciyz901en4j590185wkmexyex', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({
            query: buildQuery(),
        })
    }).then(r => r.text())

    console.log(data);

}

function buildQuery(): string {
    function typeQuery(depth: number) {
        const common = [
            'name',
            'description',
        ]
        const a: Array<string | GraphQLQuery<any, any>> = [
            ...common
        ]

        if (depth > 0) {
            a.push(prepare('type', {}, ...typeQuery(depth - 1)))
        }
        return [
            ...common,
            "kind",
            "enumValues",
            prepare("fields", {}, ...a)
        ]
    }


    return generate(
        prepare('query', {},
            prepare('__schema', {},
                prepare('types', {}, ...typeQuery(5))
            )
        )
    )
}

main()
