import { useEffect, useRef, useState } from "react";

function useCurrentAndPrevious<T>(initialValue: T): [T, (val: T) => void, T | undefined] {
  const [current, setCurrent] = useState<T>(initialValue);
  const previousRef = useRef<T | undefined>(undefined);

  useEffect(() => {
    previousRef.current = current;
  }, [current]);

  return [current, setCurrent, previousRef.current];
}

export default useCurrentAndPrevious;