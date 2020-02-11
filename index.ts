import { Subject } from 'rxjs';

export interface HasLoaderQueue {
  loaderQueue: LoaderQueue;
}

export enum QueueEventType {
  Add = 'ADD',
  Remove = 'REMOVE',
  Clear = 'CLEAR'
}

export interface QueueEvent {
  type: QueueEventType,
  event?: LoaderQueueEvent | LoaderQueueEvent[]
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

export class LoaderQueue {
  private _queue: LoaderQueueEvent[] = [];

  /**
   * RxJs Subject that emits all loading queue events
   */
  public readonly events = new Subject<QueueEvent>();

  /**
   * The current length of the LoaderQueue
   */
  public get length() {
    return this._queue.length;
  }

  private generateUID(common_id: string) {
    for (let i = 0; i < 1000; i++) {
      const randomStr = getRandomInt(10000, 100000).toString();
      const unique_id = `${common_id}_${randomStr}`;
      const index = this._queue.findIndex(ev => ev.unique_id === unique_id);
      if (index === -1) {
        return unique_id;
      }
    }
    throw new Error('Could not generate Unique Identifier for loader event. This likely indicates a problem with the LoaderQueue library');
  }


  /**
   * Await and automatically remove the promise from the loading queue upon resolution via then() or catch()
   * @param event asyncronous event to await
   * @experimental 
   */
  public async add(event: IPromiseLike<any>): Promise<LoaderQueueEvent>

  /**
   * Adds an event to the LoaderQueue
   * @param event string identifier to specify the event on the loader stack
   */
  public async add(event: string): Promise<LoaderQueueEvent>

  public async add(event: string | IPromiseLike<any>): Promise<LoaderQueueEvent> {
    let newEvent: LoaderQueueEvent;
    if (typeof event === 'object' && typeof event.then === 'function' && typeof event.catch === 'function') {

      newEvent = new LoaderQueueEvent(this, 'PromiseLike', this.generateUID('PromiseLike'));
      event.then(() => this.remove(newEvent)).catch(() => this.remove(newEvent));

    } else if (typeof event === 'string') {

      newEvent = new LoaderQueueEvent(this, event, this.generateUID(event));

    } else {

      throw new Error('event provided to LoaderQueue.add is not of type <string> or <Promise>');

    }

    this._queue.push(newEvent);

    // If there are observers of this queue, return the new event added
    if (this.events.observers && this.events.observers.length) {
      this.events.next({ type: QueueEventType.Add, event: newEvent });
    }

    return newEvent;
  }

  /**
   * Removes all instances of the exact LoaderQueueEvent on the LoaderQueue
   * @param event the specified event to remove
   */
  public async remove(event: LoaderQueueEvent): Promise<void>


  /**
   * Removes an event from the loading queue according to the string name provided
   * @param event event string to remove from the current loader stack
   * @param removeAll optional parameter to remove all instances or a single instance of the event string. (Default true)
   */
  public async remove(event: string, removeAll?: boolean): Promise<void>

  public async remove(event: string | LoaderQueueEvent, removeAll = true) {
    if (!event) {
      throw new Error('event passed to LoaderQueue.remove must be a string or LoaderQueueEvent type');
    }

    if (event instanceof LoaderQueueEvent) {

      // If there are observers of this queue, return the array of events removed
      if (this.events.observers && this.events.observers.length) {
        const removed = this._queue.filter(ev => ev.unique_id === event.unique_id);
        this.events.next({ type: QueueEventType.Remove, event: removed });
      }

      this._queue = this._queue.filter(ev => ev.unique_id !== event.unique_id);
      return;

    } else if (typeof event === 'string') {

      // If the user has specified to remove all instances of the common string
      if (removeAll) {

        // If there are observers of this queue, return the array of events removed
        if (this.events.observers && this.events.observers.length) {
          const removed = this._queue.filter(ev => ev.common_id === event);
          this.events.next({ type: QueueEventType.Remove, event: removed });
        }

        this._queue = this._queue.filter(ev => ev.common_id !== event);
        return;

      } else {

        // If the user has specified to remove only the first single instance of the common string
        const firstIndex = this._queue.findIndex(ev => ev.common_id === event);
        if (firstIndex >= 0) {
          const deleted = this._queue.splice(firstIndex, 1);

          // If there are observers of this queue, return the event removed
          if (this.events.observers && this.events.observers.length) {
            this.events.next({ type: QueueEventType.Remove, event: deleted[0] });
          }
        }
        return;

      }
    } else {
      throw new Error('event passed to LoaderQueue.remove must be a string or LoaderQueueEvent type');
    }
  }

  public async clear() {
    this._queue.length = 0;
    if (this.events.observers && this.events.observers.length) {
      this.events.next({ type: QueueEventType.Clear });
    }
  }
}

export class LoaderQueueEvent {
  private _queueInstance: LoaderQueue;
  public readonly common_id: string = '';
  public readonly unique_id: string = '';

  /**
   * Removes this LoaderQueueEvent from the LoaderQueue
   */
  public async remove() {
    return this._queueInstance.remove(this);
  }

  constructor(queueInstance: LoaderQueue, common_id: string, unique_id: string) {
    if (!queueInstance) {
      throw new Error('No queueInstance provided to LoaderQueueEvent');
    }

    if (!common_id) {
      throw new Error('No commonId provided to LoaderQueueEvent');
    }

    if (!unique_id) {
      throw new Error('No uniqueId provided to LoaderQueueEvent');
    }

    this._queueInstance = queueInstance;
    this.common_id = common_id;
    this.unique_id = unique_id;

  }
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const test = new Promise((resolve) => { console.log() });

test.then