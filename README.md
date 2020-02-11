# LoaderQueue
A simple Javascript queue manager for managing dynamic loading events


------------

[TOC]

# Installation
`> npm install loader-queue --save`

The node package contains typings for TypeScript implementations

# Purpose
## The problem
Many dynamic loading managers involve HTTP interceptors, language specific modules, or framework specific implementations.

The following example might work well for simple processes, but does not offer great scalability options.
```typescript
getDataLoading = false;
getMoreDataLoading = false

async GetData() {
  this.getDataLoading = true;
  // ...
  this.getDataLoading = false;
}

async GetMoreData(){
  this.getMoreDataLoading = true;
  // ...
  this.getMoreDataLoading = false;
}

OnInit(){
  this.GetData();
  this.GetMoreData();
}
```

```html
<app-loader [hidden]="!getDataLoading && !getMoreDataLoading"></app-loader>
```

## The LoadingQueue solution
To solve the problem of handling scalable and dynamic loading events, we introduce the` LoaderQueue` object.

The `LoaderQueue` serves as a queue manager that you can add and remove events from as needed. The idea being that as long as there is an event on the queue, that the application is still loading data.


# Usage
```typescript
import { LoaderQueue } from 'loader-queue';
// ... 
loaderQueue = new LoaderQueue();

async GetData() {

  // Adds the 'GetData' event to the LoaderQueue
  // returns the LoaderQueueEvent that was added
  const loader = await this.loaderQueue.add('GetData');
  
  // ... do stuff
  
  // Removes the LoaderQueueEvent from the queue
  loader.remove();
}

```

```html
<!-- Loader will be hidden if the loaderQueue does not contain any events -->
<app-loader [hidden]="!loaderQueue.length"></app-loader>
```

## Examples

### Queue management
There are multiple ways to add and remove events to and from the `LoaderQueue`.

#### Event Names
The simplest way to manage the loading queue is to name the event with a string.


```typescript
import { LoaderQueue } from 'loader-queue';

loaderQueue = new LoaderQueue();

async GetData() {
  // Create and add the LoaderQueueEvent
  const loader = await this.loaderQueue.add('GetData');

  // Method 1 - removes the exact instance added locally
  loader.remove();

  // Method 2 - removes all instances of 'GetData'
  this.loaderQueue.remove('GetData');

  // Method 3 - removes the first instance of 'GetData'
  this.loaderQueue.remove('GetData', false);
}
```

#### Promises
The `LoaderQueue` can also promises as event arguments and automatically remove the event from the queue once the promise has resolved

```typescript
import { LoaderQueue } from 'loader-queue';

loaderQueue = new LoaderQueue();

initialize() {
  // All three promises will be added to the queue and removed automatically when each Promise resolves
  this.loaderQueue.add(this.GetData());
  this.loaderQueue.add(this.GetProducts());
  this.loaderQueue.add(this.GetCategories());
}
```

### Events
Utilize the `LoadingQueue.events` to subscribe to and act upon queue changes. Be sure to `unsubscribe` from the events on component destruction.

```typescript
import { LoaderQueue, QueueEventType } from 'loader-queue';

loaderQueue = new LoaderQueue();

this.loaderQueue.events.subscribe(
  (ev) => {
    switch (ev.type) {
      case QueueEventType.Add:
        console.log('Event added to queue');
        break;
      case QueueEventType.Remove:
        console.log('Event removed from queue');
        break;
      case QueueEventType.Clear:
        console.log('LoadingQueue cleared');
        break;
    }
  });
```


# API
## LoadingQueue
The main object that manages the loading queue.

### LoadingQueue Methods

#### .add(event)
**returns** `Promise<LoadingQueueEvent>`

Adds an event to the `LoadingQueue` and automatically removes the event when the event resolves

| Argument Name | Type | Description |
|----------|---------|----------|
|event| `Promise`  | Adds an event to the `LoadingQueue` and automatically removes the event when the event resolves |

#### .add(event)
**returns** `Promise<LoadingQueueEvent>`

Adds an event to the `LoadingQueue` according to the string event name provided. 

| Argument Name | Type | Description |
|----------|---------|----------|
|event| `string`  | The name of the event to add to the `LoadingQueue` (Concatenates a unique identifier under the hood)  |

#### .remove(event)
**returns** `Promise<void>`

Removes the provided `LoaderQueueEvent`

| Argument Name | Type | Description |
|----------|---------|----------|
|event| `LoaderQueueEvent` | The event to remove |

#### .remove(event, removeAll)
**returns** `Promise<void>`

Removes an event from the loading queue according to the string name provided.

| Argument Name | Type | Description |
|----------|---------|----------|
|event| `string` | Event string to remove from the current loader stack |
|removeAll?| `boolean` | Optional parameter to remove all instances or a single instance of the event string. (Default true)|

#### .clear()
**returns** `Promise<void>`

Clears the current queue of all `LoaderQueueEvents`

### LoadingQueue Parameters

#### .length
**type** `number`

The current length of the `LoaderQueue`.

#### .events
**type** `Subject`

RxJs Subject that can be subscribed to and emits all `add`, `remove`, and `clear` events of the `LoadingQueue`.

## LoadingQueueEvent
The event object that the `LoadingQueue` stores and manipulates

### LoadingQueueEvent Methods

#### .remove()
**returns** `Promise<void>`

Removes this event from the `LoadingQueue`.

### LoadingQueueEvent Parameters

#### .common_id
**type** `string`

The string identifier corresponding to the event name passed into the `LoadingQueue.add()` method

#### .unique_id
**type** `string`

The unique identifier generated for the event

## Utilities
### HasLoaderQueue

**type** `interface`

Utility interface to specify a component to contain a `LoaderQueue`

Example: 
```typescript
import { HasLoaderQueue, LoaderQueue } from 'loader-queue';

export class MyComponent implements HasLoaderQueue { 
  constructor() { }

  loaderQueue = new LoaderQueue(); // Required by the HasLoaderQueue interface
}

```
