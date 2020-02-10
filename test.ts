import { describe, it } from 'mocha';
import { LoaderQueue, QueueEventType } from './index';
import * as assert from 'assert';

describe('LoaderQueue', () => {
  it('Should add LoaderQueueEvent', async () => {
    const loaderQueue = new LoaderQueue();
    const newEvent = await loaderQueue.add('TestEvent');

    assert.equal(loaderQueue.length, 1, 'Loader queue length not as expected');
    assert.equal(newEvent.common_id, 'TestEvent', 'LoaderQueueEvent common_id not as expected');
    assert.notEqual(newEvent.unique_id, 'TestEvent', 'LoaderQueueEvent unique_id not as expected');

    return;
  });

  it('Should reference same queueInstance', async () => {
    const loaderQueue = new LoaderQueue();
    const event = await loaderQueue.add('TestEvent');

    assert.equal((event as any)._queueInstance, loaderQueue, 'Loader queue length not as expected');

    return;
  });

  it('Should create unique identifiers', async () => {
    const loaderQueue = new LoaderQueue();
    const events = [
      await loaderQueue.add('TestEvent'),
      await loaderQueue.add('TestEvent')
    ];

    assert.equal(events[0].common_id, events[1].common_id, 'LoaderQueueEvent common_ids should match');
    assert.notEqual(events[0].unique_id, events[1].unique_id, 'LoaderQueueEvent unique_ids should not collide');

    return;
  });

  it('Should remove single instance via string', async () => {
    const loaderQueue = new LoaderQueue();
    const events = [
      await loaderQueue.add('TestEvent'),
      await loaderQueue.add('TestEvent')
    ];

    await loaderQueue.remove('TestEvent', false);

    assert.equal(loaderQueue.length, 1, 'LoaderQueue length not as expected following remove() event');
    return;
  });

  it('Should remove all instances via string', async () => {
    const loaderQueue = new LoaderQueue();
    const events = [
      await loaderQueue.add('TestEvent'),
      await loaderQueue.add('TestEvent'),
      await loaderQueue.add('TestEvent2')
    ];

    await loaderQueue.remove('TestEvent');

    assert.equal(loaderQueue.length, 1, 'LoaderQueue length not as expected following remove() event');
    return;
  });

  it('Should remove localized instance of event', async () => {
    const loaderQueue = new LoaderQueue();
    await loaderQueue.add('TestEvent');
    await loaderQueue.add('TestEvent2');

    const event = await loaderQueue.add('TestEvent3');
    event.remove();

    assert.equal(loaderQueue.length, 2, 'LoaderQueue length not as expected following remove() event');
    return;
  });

  it('Should clear queue', async () => {
    const loaderQueue = new LoaderQueue();
    await loaderQueue.add('TestEvent');
    await loaderQueue.add('TestEvent2');
    await loaderQueue.add('TestEvent3');

    await loaderQueue.clear();

    assert.equal(0, 0, 'LoaderQueue length not as expected following clear() event');
    return;
  });

  it('Should auto-remove event if passed as a promise (resolve)', (done) => {
    const loaderQueue = new LoaderQueue();

    const promiseFn = () => {
      return new Promise<any>((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 10);
      });
    };

    loaderQueue.add(promiseFn()).then(() => {
      setTimeout(() => {

        assert.equal(0, loaderQueue.length, 'LoaderQueue length not as expected following add() event');
        done();

      }, 20);
    });
  });

  it('Should auto-remove event if passed as a promise (reject)', (done) => {
    const loaderQueue = new LoaderQueue();

    const promiseFn = () => {
      return new Promise<any>((resolve, reject) => {
        setTimeout(() => {
          reject();
        }, 10);
      });
    };

    loaderQueue.add(promiseFn()).then(() => {
      setTimeout(() => {

        assert.equal(0, loaderQueue.length, 'LoaderQueue length not as expected following add() event');
        done();

      }, 20);
    });
  });

  it('Should create unique identifiers for events passed as promises', async () => {
    const loaderQueue = new LoaderQueue();

    const promiseFn = () => {
      return new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 10);
      });
    };

    const events = [
      await loaderQueue.add(promiseFn()),
      await loaderQueue.add(promiseFn())
    ];

    assert.notEqual(events[0].unique_id, events[1].unique_id, 'LoaderQueueEvent unique_ids should be unique');
  });

});

describe('LoaderQueue.events', () => {

  it(`Should emit ${QueueEventType.Add} event upon add`, (done) => {

    const loaderQueue = new LoaderQueue();
    const sub = loaderQueue.events.subscribe((ev) => {
      sub.unsubscribe();
      assert.equal(ev.type, QueueEventType.Add, 'Event type fired not as expected');
      done();
    });
    loaderQueue.add('TestEvent');
  });

  it(`Should emit ${QueueEventType.Remove} event upon remove`, (done) => {

    const loaderQueue = new LoaderQueue();
    loaderQueue.add('TestEvent').then((event) => {
      const sub = loaderQueue.events.subscribe((ev) => {
        sub.unsubscribe();
        assert.equal(ev.type, QueueEventType.Remove, 'Event type fired not as expected');
        done();
      });
      event.remove();
    });

  });

  it(`Should emit ${QueueEventType.Clear} event upon clear`, (done) => {

    const loaderQueue = new LoaderQueue();
    loaderQueue.add('TestEvent').then((event) => {
      const sub = loaderQueue.events.subscribe((ev) => {
        sub.unsubscribe();
        assert.equal(ev.type, QueueEventType.Clear, 'Event type fired not as expected');
        done();
      });

      loaderQueue.clear();
    });

  });

});