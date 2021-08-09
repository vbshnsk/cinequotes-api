export type PubSubRequest = {timestamp: number};

export default interface IPubSubConnection {
  start: () => Promise<void>
  stop: () => Promise<void>
  publish: (data: Record<string, unknown>) => Promise<string>
  onMessage: (message: string) => void
  readonly requestsInProgress: Record<string, PubSubRequest>
}