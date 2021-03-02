export const setIncludes = (includes?: Array<string>) => {
    return {params: { includes: includes?.join(',')}}
}
