class Lock {
  constructor(){
     this.queue = []
     this.currentReleaser = undefined;
     this.bool = false;
     this.released = false;
  }

  acquire() {
    const locked = this.isLocked();
    //push a promise onto the queue
    const releaser = new Promise((resolve, reject) =>
      this.queue.push({resolve, reject})
    );
    if (!locked) this.dispatch();//resolves the returned promise

    //returns a promise
    return releaser; // <---- releaser, only returned 
    //when previous was released
  }

  isLocked() {
    return this.bool;
  }

  dispatch() {
    const nextWaitingProcess = this.queue.shift(); //pop of queue
    if (!nextWaitingProcess) return; //base condition (recursion)
    this.released = false;
    //set up the function that will be called to release
    this.currentReleaser = () => {
      if (this.released) return;//catch race condition

      this.released = true; 

      this.bool = false;//undo lock
      this.dispatch(); //resolve the next guy waiting (recursion when called)
    };
    //whichever process reaches this code first will acquire
    //the lock
    nextWaitingProcess.resolve([this.setLock(), this.currentReleaser]);
  }

  release() {//manually trigger release
    // this is enables release inside catch statements
    // to prevent deadlock, but if a waiting process that
    // does not currently have the lock throws an error 
    // and release gets called inside it's catch statement 
    // then the lock will get reassigned before the legitimate 
    // holder has released it. This could lead to race conditions.
    if (this.currentReleaser) {
      const tempReleaser = this.currentReleaser;
      this.currentReleaser = undefined;
      tempReleaser();
    }
  }

  setLock() {
    this.bool = true
    return this.bool;
  }
}
module.exports = { Lock }
