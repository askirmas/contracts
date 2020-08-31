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
    
    type Resource<T, C, P> = Part<{
        "options": Options<T>
        "post": Post<C, T>
        "get": Get<T>
        "head": Head
        "put": Put<T>
        "patch": Patch<P, T>
        "delete": Delete<T>
        "connect": Connect
        "trace": Trace
    }>
}
