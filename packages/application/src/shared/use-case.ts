export interface UseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}

export interface NoInputUseCase<TOutput> {
  execute(): Promise<TOutput>;
}
