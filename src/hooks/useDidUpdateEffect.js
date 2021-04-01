import React, { useState, useEffect, useRef } from 'react'
export default function useDidUpdateEffect(fn, inputs) {
  const fncRef = useRef();
  fncRef.current = fn;
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
    } else {
      return fncRef.current();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputs);
}