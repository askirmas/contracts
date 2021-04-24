type Dict<T = unknown> = Record<string, T>  

type Part<T> = { [P in keyof T]?: T[P] }

declare namespace HTTP {
    interface Method <Req, Res> {
        (req: Req) :Res | Promise<Res> 
    }

    type Info<S extends boolean, I extends boolean, C extends Boolean> = Part<{
        "safe": S
        "idempotent": I
        "cacheable": C
    }>
    
    interface Options<T> extends Method<null, T|null>, Info<true, true, false> {}

    /**
     * `cacheable: true` only if freshness information is included
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST
    */
    interface Post<S,T> extends Method<S, T>, Info<false, false, boolean> {}

    interface Get<T> extends Method<null, T>, Info<true, true, true> {}
    interface Head extends Get<null> {}

    interface Put<T> extends Method<T, null>, Info<false, true, false> {}
    interface Patch<S, T> extends Method<S, T|null>, Info<false, boolean, false> {}
    
    interface Delete<T> extends Method<null, T|null>, Info<false, true, false> {}
    
    interface Connect {}
    interface Trace {}
    
    type Resource<Type, Submission, Patch> = Part<{
        "options": Options<Type>
        "post": Post<Submission, Type>
        "get": Get<Type>
        "head": Head
        "put": Put<Type>
        "patch": Patch<Patch, Type>
        "delete": Delete<Type>
        "connect": Connect
        "trace": Trace
    }>
}
