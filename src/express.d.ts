declare global {
    namespace Express {
        interface Request {
            result?: any;
        }
    }
}

export { };