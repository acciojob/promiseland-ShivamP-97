// complete the js code
class CustomPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;

    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.onFulfilledCallbacks.forEach(cb => cb());
      }
    };

    const reject = (reason) => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach(cb => cb());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new CustomPromise((resolve, reject) => {
      const handleFulfilled = () => {
        setTimeout(() => {
          try {
            const result = onFulfilled ? onFulfilled(this.value) : this.value;
            resolve(result);
          } catch (err) {
            reject(err);
          }
        }, 0);
      };

      const handleRejected = () => {
        setTimeout(() => {
          try {
            if (onRejected) {
              const result = onRejected(this.reason);
              resolve(result);
            } else {
              reject(this.reason);
            }
          } catch (err) {
            reject(err);
          }
        }, 0);
      };

      if (this.state === "fulfilled") {
        handleFulfilled();
      } else if (this.state === "rejected") {
        handleRejected();
      } else {
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally && onFinally();
        return value;
      },
      (reason) => {
        onFinally && onFinally();
        throw reason;
      }
    );
  }
}

window.CustomPromise = CustomPromise;
