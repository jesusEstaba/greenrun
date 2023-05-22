export interface UseCase<T> {
    execute(action: T): Promise<object>
}