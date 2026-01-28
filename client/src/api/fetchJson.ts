export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export async function fetchJson<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const res = await fetch(url, options);

    // If Request fails
    if (!res.ok) {
        let message = 'Request failed';
        try {
            const body = await res.json();
            message = body.message ?? message;
        } catch {}
        throw new ApiError(res.status, message);
    }

    return res.json();
}
