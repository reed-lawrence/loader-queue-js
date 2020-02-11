import { Subject } from 'rxjs';
export interface HasLoaderQueue {
    loaderQueue: LoaderQueue;
}
export declare enum QueueEventType {
    Add = "ADD",
    Remove = "REMOVE",
    Clear = "CLEAR"
}
export interface QueueEvent {
    type: QueueEventType;
    event?: LoaderQueueEvent | LoaderQueueEvent[];
}
interface IPromiseLike<T> {
    /**
       * Attaches callbacks for the resolution and/or rejection of the Promise.
       * @param onfulfilled The callback to execute when the Promise is resolved.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of which ever callback is executed.
       */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
}
export declare class LoaderQueue {
    private _queue;
    /**
     * RxJs Subject that emits all loading queue events
     */
    readonly events: Subject<QueueEvent>;
    /**
     * The current length of the LoaderQueue
     */
    get length(): number;
    private generateUID;
    /**
     * Await and automatically remove the promise from the loading queue upon resolution via then() or catch()
     * @param event asyncronous event to await
     * @experimental
     */
    add(event: IPromiseLike<any>): Promise<LoaderQueueEvent>;
    /**
     * Adds an event to the LoaderQueue
     * @param event string identifier to specify the event on the loader stack
     */
    add(event: string): Promise<LoaderQueueEvent>;
    /**
     * Removes all instances of the exact LoaderQueueEvent on the LoaderQueue
     * @param event the specified event to remove
     */
    remove(event: LoaderQueueEvent): Promise<void>;
    /**
     * Removes an event from the loading queue according to the string name provided
     * @param event event string to remove from the current loader stack
     * @param removeAll optional parameter to remove all instances or a single instance of the event string. (Default true)
     */
    remove(event: string, removeAll?: boolean): Promise<void>;
    clear(): Promise<void>;
}
export declare class LoaderQueueEvent {
    private _queueInstance;
    readonly common_id: string;
    readonly unique_id: string;
    /**
     * Removes this LoaderQueueEvent from the LoaderQueue
     */
    remove(): Promise<void>;
    constructor(queueInstance: LoaderQueue, common_id: string, unique_id: string);
}
export declare function getRandomInt(min: number, max: number): number;
export {};
