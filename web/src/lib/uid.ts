let uidCounter = 0;

export function uid(name: string) {
    const id = `${name}-${++uidCounter}`;
    return { id, href: `#${id}` };
}
