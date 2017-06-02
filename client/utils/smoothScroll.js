/**
     Smoothly scroll element to the given target (element.scrollTop)
     for the given duration

    Returns a promise that's fulfilled when done, or rejected if
    interrupted
*/

/*  */
export default function (element, target, duration) {
  target = Math.round(target)
  duration = Math.round(duration)
  if (duration < 0) {
    return Promise.reject('bad duration')
  }
  if (duration === 0) {
    element.scrollTop = target
    return Promise.resolve()
  }

  var starttime = Date.now()
  var endtime = starttime + duration

  var starttop = element.scrollTop
  var distance = target - starttop

  // based on http://en.wikipedia.org/wiki/Smoothstep
  var smoothstep = function (start, end, point) {
    if (point <= start) { return 0 }
    if (point >= end) { return 1 }
    var x = (point - start) / (end - start) // interpolation
    return x * x * (3 - 2 * x)
  }

  return new Promise(function (resolve, reject) {
    // This is to keep track of where the element's scrollTop is
    // supposed to be, based on what we're doing
    var previoustop = element.scrollTop

    // This is like a think function from a game loop
    var scrollframe = function () {
      if (element.scrollTop !== previoustop) {
        reject('interrupted')
        return
      }

      // set the scrollTop for this frame
      var now = Date.now()
      var point = smoothstep(starttime, endtime, now)
      var frameTop = Math.round(starttop + (distance * point))
      element.scrollTop = frameTop

      // check if we're done!
      if (now >= endtime) {
        resolve()
        return
      }

      // If we were supposed to scroll but didn't, then we
      // probably hit the limit, so consider it done not
      // interrupted.
      if (element.scrollTop === previoustop && element.scrollTop !== frameTop) {
        resolve()
        return
      }
      previoustop = element.scrollTop

      // schedule next frame for execution
      setTimeout(scrollframe, 0)
    }

    // boostrap the animation process
    setTimeout(scrollframe, 0)
  })
}
