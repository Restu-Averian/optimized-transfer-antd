import Transfer from "./components";
import { mockData2 } from "./constants";

function App() {
  return (
    <div
      style={{
        justifyContent: "center",
        display: "flex",
      }}
    >
      <Transfer
        selectLabel="title"
        selectValue="value"
        datasource={mockData2}
        // value="value1,value2"
      />
    </div>
  );
}

export default App;
