import { useEffect, useRef } from 'react'

import _ from 'lodash'


// Source: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
const useInterval = (callback, delay) => {
  const savedCallback = useRef()

  // Remember latest callback.
  useEffect( () => {
    savedCallback.current = callback
  })

  // Apply the interval.
  useEffect(() => {
    const runCallback = () => savedCallback.current()

    if (!_.isNil(delay)) {
      const id = setInterval(runCallback, delay) // or let instead of const
      return () => clearInterval(id)
    }
  }, [delay])
}

export default useInterval
