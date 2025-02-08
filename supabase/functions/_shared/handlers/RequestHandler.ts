export abstract class RequestHandler {
    private corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
            "authorization, x-client-info, content-type, apikey, x-file-type",
    };

    /**
     * Generate a response for the request. This method may throw errors, which
     * will be caught by the handleError method.
     */
    abstract processRequest(req: Request): Promise<Response>;

    /**
     * This method may be overwritten by subclasses to handle errors in a different way
     * @param error
     * @returns
     */
    // deno-lint-ignore no-unused-vars
    async handleError(error: unknown): Promise<Response> {
        return await new Response(
            JSON.stringify({ error: "Unexpected Error" }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
                status: 500,
            },
        );
    }

    async handleRequest(req: Request): Promise<Response> {
        try {
            return await this.processRequest(req);
        } catch (error) {
            return await this.handleError(error);
        }
    }

    async handleRequestWithCors(req: Request): Promise<Response> {
        if (req.method === "OPTIONS") {
            return new Response("ok", {
                headers: { ...this.corsHeaders },
            });
        }
        const resp = await this.handleRequest(req);
        resp.headers.set(
            "Access-Control-Allow-Origin",
            this.corsHeaders["Access-Control-Allow-Origin"],
        );
        resp.headers.set(
            "Access-Control-Allow-Headers",
            this.corsHeaders["Access-Control-Allow-Headers"],
        );
        return resp;
    }
}
