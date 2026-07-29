import { Pagination } from "./pagination";

const Data = [...new Array(2000)].map((_, i) => i + 1);

export default function App() {
  return (
    <Pagination
      data={Data}
      pageSize={10}
      renderItem={(item) => (
        <li key={item} className="list-none">
          {item}
        </li>
      )}
      renderPagination={({ page, totalPages, goTo, next, prev }) => (
        <div className="mt-4 flex gap-2">
          <button onClick={prev} disabled={page === 1}>
            Prev
          </button>

          {[...new Array(Math.min(totalPages, 10))].map((_, idx) => {
            const p = idx + 1;
            return (
              <button
                key={p}
                onClick={() => goTo(p)}
                style={{
                  background: page === p ? "red" : "white",
                  border: "1px solid black",
                  padding: "4px 8px",
                }}
              >
                {p}
              </button>
            );
          })}

          <button onClick={next} disabled={page === totalPages}>
            Next
          </button>
        </div>
      )}
    />
  );
}
