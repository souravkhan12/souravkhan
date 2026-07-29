// import { useState } from "react";

// function InfiniteScroll() {
//   const [data, setData] = useState([...new Array(60)]);
//   const [loading, setLoading] = useState(false);

//   function handleScroll(e) {
//     const { clientHeight, scrollHeight, scrollTop } = e.target;
//     const remHeight = scrollHeight - (clientHeight + scrollTop);
//     if (remHeight < 20) {
//       loadMore();
//     }
//   }

//   function loadMore() {
//     setLoading(true);
//     setTimeout(() => {
//       setData((prev) => [...prev, ...new Array(20)]);
//       setLoading(false);
//     }, 1000);
//   }

//   return (
//     <div
//       onScroll={handleScroll}
//       style={{ height: "100vh", overflowY: "auto", border: "1px solid black" }}
//     >
//       <ul>
//         {data.map((_, idx) => (
//           <li key={idx}>{idx + 1}</li>
//         ))}
//         {loading && <p>...loading Data Please Wait</p>}
//       </ul>
//     </div>
//   );
// }

// export default InfiniteScroll;

import { useEffect, useRef, useState } from "react";

function InfiniteScroll() {
  const [data, setData] = useState([...new Array(60)]);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef(null);

  function loadMore() {
    setLoading(true);
    setTimeout(() => {
      setData((prev) => [...prev, ...new Array(20)]);
      setLoading(false);
    }, 1000);
  }

  const lastElementRef = useRef(null);

  useEffect(() => {
    if (loading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    });

    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [data, loading]);

  return (
    <div
      style={{ height: "100vh", overflowY: "auto", border: "1px solid black" }}
    >
      <ul>
        {data.map((_, idx) => {
          const isLast = idx === data.length - 1;

          return (
            <li key={idx} ref={isLast ? lastElementRef : null}>
              {idx + 1}
            </li>
          );
        })}

        {loading && <p>...loading Data Please Wait</p>}
      </ul>
    </div>
  );
}

export default InfiniteScroll;
